import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import App from "./App.tsx";
import { SessionProvider } from "./context/SesionContext.tsx";
import "./styles/globals.css";

ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
).render(
    <React.StrictMode>
        <BrowserRouter>
            <SessionProvider>
                <App />
            </SessionProvider>
        </BrowserRouter>
    </React.StrictMode>
);