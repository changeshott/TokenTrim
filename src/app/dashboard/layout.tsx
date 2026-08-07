"use client";

import Link from "next/link";
import { Code2, Settings, Home, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#02050f] text-slate-200 selection:bg-indigo-500/30 flex font-sans overflow-hidden relative">

      {/* Unified seamless grid background — same as landing page */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-600/8 blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] rounded-full bg-purple-700/8 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[140px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="relative w-60 flex-shrink-0 flex flex-col z-20 border-r border-indigo-500/10 bg-[#02050f]/80 backdrop-blur-xl">
        {/* Sidebar inner glow line */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />

        {/* Logo & Brand */}
        <div className="p-5 border-b border-indigo-500/10 flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center border border-indigo-500/30 bg-indigo-950/50 shadow-[0_0_12px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
            <img src="/logo.png" alt="TokenTrim Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-widest text-[10px] uppercase text-indigo-200/80">TokenTrim</span>
            <span className="font-mono text-[9px] text-indigo-400/50 tracking-wider">v1.0 // WASM</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-indigo-400/40 px-3 pt-3 pb-2">Navigation</p>
          <Link
            href="/dashboard"
            className={clsx(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden",
              pathname === "/dashboard"
                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            )}
          >
            {pathname === "/dashboard" && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
            )}
            <Settings className={clsx("w-4 h-4 transition-colors", pathname === "/dashboard" ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
            <span className="text-xs font-medium tracking-wide">Workspace</span>
            {pathname === "/dashboard" && (
              <ChevronRight className="w-3 h-3 text-indigo-400/60 ml-auto" />
            )}
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
          >
            <Home className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <span className="text-xs font-medium tracking-wide">Back to Home</span>
          </Link>
        </nav>

        {/* Sidebar footer badge */}
        <div className="p-4 border-t border-indigo-500/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[9px] text-emerald-400/80 uppercase tracking-wider">WASM Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-10 min-w-0">

        {/* Top Header Bar */}
        <header className="h-14 border-b border-indigo-500/10 flex items-center px-6 z-10 relative bg-[#02050f]/60 backdrop-blur-xl flex-shrink-0">
          {/* Header subtle glow line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

          <div className="flex items-center gap-3">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-[10px] text-indigo-400/60 tracking-widest uppercase">[ WORKSPACE ]</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden md:block font-mono text-[9px] text-indigo-200/30 uppercase tracking-widest">
              AST Trimmer // Ready
            </span>
            <div className="h-4 w-px bg-indigo-500/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
              <span className="font-mono text-[9px] text-indigo-400/60 uppercase tracking-widest hidden sm:block">Online</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto z-10">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
