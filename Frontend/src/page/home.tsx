import { API } from "@/api.config";
import { AppSidebar } from "@/components/app-sidebar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/Store/store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Home() {
  const { user, setUser,logout } = useUserStore((state: any) => state);

  const navigate = useNavigate();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await API.get("/auth/token/verify");
          if (response.status === 200) {
            console.log("Token is valid");
            setUser(response.data.user);
          } else {

            navigate("/login");
            logout()
          }
        } else {
          navigate("/login");
          logout()
        }
      } catch (error) {
        //

        console.error("Error verifying token:", error);
        navigate("/login");
        logout()
      }
    };

    verifyToken();
  }, []);

  console.log(user);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Label>{user?.role}</Label>
          </div>
        </header>
        <div className="bg-muted/50 w-full h-full">
          <div className="p-4  ">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
