import { API } from "@/api.config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const UseLogin = () => {
    const login = async (data) => {
        return API.post("/auth/login", data);
    };
    return useMutation({
        mutationFn: login,
    });
};
export const UseRegister = () => {
    const register = async (data) => {
        return API.post("/auth/register", data);
    };
    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            localStorage.setItem("token", data.data.token);
            window.location.href = "/login";
        },
        onError: (error) => {
            return toast.error(error.message);
        },
    });
};
