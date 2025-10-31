import { useState, useRef, useEffect } from "react";
import Monopoly from "./monopoly.tsx";
import "../../home.css";
import { Server, Socket, io } from "../../assets/sockets.ts";
import NotifyElement, { NotificatorRef } from "../../components/notificator.tsx";
import { MonopolyCookie, User } from "../../assets/types.ts";
import { useParams, useNavigate } from "react-router-dom";

// env
// import { FirebaseApp, initializeApp } from "firebase/app";
// import { doc, getDoc, getFirestore } from "firebase/firestore";

import { main as onlineServer } from "../../assets/server.ts";
import { TranslateCode } from "../../assets/code.ts";
import { CookieManager } from "../../assets/cookieManager.ts";

export default function Home() {
    const { code: urlCode } = useParams<{ code?: string }>();
    const navigate = useNavigate();
    
    console.log("Home component rendering, urlCode:", urlCode);
    
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

    // Server Stuff
    const [server, SetServer] = useState<Server | undefined>(undefined);
    const serverPCount = 6;

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
    }, [urlCode, isSignedIn, disabled, addr]);

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


    useEffect(() => {
        console.log("Home render state:", {
            socket: socket !== undefined,
            isSignedIn,
            urlCode,
            name,
            disabled
        });
        
        // Debug: Check if elements exist in DOM
        setTimeout(() => {
            const entrySimple = document.querySelector('.entry-simple');
            const title = document.querySelector('.monopoly-title');
            console.log("DOM elements:", {
                entrySimple: !!entrySimple,
                title: !!title,
                entrySimpleStyles: entrySimple ? window.getComputedStyle(entrySimple as Element) : null,
                rootElement: document.getElementById('root')
            });
        }, 100);
    }, [socket, isSignedIn, urlCode, name, disabled]);

    return socket !== undefined && isSignedIn === true ? (
        <Monopoly socket={socket} name={name} server={server} />
    ) : (
        <>
            <NotifyElement ref={notifyRef} />
            <div 
                className="entry-simple"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '30px',
                    width: '100%',
                    maxWidth: '400px',
                    zIndex: 1
                }}
            >
                <main style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%'
                }}>
                    <h1 
                        className="monopoly-title"
                        style={{
                            fontSize: '48px',
                            fontWeight: 700,
                            color: 'white',
                            margin: 0,
                            textAlign: 'center',
                            letterSpacing: '2px'
                        }}
                    >
                        Monopoly
                    </h1>
                    <div className="name-input-group" style={{ width: '100%' }}>
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
                            style={{
                                width: '100%',
                                fontSize: '20px',
                                color: 'white',
                                backgroundColor: 'rgba(30, 30, 30, 1)',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px',
                                padding: '15px 20px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    {urlCode ? (
                        <>
                            <p style={{ color: "white", margin: "10px 0", textAlign: "center" }}>
                                Joining game: <strong>{urlCode}</strong>
                            </p>
                            <button 
                                onClick={joinButtonClicked} 
                                disabled={disabled}
                                style={{
                                    fontSize: '22px',
                                    fontWeight: 600,
                                    color: 'white',
                                    backgroundColor: '#0075ff',
                                    border: 0,
                                    borderRadius: '10px',
                                    padding: '15px 50px',
                                    cursor: disabled ? 'wait' : 'pointer',
                                    width: '100%',
                                    opacity: disabled ? 0.5 : 1
                                }}
                            >
                                Join Game
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={createGame} 
                            disabled={disabled}
                            style={{
                                fontSize: '22px',
                                fontWeight: 600,
                                color: 'white',
                                backgroundColor: '#0075ff',
                                border: 0,
                                borderRadius: '10px',
                                padding: '15px 50px',
                                cursor: disabled ? 'wait' : 'pointer',
                                width: '100%',
                                opacity: disabled ? 0.5 : 1
                            }}
                        >
                            Create Game
                        </button>
                    )}
                </main>
            </div>
        </>
    );
}
