"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GalleryVerticalEnd, Map, SquareTerminal, Users2 } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar";
import { useUserStore } from "@/Store/store";
export const data = {
    user: {
        name: "uttam",
        email: "uttam@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "ABC Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "EMPLOYEE",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "User List",
                    url: "/user",
                },
            ],
        },
        {
            title: "REQUESTS",
            url: "#",
            icon: Map,
            isActive: true,
            items: [
                {
                    title: "Request List",
                    url: "/request",
                },
            ],
        },
    ],
    setting: [
        {
            name: "Setting",
            url: "/home/setting",
            icon: _jsx(Users2, {}),
        },
    ],
};
export function AppSidebar({ ...props }) {
    const user = useUserStore((state) => state.user);
    return (_jsxs(Sidebar, { collapsible: "icon", ...props, children: [_jsx(SidebarHeader, { children: _jsx(TeamSwitcher, { teams: data.teams }) }), _jsx(SidebarContent, { children: _jsx(NavMain, { items: data.navMain }) }), _jsx(SidebarFooter, { children: _jsx(NavUser, { user: {
                        name: user?.name,
                        email: user?.email,
                        avatar: "/avatar.png",
                    } }) }), _jsx(SidebarRail, {})] }));
}
