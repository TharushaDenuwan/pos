"use client";

import {
  IconCar,
  IconDashboard,
  IconSettings,
  IconDroplet
} from "@tabler/icons-react";
import * as React from "react";

// import { NavMain } from "@/components/dashboard/nav-main";
import { NavStore } from "@/components/dashboard/nav-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import Link from "next/link";
import { Logo } from "../logo";
// import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navStore: [
    {
      title: "DASHBOARD",
      icon: IconDashboard,
      isActive: true,
      url: "/admin/dashboard",
    },
    // {
    //   title: "BUILDING MATERIAL MANAGEMENT",
    //   icon: IconBuilding,
    //   isActive: true,
    //   url: "/admin/material-management",
    // },
    {
      title: "HIRE MANAGEMENT",
      icon: IconCar,
      isActive: true, // This is a default value, highlighting is handled by NavStore
      url: "/admin/hire-management",
    },
    {
      title: "VEHICLE MAINTENANCE",
      icon: IconSettings,
      isActive: true,
      url: "/admin/maintenance",
    },
    {
      title: "OIL CHANGE TRACKER",
      icon: IconDroplet,
      isActive: true,
      url: "/admin/oil-change",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {/* <a href="#">
                <ComputerIcon className="!size-5" />
                <span className="text-sm text-muted-foreground font-heading font-bold">{`${SITE_NAME} | Admin`}</span>
              </a> */}
              <Link href="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavStore items={data.navStore} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
