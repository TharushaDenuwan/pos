import { SITE_NAME } from "@/lib/constants";
import { Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col gap-10">
        <Link href="/" className="flex items-center gap-3 self-center group transition-transform hover:scale-105">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-2xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
            <Zap className="size-5 fill-current" />
          </div>
          <span className="font-heading text-2xl font-black tracking-tighter text-foreground">
            {SITE_NAME.toUpperCase()}
          </span>
        </Link>

        <div className="w-full">
          {children}
        </div>

        <footer className="text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium italic">
            "The future of commerce is here."
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground/60 font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Help</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
