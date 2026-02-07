"use client";

import {
    IconDashboard,
    IconPackage,
    IconSettings,
    IconShieldLock
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
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
  ],
  navStore: [
    {
      title: "Store Management",
      icon: IconPackage,
      isActive: true,
      url: "/admin/arrivals",
      items: [
        {
          title: "New Arrivals",
          url: "/admin/arrivals",
        },
        {
          title: "Orders",
          url: "/admin/orders",
        },
        {
          title: "Reviews",
          url: "/admin/reviews",
        },
      ],
    },
    {
      title: "Administration",
      icon: IconShieldLock,
      isActive: false,
      url: "/admin/users",
      items: [
        {
          title: "User Management",
          url: "/admin/users",
        },
        {
          title: "Staff Operations",
          url: "/admin/staff",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
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
