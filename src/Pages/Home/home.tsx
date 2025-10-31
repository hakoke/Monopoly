import { useState, useRef, useEffect } from "react";
import Monopoly from "./monopoly.tsx";
import "../../home.css";
import { Server, Socket, io } from "../../assets/sockets.ts";
import NotifyElement, { NotificatorRef } from "../../components/notificator.tsx";
import { MonopolyCookie, User, botInitial } from "../../assets/types.ts";
import SettingsNav from "../../components/settingsNav.tsx";
import { useParams, useNavigate } from "react-router-dom";

// import LoginScreen from "../../components/menu/loginscreen.tsx";
import JoinScreen from "../../components/menu/joinScreen.tsx";
// env
// import { FirebaseApp, initializeApp } from "firebase/app";
// import { doc, getDoc, getFirestore } from "firebase/firestore";

import { main as onlineServer } from "../../assets/server.ts";
import { main as botServer } from "../../assets/bot/server.ts";
import { main as runBot } from "../../assets/bot/bot.ts";
import Slider from "../../components/utils/slider.tsx";
import { TranslateCode } from "../../assets/code.ts";
import { CookieManager } from "../../assets/cookieManager.ts";

export default function Home() {
    const { code: urlCode } = useParams<{ code?: string }>();
    const navigate = useNavigate();
    
    var cookie: MonopolyCookie;
    try {
        const getCookieString = CookieManager.get("monopolySettings");
        if (getCookieString === null) throw new Error("no cookie");
        const obj = JSON.parse(decodeURIComponent(getCookieString));
        cookie = obj;
    } catch {
        cookie = {
            login: {
                remember: false,
                id: "",
            },
        } as MonopolyCookie;

        CookieManager.set("monopolySettings", encodeURIComponent(JSON.stringify(cookie as MonopolyCookie)));
    }

    const notifyRef = useRef<NotificatorRef>(null);
    const [socket, SetSocket] = useState<Socket>();
    // Gameplay stuff
    const [name, SetName] = useState<string>("");
    const [addr, SetAddress] = useState<string>("");

    // Account stuff
    // const [firebase, setFirebase] = useState<FirebaseApp>();
    const [
        remember,
        // @ts-ignore
        SetRemember,
    ] = useState<boolean>(cookie.login.remember);
    const [
        fbUser,
        // @ts-ignore
        SetFbUser,
    ] = useState<User>();

    const [disabled, SetDisabled] = useState<boolean>(false);
    const [isSignedIn, SetSignedIn] = useState<boolean>(false);
    const [tabIndex, SetTab] = useState<number>(0);

    // Server Stuff
    const [server, SetServer] = useState<Server | undefined>(undefined);
    const [serverPCount, SetServerPCount] = useState<number>(6);

    useEffect(() => {
        document.title = "Monopoly";
        // const _firebase = initializeApp(ENV.firebase);
        // setFirebase(_firebase);
        var cookie: MonopolyCookie;
        try {
            const obj = JSON.parse(decodeURIComponent(CookieManager.get("monopolySettings") as string));
            cookie = obj;
            if (cookie.login.remember && cookie.login.id.length > 0) {
                // const db = getFirestore(_firebase);
                // getDoc(doc(db, `Users/${cookie.login.id}`)).then((v) => {
                //     const userData = v.data() as User;
                //     SetFbUser(userData);
                //     SetName(userData.name);
                // });
            }
        } catch {}
    }, []);

    // Handle auto-join when URL has game code
    useEffect(() => {
        if (urlCode && !isSignedIn && !disabled && urlCode !== addr) {
            SetAddress(urlCode);
        }
    }, [urlCode, isSignedIn, disabled]);

    const joinButtonClicked = async () => {
        if (name.replace(" ", "").length === 0) {
            notifyRef.current?.message("please add your name before joining", "info", 2);
            return;
        }

        if (!addr || addr.replace(" ", "").length === 0) {
            notifyRef.current?.message("please enter a game code", "info", 2);
            return;
        }

        try {
            const cookie = JSON.parse(decodeURIComponent(CookieManager.get("monopolySettings") as string)) as MonopolyCookie;
            if (fbUser === undefined) throw Error("undefined");

            cookie.login = {
                id: fbUser.id,
                remember,
            };

            CookieManager.set("monopolySettings", encodeURIComponent(JSON.stringify(cookie as MonopolyCookie)));
        } catch {
            const cookie = {
                login: {
                    id: "",
                    remember: false,
                },
            } as MonopolyCookie;
            CookieManager.set("monopolySettings", encodeURIComponent(JSON.stringify(cookie as MonopolyCookie)));
        }
        SetDisabled(true);

        const address = TranslateCode(addr) as string;
        var socket: Socket;
        // const address = "localhost"
        try {
            socket = await io(address);
            socket.emit("name", name);

            socket.on("state", (args: number) => {
                console.log("state");
                switch (args) {
                    case 0:
                        SetSocket(socket);
                        SetSignedIn(true);
                        SetDisabled(false);
                        break;
                    case 1:
                        notifyRef.current?.message("the game has already begun", "error", 2, () => {
                            SetDisabled(false);
                        });
                        socket.disconnect();
                        break;
                    case 2:
                        notifyRef.current?.message("too many players on the server", "error", 2, () => {
                            SetDisabled(false);
                        });
                        socket.disconnect();
                        break;
                    default:
                        notifyRef.current?.message("unkown error", "error", 2, () => {
                            SetDisabled(false);
                        });
                        socket.disconnect();

                        break;
                }
            });
        } catch (r) {
            notifyRef.current?.message(`Could not connect to game with code ${addr}`, "error", 2, () => {
                SetDisabled(false);
            });
        }
    };

    useEffect(() => {
        const uriParams = new URLSearchParams(document.location.search);
        if (uriParams.has("ip")) {
            SetAddress(uriParams.get("ip") ?? "");
        }
    }, []);

    function createGame() {
        try {
            if (name.replace(" ", "").length === 0) {
                notifyRef.current?.message("please add your name before creating a game", "info", 2);
                return;
            }

            onlineServer(serverPCount, async (host, server) => {
                SetDisabled(true);
                server.code = host;
                SetAddress(host);
                SetServer(server);
                
                // Update URL with game code
                const basePath = import.meta.env.BASE_URL || "/";
                const normalizedBase = basePath.replace(/\/$/, "") || "";
                navigate(`${normalizedBase}/game/${host}`);
                
                const socket = await io(TranslateCode(host));
                socket.emit("name", name);
                
                socket.on("state", (args: number) => {
                    switch (args) {
                        case 0:
                            SetSocket(socket);
                            SetSignedIn(true);
                            SetDisabled(false);
                            break;
                        case 1:
                            notifyRef.current?.message("the game has already begun", "error", 2, () => {
                                SetDisabled(false);
                            });
                            socket.disconnect();
                            break;
                        case 2:
                            notifyRef.current?.message("too many players on the server", "error", 2, () => {
                                SetDisabled(false);
                            });
                            socket.disconnect();
                            break;
                        default:
                            notifyRef.current?.message("unkown error", "error", 2, () => {
                                SetDisabled(false);
                            });
                            socket.disconnect();
                            break;
                    }
                });
            });
        } catch {
            SetDisabled(false);
        }
    }

    function startButtonClicked(bots: botInitial[]) {
        try {
            if (name.replace(" ", "").length === 0) {
                notifyRef.current?.message("please add your name before joining", "info", 2);
                return;
            }

            botServer(async (server) => {
                SetDisabled(true);
                const socket = await io(TranslateCode(server.code));
                for (const x of bots) {
                    runBot(TranslateCode(server.code), x);
                }
                socket.on("state", (args: number) => {
                    switch (args) {
                        case 0:
                            SetSocket(socket);
                            SetSignedIn(true);
                            SetServer(server);
                            SetDisabled(false);

                            break;
                        case 1:
                            notifyRef.current?.message("the game has already begun", "error", 2, () => {
                                SetDisabled(false);
                            });
                            socket.disconnect();
                            break;
                        case 2:
                            notifyRef.current?.message("too many players on the server", "error", 2, () => {
                                SetDisabled(false);
                            });
                            socket.disconnect();
                            break;
                        default:
                            notifyRef.current?.message("unkown error", "error", 2, () => {
                                SetDisabled(false);
                            });
                            socket.disconnect();

                            break;
                    }
                });
            });
        } catch {
            SetDisabled(false);
        }
    }

    return socket !== undefined && isSignedIn === true ? (
        <Monopoly socket={socket} name={name} server={server} />
    ) : (
        <>
            <NotifyElement ref={notifyRef} />
            <div className="entry-simple">
                <main>
                    <h1 className="monopoly-title">Monopoly</h1>
                    <div className="name-input-group">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => SetName(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !disabled && name.replace(" ", "").length > 0) {
                                    if (urlCode) {
                                        joinButtonClicked();
                                    } else {
                                        createGame();
                                    }
                                }
                            }}
                            disabled={disabled}
                        />
                            </div>
                    {urlCode ? (
                        <>
                            <p style={{ color: "white", margin: "10px 0", textAlign: "center" }}>
                                Joining game: <strong>{urlCode}</strong>
                            </p>
                            <button onClick={joinButtonClicked} disabled={disabled}>
                                Join Game
                                        </button>
                        </>
                    ) : (
                        <button onClick={createGame} disabled={disabled}>
                            Create Game
                        </button>
                    )}
                </main>
            </div>
        </>
    );
}
