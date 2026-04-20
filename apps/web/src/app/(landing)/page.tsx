"use client";

import {
  ArrowRight,
  BarChart3,
  Building2,
  Car,
  Users,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Material Tracking",
    icon: Building2,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Financial Analytics",
    icon: BarChart3,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Vehicle Fleet",
    icon: Car,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "HR Management",
    icon: Users,
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans">
      {/* ─── VIDEO BACKGROUND ─── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-60"
        >
          <source src="/back.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* Animated Scanner Effect Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_4s_ease-in-out_infinite]" />
      </div>

      {/* ─── CONTENT LAYER ─── */}
      <main className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Floating Header Tag */}
        <div className="mb-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl animate-pulse">
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
            Internal Command System v4.0
          </span>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
            Nimesh
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-600 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Business Management
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl font-medium text-gray-300/80 leading-relaxed backdrop-blur-sm p-4 rounded-2xl bg-black/5">
            The next generation of business intelligence. Streamline material logistics, vehicle hire operations, and financial auditing with a unified, high-performance interface.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="/signin"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-5 text-base font-black text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 sm:w-auto"
            >
              <div className="absolute inset-0 translate-y-full bg-blue-600 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Launch Dashboard
              </span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </Link>

            <Link
              href="/admin/dashboard"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-10 py-5 text-base font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/40 active:scale-95 sm:w-auto"
            >
              Analyze Metrics
              <Zap className="h-4 w-4 text-blue-400 transition-transform group-hover:scale-125" />
            </Link>
          </div>
        </div>

        {/* Feature Grid - Minimal & High End */}
        <div className="mt-24 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-blue-500/50 hover:-translate-y-2"
            >
              <div className={`p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                {feature.title}
              </span>
              <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-blue-500 transition-all duration-500 group-hover:w-1/2" />
            </div>
          ))}
        </div>
      </main>

      {/* Decorative Corner Elements */}
      <div className="pointer-events-none fixed bottom-10 left-10 z-20 hidden lg:block">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 underline-offset-8 decoration-blue-500/50">
          <span className="h-[1px] w-12 bg-white/10" />
          Secure Transmission Active
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-10 right-10 z-20 hidden lg:block text-right">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
          Sync Status: <span className="text-emerald-500/50 animate-pulse">Synchronized</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0; opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
