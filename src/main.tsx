import ReactDOM from "react-dom/client";
// @ts-ignore
import { BrowserRouter as Router, Route, Routes, RouterProvider, createBrowserRouter } from "react-router-dom";
import Gallery from "./Pages/Galery/gallery.tsx";
import Home from "./Pages/Home/home.tsx";
import Users from "./Pages/Users/users.tsx";

// Get base path from Vite (defaults to "/" or "/Monopoly/" if set via env var)
const basePath = import.meta.env.BASE_URL;

// Remove trailing slash and normalize
const normalizeBase = (path: string) => path.replace(/\/$/, "") || "/";

// Get routes based on base path
const getRoutes = () => {
    const base = normalizeBase(basePath);
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

function App() {
    try {
        return <RouterProvider router={router} />;
    } catch (error) {
        console.error("App error:", error);
        return <div style={{ color: "white", padding: "20px" }}>Error loading app. Please refresh the page.</div>;
    }
}

document.title = "Monopoly";

const rootElement = document.getElementById("root");
if (rootElement) {
    try {
        ReactDOM.createRoot(rootElement).render(<App />);
    } catch (error) {
        console.error("React render error:", error);
        rootElement.innerHTML = '<div style="color: white; padding: 20px; background: black;">Error loading application. Please refresh.</div>';
    }
} else {
    console.error("Root element not found!");
}
