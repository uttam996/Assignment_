import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";
createRoot(document.getElementById("root")).render(_jsxs(StrictMode, { children: [_jsx(App, {}), _jsx(Toaster, {})] }));
