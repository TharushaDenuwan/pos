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
          const isActive = item.url === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "relative h-11 px-4 rounded-xl transition-all duration-200 group/item overflow-hidden",
                  isActive 
                    ? "bg-blue-600/10 text-blue-600 font-bold dark:bg-blue-400/10 dark:text-blue-400 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.1)]" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                  item.items && item.items.length > 0 && "justify-between"
                )}
                onClick={() => item.items?.length && toggleExpand(item.title)}
              >
                <Link href={item.url} className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-300",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover/item:text-gray-900 dark:group-hover/item:text-white"
                  )}>
                    <item.icon className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="flex-1 text-sm tracking-tight">{item.title}</span>
                  
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full shadow-[2px_0_10px_rgba(37,99,235,0.4)]" />
                  )}

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
                  <div className="ml-9 mt-1 space-y-1 border-l border-gray-100 dark:border-white/5 pl-2">
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      return (
                        <SidebarMenuButton
                          key={subItem.title}
                          asChild
                          className={cn(
                            "h-9 px-3 rounded-lg text-sm transition-colors",
                            isSubActive 
                              ? "text-blue-600 font-bold dark:text-blue-400" 
                              : "text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                          )}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      );
                    })}
                  </div>
                )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
