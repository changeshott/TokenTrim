import { LandingHero } from "@/components/LandingHero";
import { LandingFeatures } from "@/components/LandingFeatures";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 selection:bg-indigo-500/30 flex flex-col font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[-20%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="w-full h-20 flex items-center justify-between px-6 md:px-12 z-10 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <span className="font-bold text-indigo-400">CX</span>
          </div>
          <span className="font-semibold text-lg tracking-wide hidden sm:block">ContextOptimizer</span>
        </div>
        <a 
          href="https://github.com/zonaf/MyProject" 
          target="_blank" 
          rel="noreferrer"
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          GitHub
        </a>
      </nav>

      {/* Main Content */}
      <main className="flex-1 z-10 flex flex-col">
        <LandingHero />
        <LandingFeatures />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm z-10 border-t border-white/5">
        <p>© {new Date().getFullYear()} ContextOptimizer. Built for developers.</p>
      </footer>
    </div>
  );
}
