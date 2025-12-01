"use client";

import { GalleryVerticalEnd, Map, SquareTerminal, Users2 } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
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
      icon: <Users2 />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state: any) => state.user);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name,
            email: user?.email,
            avatar: "/avatar.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
