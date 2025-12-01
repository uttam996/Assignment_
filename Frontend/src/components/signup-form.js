import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { UseRegister } from "@/Hooks/ApiHooks/useAuthHook";
import { useUserList } from "@/Hooks/ApiHooks/useUserHook";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
export function SignupForm({ className, ...props }) {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        manager_id: "",
    });
    const { data } = useUserList({ role: "MANAGER" });
    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
    const { mutateAsync: register, isPending } = UseRegister();
    const navigate = useNavigate();
    const handleRegister = async () => {
        try {
            const data = {
                ...user,
            };
            if (!data.manager_id) {
                delete data.manager_id;
            }
            await register(user);
            toast.success("User registered successfully");
            navigate("/login");
        }
        catch (error) {
            toast.error(error?.response?.data?.message ||
                error.message ||
                "Something went wrong");
        }
    };
    return (_jsxs("div", { className: cn("flex flex-col gap-6 ", className), ...props, children: [_jsx(Card, { className: "overflow-hidden ", children: _jsxs(CardContent, { className: "grid p-0 md:grid-cols-2 ", children: [_jsxs(FieldGroup, { className: "flex flex-col items-center justify-center gap-6 p-4 md:p-10", children: [_jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Create your account" }), _jsx("p", { className: "text-muted-foreground text-sm text-balance", children: "Enter your email below to create your account" })] }), _jsxs(Field, { children: [_jsx(FieldLabel, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "m@example.com", required: true, name: "email", onChange: onChange })] }), _jsxs(Field, { children: [_jsx(FieldLabel, { htmlFor: "name", children: "Name" }), _jsx(Input, { id: "name", type: "text", onChange: onChange, placeholder: "John Doe", required: true, name: "name" })] }), _jsxs(Field, { children: [_jsx(FieldLabel, { htmlFor: "role", children: "Role" }), _jsxs(Select, { onValueChange: (e) => setUser({ ...user, role: e }), children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Select a Role" }) }), _jsx(SelectContent, { children: _jsxs(SelectGroup, { children: [_jsx(SelectLabel, { children: "Role" }), _jsx(SelectItem, { value: "EMPLOYEE", children: "EMPLOYEE" }), _jsx(SelectItem, { value: "MANAGER", children: "MANAGER" })] }) })] })] }), user.role === "EMPLOYEE" && (_jsxs(Field, { children: [_jsx(FieldLabel, { htmlFor: "manager_id", children: "Manager ID" }), _jsxs(Select, { onValueChange: (e) => setUser({ ...user, manager_id: e }), children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Select a Manager" }) }), _jsx(SelectContent, { children: _jsxs(SelectGroup, { children: [_jsx(SelectLabel, { children: "Manager" }), data?.data?.data?.map((user) => (_jsx(SelectItem, { value: user.id, children: user?.name }, user?.id)))] }) })] })] })), _jsxs(Field, { children: [_jsx(FieldLabel, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", onChange: onChange, name: "password", type: "password", required: true })] }), _jsx(Field, { children: _jsx(Button, { onClick: handleRegister, disabled: isPending, children: "Create Account" }) }), _jsxs(FieldDescription, { className: "text-center", children: ["Already have an account? ", _jsx(Link, { to: "/login", children: "Login" })] })] }), _jsx("div", { className: "bg-muted relative hidden md:block opacity-50", children: _jsx("img", { src: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80", alt: "Image", className: "absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" }) })] }) }), _jsxs(FieldDescription, { className: "px-6 text-center", children: ["By clicking continue, you agree to our ", _jsx("a", { href: "#", children: "Terms of Service" }), " ", "and ", _jsx("a", { href: "#", children: "Privacy Policy" }), "."] })] }));
}
