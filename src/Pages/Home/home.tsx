import { useState, useRef, useEffect } from "react";
import Monopoly from "./monopoly.tsx";
import "../../home.css";
import { Server, Socket, io } from "../../assets/sockets.ts";
import NotifyElement, { NotificatorRef } from "../../components/notificator.tsx";
import { MonopolyCookie, User } from "../../assets/types.ts";
import { useParams, useNavigate } from "react-router-dom";
import Dice3D from "../../components/Dice3D.tsx";

// env
// import { FirebaseApp, initializeApp } from "firebase/app";
// import { doc, getDoc, getFirestore } from "firebase/firestore";

import { main as onlineServer } from "../../assets/server.ts";
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
        console.log("Create game clicked, name:", name);
        try {
            if (name.replace(" ", "").length === 0) {
                notifyRef.current?.message("please add your name before creating a game", "info", 2);
                return;
            }

            console.log("Starting server creation...");
            SetDisabled(true);
            
            // Show loading message
            notifyRef.current?.message("Creating game server... Please wait.", "info", 3, undefined, false);
            
            // Add timeout to detect if server creation hangs
            const creationTimeout = setTimeout(() => {
                console.error("Server creation is taking too long (>10s)");
                notifyRef.current?.message("⚠️ Server connection failed. PeerJS cloud servers may be unreachable. Please try again or contact support.", "error", 8);
                SetDisabled(false);
            }, 10000);
            
            onlineServer(serverPCount, async (host, server) => {
                clearTimeout(creationTimeout);
                console.log("Server created with code:", host);
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
        } catch (error) {
            console.error("Error creating game:", error);
            SetDisabled(false);
        }
    }



    return socket !== undefined && isSignedIn === true ? (
        <Monopoly socket={socket} name={name} server={server} />
    ) : (
        <>
            <NotifyElement ref={notifyRef} />
            <div className="entry-page">
                <div className="entry-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>
                <div className="entry-container">
                    <div className="entry-header">
                        <Dice3D animated={true} value1={3} value2={4} />
                        <h1 className="monopoly-title">
                            <span className="title-main">MONOPOLY</span>
                            <span className="title-subtitle">Multiplayer Edition</span>
                        </h1>
                    </div>
                    
                    <div className="entry-form">
                        <div className="input-wrapper">
                            <label htmlFor="player-name" className="input-label">
                                Player Name
                            </label>
                            <input
                                id="player-name"
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
                                className="player-input"
                            />
                        </div>

                        {urlCode && (
                            <div className="game-code-display">
                                <span className="code-label">Joining Game:</span>
                                <span className="code-value">{urlCode}</span>
                            </div>
                        )}

                        <button
                            onClick={urlCode ? joinButtonClicked : createGame}
                            disabled={disabled}
                            className={`action-button ${disabled ? 'disabled' : ''}`}
                        >
                            {disabled ? (
                                <span className="button-content">
                                    <span className="button-spinner"></span>
                                    {urlCode ? 'Joining...' : 'Creating...'}
                                </span>
                            ) : (
                                <span className="button-content">
                                    {urlCode ? 'Join Game' : 'Create Game'}
                                    <span className="button-arrow">→</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
