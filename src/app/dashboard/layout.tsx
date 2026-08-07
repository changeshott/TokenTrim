"use client";

import Link from "next/link";
import { Code2, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 selection:bg-indigo-500/30 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-white/[0.02]">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-indigo-500/30 bg-black/40">
            <img src="/logo.png" alt="TokenTrim Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold tracking-wide">TokenTrim</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              pathname === "/dashboard" 
                ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <Settings className="w-5 h-5" />
            Workspace
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-slate-400 hover:text-slate-200 hover:bg-white/5"
          >
            <User className="w-5 h-5" />
            Back to Home
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

        <header className="h-16 border-b border-white/10 flex items-center px-8 z-10 backdrop-blur-md bg-[#0a0a0a]/50">
          <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
