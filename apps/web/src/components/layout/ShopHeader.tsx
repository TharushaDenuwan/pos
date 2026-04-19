"use client";

import { authClient } from "@/lib/auth-client";
import { NAV_LINKS } from "@/lib/shop-data";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import {
  Heart,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
  X,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ShopHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b py-3 shadow-sm" : "bg-transparent py-5"
      }`}>
        <div className="content-container flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white transform transition-transform group-hover:rotate-6 shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-gray-900 border-b-2 border-blue-600">
              Nimesh Business Management
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative font-bold text-xs uppercase tracking-widest transition-all after:absolute after:bottom-[-6px] after:left-0 after:h-[3px] after:bg-blue-600 after:transition-all ${
                    isActive 
                      ? "text-blue-600 after:w-full" 
                      : "text-gray-500 hover:text-gray-900 after:w-0 hover:after:w-full"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4 justify-end">
            {!isPending && !session ? (
              <Button asChild variant="ghost" className="rounded-full font-bold hidden lg:flex">
                <Link href="/signin">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary lg:flex hidden relative overflow-hidden ring-1 ring-black/5">
                    {session?.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-none ring-1 ring-black/5">
                  <DropdownMenuLabel className="font-heading font-bold text-lg p-3">
                    <div className="flex flex-col">
                      <span>{session?.user.name}</span>
                      <span className="text-xs font-medium text-muted-foreground">{session?.user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuItem asChild className="rounded-xl h-12 cursor-pointer focus:bg-primary/5">
                    <Link href="/account" className="w-full">Account Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl h-12 cursor-pointer focus:bg-primary/5">
                    <Link href="/orders" className="w-full">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuItem
                    className="rounded-xl h-12 cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 font-bold"
                    onClick={async () => {
                      await authClient.signOut();
                      window.location.reload();
                    }}
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
          <div className="relative h-full flex flex-col p-8 pt-24 space-y-8">
            <nav className="flex flex-col space-y-6">
              <Link href="/" className="text-3xl font-heading font-bold" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="text-3xl font-heading font-bold" onClick={() => setMobileMenuOpen(false)}>{link.name}</Link>
              ))}
            </nav>

            <Separator />

            <div className="flex flex-col space-y-4 pt-4">
              <Button asChild className="h-14 rounded-2xl text-lg font-bold">
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </Button>
              <Button variant="outline" asChild className="h-14 rounded-2xl text-lg font-bold">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>

            <div className="mt-auto flex justify-center gap-8">
              <a href="#" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Truck className="w-5 h-5 text-muted-foreground" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
