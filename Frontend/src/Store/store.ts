import { create } from "zustand";

export const useUserStore = create((set) => ({
  token: localStorage.getItem("token") || "",
  user: null,
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: "" }),

  setUser: (user: any) => set({ user }),
  logout:()=>{
    set({
      token: "",
      user: null
    })
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
}));
