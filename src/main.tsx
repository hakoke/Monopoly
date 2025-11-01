import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignoree
import { BrowserRouter as Router, Route, Routes, RouterProvider, createBrowserRouter } from "react-router-dom";
import Gallery from "./Pages/Galery/gallery.tsx";
import Home from "./Pages/Home/home.tsx";
import Users from "./Pages/Users/users.tsx";

// Get base path from Vite (defaults to "/" or "/Monopoly/" if set via env var)
const basePath = import.meta.env.BASE_URL || "/";

console.log("Base path from Vite:", basePath);

// Remove trailing slash and normalize
const normalizeBase = (path: string) => path.replace(/\/$/, "") || "/";

// Get routes based on base path
const getRoutes = () => {
    const base = normalizeBase(basePath);
    console.log("Normalized base path:", base);
    // If base is "/", use root routes. If "/Monopoly", use Monopoly routes
    if (base === "/") {
        return [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/game/:code",
                element: <Home />,
            },
            {
                path: "/gallery",
                element: <Gallery />,
            },
            {
                path: "/users",
                element: <Users />,
            },
            // Catch-all route for SPA routing
            {
                path: "*",
                element: <Home />,
            },
        ];
    } else {
        // For GitHub Pages with /Monopoly/ base
        return [
            {
                path: base,
                element: <Home />,
            },
            {
                path: `${base}/game/:code`,
                element: <Home />,
            },
            {
                path: `${base}/gallery`,
                element: <Gallery />,
            },
            {
                path: `${base}/users`,
                element: <Users />,
            },
            // Catch-all route for SPA routing
            {
                path: "*",
                element: <Home />,
            },
        ];
    }
};

const router = createBrowserRouter(getRoutes(), {
    basename: basePath && basePath !== "/" ? basePath : undefined,
});

console.log("Router created with basename:", basePath && basePath !== "/" ? basePath : undefined);

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("React Error Boundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: "white", padding: "20px", background: "black", minHeight: "100vh" }}>
                    <h1>Something went wrong</h1>
                    <p>{this.state.error?.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}
                    >
                        Reload Page
                    </button>
                    <details style={{ marginTop: "20px" }}>
                        <summary>Error Details</summary>
                        <pre style={{ background: "#333", padding: "10px", overflow: "auto" }}>
                            {this.state.error?.stack}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    return <RouterProvider router={router} />;
}

document.title = "Monopoly";

console.log("Initializing React app...");

const rootElement = document.getElementById("root");
if (rootElement) {
    console.log("Root element found, creating React root...");
    try {
        const root = ReactDOM.createRoot(rootElement);
        console.log("React root created, rendering app...");
        root.render(
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        );
        console.log("App rendered successfully!");
    } catch (error) {
        console.error("React render error:", error);
        rootElement.innerHTML = '<div style="color: white; padding: 20px; background: black;">Error loading application. Please refresh.</div>';
    }
} else {
    console.error("Root element not found!");
    document.body.innerHTML = '<div style="color: white; padding: 20px; background: black;">Root element not found!</div>';
}
