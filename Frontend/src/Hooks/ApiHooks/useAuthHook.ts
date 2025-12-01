import { API } from "@/api.config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const UseLogin = () => {
  const login = async (data: { email: string; password: string }) => {
    return API.post("/auth/login", data);
  };
  return useMutation({
    mutationFn: login,
    
    
  });
};


export const UseRegister = () => {
  const register = async (data: { name: string; email: string; password: string, role: string, manager_id?: string }) => {
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
