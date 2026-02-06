"use client";

import { Badge } from "@repo/ui/components/badge";

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  image?: string;
}

export function PageHeader({ title, description, badge, image }: PageHeaderProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-neutral-900">
      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        </div>
      )}

      {!image && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
      )}

      <div className="content-container relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {badge && (
            <Badge className="px-3 py-1 bg-white/10 text-white border-white/20 text-[10px] font-black tracking-widest uppercase rounded-full">
              {badge}
            </Badge>
          )}
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white tracking-tighter leading-tight italic">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
