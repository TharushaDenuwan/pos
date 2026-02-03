"use client";

import { IconChevronDown, type Icon } from "@tabler/icons-react";
import { useState } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StoreNavItem {
  title: string;
  url: string;
  icon: Icon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavStore({ items }: { items: StoreNavItem[] }) {
  const { isMobile } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const pathname = usePathname();

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Control Panel</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive && "bg-accent",
                  item.items && item.items.length > 0 && "justify-between"
                )}
                onClick={() => item.items?.length && toggleExpand(item.title)}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                  {item.items && item.items.length > 0 && (
                    <IconChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform",
                        expandedItems[item.title] && "transform rotate-180"
                      )}
                    />
                  )}
                </Link>
              </SidebarMenuButton>

              {/* Render nested items if they exist and are expanded */}
              {item.items &&
                item.items.length > 0 &&
                expandedItems[item.title] && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuButton
                        key={subItem.title}
                        asChild
                        className="py-1 text-sm"
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ))}
                  </div>
                )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
