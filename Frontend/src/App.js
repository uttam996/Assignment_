import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/home";
import LoginPage from "./page/login";
import SignupPage from "./page/sign-up";
import { RequestList } from "./page/Request/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Userlist } from "./page/User/page";
function App() {
    const queryClient = new QueryClient();
    return (_jsx(_Fragment, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsxs(Route, { path: "/", element: _jsx(Home, {}), children: [_jsx(Route, { path: "/request", element: _jsx(RequestList, {}) }), _jsx(Route, { path: "/user", element: _jsx(Userlist, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }) }) }));
}
export default App;
