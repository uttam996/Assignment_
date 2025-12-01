import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UseLogin } from "@/Hooks/ApiHooks/useAuthHook";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/Store/store";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
export function LoginForm({ className, ...props }) {
    const [form, setForm] = React.useState({
        email: "",
        password: "",
    });
    const setToken = useUserStore((state) => state.setToken);
    const handleOnchnage = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const { mutateAsync: login, isPending } = UseLogin();
    const navigate = useNavigate();
    const onSubmit = async () => {
        try {
            const data = await login(form);
            const token = data?.data?.token;
            localStorage.setItem("token", token);
            setToken(token);
            navigate("/request");
            setForm({
                email: "",
                password: "",
            });
        }
        catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
        }
    };
    return (_jsxs("div", { className: cn("flex flex-col gap-6", className), ...props, children: [_jsx(Card, { className: "overflow-hidden p-0", children: _jsxs(CardContent, { className: "grid p-0 md:grid-cols-2", children: [_jsx("div", { className: "p-6 md:p-8", children: _jsxs(FieldGroup, { children: [_jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Welcome back" }), _jsx("p", { className: "text-muted-foreground text-balance", children: "Login to your  account" })] }), _jsxs(Field, { children: [_jsx(FieldLabel, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", name: "email", placeholder: "m@example.com", required: true, onChange: handleOnchnage })] }), _jsxs(Field, { children: [_jsxs("div", { className: "flex items-center", children: [_jsx(FieldLabel, { htmlFor: "password", children: "Password" }), _jsx("a", { href: "#", className: "ml-auto text-sm underline-offset-2 hover:underline", children: "Forgot your password?" })] }), _jsx(Input, { id: "password", name: "password", type: "password", onChange: handleOnchnage, required: true })] }), _jsx(Field, { children: _jsx(Button, { onClick: onSubmit, disabled: isPending, children: "Login" }) }), _jsxs(FieldDescription, { className: "text-center", children: ["Don't have an account? ", _jsx(Link, { to: "/signup", children: "Sign up" })] })] }) }), _jsx("div", { className: "bg-muted relative hidden md:block opacity-20", children: _jsx("img", { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", alt: "Image", className: "absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" }) })] }) }), _jsxs(FieldDescription, { className: "px-6 text-center", children: ["By clicking continue, you agree to our ", _jsx("a", { href: "#", children: "Terms of Service" }), " ", "and ", _jsx("a", { href: "#", children: "Privacy Policy" }), "."] })] }));
}
