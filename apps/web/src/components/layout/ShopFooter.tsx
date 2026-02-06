"use client";

import { NAV_LINKS } from "@/lib/shop-data";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function ShopFooter() {
  return (
    <footer className="bg-white pt-24 pb-12 overflow-hidden border-t border-black/5">
      <div className="content-container">
        {/* Newsletter Section */}
        <div className="relative rounded-[40px] bg-neutral-900 p-8 md:p-16 overflow-hidden mb-24">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent blur-3xl rounded-full translate-x-1/2" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tighter">
                Stay Ahead of <br /> the Curve.
              </h2>
              <p className="text-neutral-400 text-lg max-w-md">
                Get early access to new drops, exclusive styling tips, and members-only collections.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your email"
                className="h-16 rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/50 text-lg px-6"
              />
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold group">
                Subscribe <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2 group cursor-pointer inline-flex">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground transform transition-transform group-hover:rotate-6">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xl font-heading font-extrabold tracking-tighter">COREWAVEZ.</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Redefining contemporary style through precision craftsmanship and sustainable innovation. Join our global community of visionaries.
            </p>
            <div className="flex gap-4">
              {['TW', 'IG', 'FB', 'TK'].map(s => (
                <a key={s} href="#" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-white transition-all">{s}</a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Shop</h4>
            <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Company</h4>
            <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
              <a href="#" className="hover:text-primary transition-colors">Sustainability</a>
              <a href="#" className="hover:text-primary transition-colors">Press</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm tracking-widest uppercase">Legal</h4>
            <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
              <a href="#" className="hover:text-primary transition-colors">Ethics</a>
            </nav>
          </div>
        </div>

        <Separator className="bg-black/5" />

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground font-medium">© 2025 CoreWavez Commerce Inc. All rights reserved.</p>
          <div className="flex gap-2 opacity-50">
            {['VISA', 'MC', 'AX', 'PP'].map(p => (
              <div key={p} className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[8px] font-bold">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
