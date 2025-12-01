import { jsx as _jsx } from "react/jsx-runtime";
import { SignupForm } from "@/components/signup-form";
export default function SignupPage() {
    return (_jsx("div", { className: "bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10", children: _jsx("div", { className: "w-full max-w-sm md:max-w-4xl ", children: _jsx(SignupForm, {}) }) }));
}
