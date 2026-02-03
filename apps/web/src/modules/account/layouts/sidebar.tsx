"use client";

import { SignoutButton } from "@/features/auth/components/signout-button";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { DollarSignIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {};

function SidebarItem({
  children,
  link,
  icon
}: {
  children: React.ReactNode;
  link: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Button
      asChild
      className="w-full text-left rounded-sm flex flex-row items-start justify-start gap-2"
      variant={pathname === link ? "secondary" : "ghost"}
      icon={icon}
    >
      <Link href={link}>{children}</Link>
    </Button>
  );
}

export default function AccountSidebar({}: Props) {
  return (
    <aside className="w-full">
      <Card className="w-full h-fit p-1 flex flex-col gap-2 rounded-sm">
        <SidebarItem link="/account" icon={<UserIcon />}>
          Account Overview
        </SidebarItem>
        <SidebarItem link="/account/orders" icon={<DollarSignIcon />}>
          Orders
        </SidebarItem>
        <SidebarItem link="/cart" icon={<ShoppingBagIcon />}>
          Cart
        </SidebarItem>

        <SignoutButton />
      </Card>
    </aside>
  );
}
