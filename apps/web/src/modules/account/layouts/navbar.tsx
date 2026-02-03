"use client";

import { Logo } from "@/components/logo";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AccountNavbar() {
  const session = authClient.useSession();

  return (
    <nav className="w-full h-14 bg-muted shadow-lg">
      <div className="content-container mx-auto h-full flex items-center justify-between">
        {/* Back to Home */}
        <div className="">
          <Button asChild icon={<ArrowLeft />} variant={"ghost"}>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        <div className="">
          {session.data && (
            <div>
              <p className="text-foreground/60 text-xs">Hello,</p>
              <p className="text-sm text-foreground">
                {session.data.user.name || session.data.user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
