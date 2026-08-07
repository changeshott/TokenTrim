"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Globe, ArrowRight, Cpu, Shield, Zap, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { CodeTypewriter } from "@/components/CodeTypewriter";

// Dynamically import ThreeCanvas to avoid SSR issues with window/document
const ThreeCanvas = dynamic(
  () => import("@/components/ThreeCanvas").then((mod) => mod.ThreeCanvas),
  { ssr: false }
);

const beforeCode = `function add(a, b) {
  const res = a + b;
  console.log(res);
  return res;
}`;

const afterCode = `function add(a, b) {
  // [trimmed]
}`;

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "I'm TokenTrim, an AST optimization tool. I strip function bodies to save LLM tokens while preserving critical signatures.";

  // State for cursor coordinate tracking (for dynamic spotlight and glow)
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [clientPos, setClientPos] = useState({ x: -500, y: -500 });
  const [isAssetHovered, setIsAssetHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  // 3D Canvas Scroll-driven dynamic transition (moves from center to left)
  const canvasX = useTransform(scrollYProgress, [0, 0.5], ["0vw", "-25vw"]);
  const canvasY = useTransform(scrollYProgress, [0, 0.5], ["0px", "0px"]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.75]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.5], [0.9, 0.75]);

  // Hero elements fade out on scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setClientPos({ x: e.clientX, y: e.clientY });
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX,
          y: e.clientY + window.scrollY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [liveTime, setLiveTime] = useState("");
  useEffect(() => {
    setLiveTime(new Date().toLocaleTimeString('en-GB', { timeZoneName: 'short' }));
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('en-GB', { timeZoneName: 'short' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect for top-right description card
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemDown: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const itemUp: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const itemScale: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { ease: "easeOut", duration: 0.8 } }
  };

  const aboutContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const aboutFadeInUp: Variants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 14 }
    }
  };

  const aboutFadeInLeft: Variants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 14 }
    }
  };

  const aboutFadeInRight: Variants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 14 }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#02050f] text-slate-200 font-sans select-none overflow-x-hidden"
    >

      {/* 1. SEAMLESS UNIFIED GRID BACKGROUND (Spans across all sections) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: '33.33% 33.33vh',
          backgroundPosition: 'center center',
          // Spotlight reveals grid lines relative to mouse position across the whole document
          WebkitMaskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)`,
          maskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)`,
        }}
      />

      {/* Soft Cyber Glow Portal (Follows cursor behind the grid, fixed position in viewport to prevent page height stretching) */}
      <div
        className="fixed pointer-events-none rounded-full opacity-35 z-0 bg-gradient-to-r from-indigo-500/40 via-purple-600/30 to-cyan-500/40 blur-[130px] mix-blend-screen transition-all duration-300 ease-out"
        style={{
          left: `${clientPos.x - 225}px`,
          top: `${clientPos.y - 225}px`,
          width: '450px',
          height: '450px',
        }}
      />

      {/* GLOBAL 3D CANVAS (Fixed position, glides on scroll with dynamic hover filter) */}
      <motion.div
        animate={{
          filter: isAssetHovered
            ? "drop-shadow(0 0 35px rgba(99, 102, 241, 0.85)) brightness(1.3) contrast(1.15)"
            : "drop-shadow(0 0 0px rgba(99, 102, 241, 0)) brightness(1) contrast(1)"
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ x: canvasX, y: canvasY, scale: canvasScale, opacity: canvasOpacity }}
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <div className="w-full max-w-[1000px] h-[90vh] mix-blend-screen">
          <ThreeCanvas />
        </div>
      </motion.div>

      {/* 2. HERO SECTION */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full h-screen flex flex-col justify-between p-6 md:p-10 select-none z-20"
      >
        {/* Grid Plus Markers */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute top-[33.33vh] left-[33.33%] w-2 h-2 border-t border-l border-indigo-400/30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[33.33vh] left-[66.66%] w-2 h-2 border-t border-l border-indigo-400/30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[66.66vh] left-[33.33%] w-2 h-2 border-t border-l border-indigo-400/30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[66.66vh] left-[66.66%] w-2 h-2 border-t border-l border-indigo-400/30 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        {/* TOP HEADER ROW */}
        <motion.header variants={itemDown} className="z-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col gap-2">
            <div className="font-bold tracking-widest text-xs uppercase flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-5 h-5 object-cover rounded" />
              TOKENTRIM.APP
            </div>
            <div className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
              Optimize & <br /> Compress
            </div>
          </div>

          <div className="hidden md:flex flex-col px-8 border-l border-indigo-500/10 h-16 justify-center">
            <p className="font-mono text-[10px] text-indigo-200/50 leading-relaxed uppercase tracking-wider">
              Thinking in tokens.<br />
              Trimming with care.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end gap-3 text-right">
            <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-indigo-200/80">
              <Link href="/dashboard" className="hover:text-white transition-colors pointer-events-auto">Dashboard</Link>
              <a href="https://github.com/changeshott/TokenTrim" target="_blank" rel="noreferrer" className="hover:text-white transition-colors pointer-events-auto">GitHub</a>
              <a href="#about" className="hover:text-white transition-colors pointer-events-auto">About</a>
            </nav>
            <p className="font-mono text-[10px] text-indigo-200/50 leading-relaxed text-left max-w-[280px] p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/10 backdrop-blur-md min-h-[60px]">
              {typedText}
              <span className="animate-pulse ml-0.5 text-indigo-400">|</span>
            </p>
          </div>
        </motion.header>

        {/* CENTER / HUGE HEADLINE ROW */}
        <motion.main variants={itemScale} className="z-20 my-auto pointer-events-none flex flex-col justify-end min-h-[40vh]">
          <h1 className="text-[7.5vw] md:text-[6.5vw] lg:text-[6vw] font-black leading-[0.85] tracking-tighter uppercase max-w-5xl text-white select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            WE BRING <br />
            CLARITY & CONTEXT <br />
            TO LLM PROMPTS
          </h1>
        </motion.main>

        {/* BOTTOM CONTROL ROW */}
        <motion.footer variants={itemUp} className="z-20 w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
          <div>
            <p className="font-mono text-[10px] text-indigo-200/40 uppercase tracking-widest">
              {liveTime} SYS_READY
            </p>
          </div>

          <div className="hidden md:flex justify-center">
            <p className="font-mono text-[10px] tracking-widest text-indigo-200/40">
              0996 X 0378 Y
            </p>
          </div>

          <div className="flex justify-between md:justify-end items-center gap-6">
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] pointer-events-auto"
            >
              LAUNCH APP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Globe className="w-5 h-5 text-indigo-200/40 hidden md:block" />
          </div>
        </motion.footer>
      </motion.div>

      {/* 3. ABOUT SECTION (SEAMLESSLY CONNECTED WITH SAME BACKGROUND) */}
      <section
        id="about"
        className="relative w-full h-screen bg-transparent text-slate-200 flex flex-col justify-between p-6 md:p-10 lg:p-12 z-20 overflow-hidden"
      >
        {/* Subtle Horizontal TV cathode sweep line divider on top */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        {/* Outer Frame Lines */}
        <div className="absolute inset-x-8 top-8 bottom-8 border border-indigo-500/10 pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={aboutContainerVariants}
          className="z-20 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between h-full"
        >

          {/* Header Area */}
          <motion.div
            variants={aboutFadeInUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-indigo-500/10 pb-4 w-full"
          >
            <span className="font-mono text-xs text-indigo-400 tracking-widest uppercase font-bold">
              [ SECTION_02 // SYSTEM_OVERVIEW ]
            </span>
            <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
              TokenTrim // Context Reductor 1.0
            </span>
          </motion.div>

          {/* Grid Content - (Left empty for fixed 3D canvas, content on right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto w-full flex-1">

            {/* Left side empty space to let the floating 3D canvas shine with interactive hover */}
            <div
              onMouseEnter={() => setIsAssetHovered(true)}
              onMouseLeave={() => setIsAssetHovered(false)}
              className="lg:col-span-5 h-[150px] lg:h-[400px] pointer-events-auto cursor-pointer flex items-center justify-center"
            />

            {/* Right side content */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Core Concept */}
              <motion.div variants={aboutFadeInUp} className="flex flex-col gap-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-[0.95]">
                  Minimizing Tokens.<br />
                  Maximizing Context.
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm">
                  LLM prompts suffer from tight context windows and heavy billing. Sending code with detailed implementation details drains resources needlessly.
                </p>
                <p className="text-slate-300 leading-relaxed text-sm font-semibold">
                  TokenTrim parses code AST (Abstract Syntax Trees) directly in-browser using WebAssembly to eliminate logic bodies, keeping only definitions and type structures.
                </p>
              </motion.div>

              {/* Comparison Visual and Key Features side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* Comparison Card (md:col-span-7) */}
                <motion.div
                  variants={aboutFadeInLeft}
                  className="md:col-span-7 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-5 font-mono text-[10px] leading-tight text-slate-300 shadow-sm backdrop-blur-md"
                >
                  <div className="flex justify-between border-b border-indigo-500/20 pb-2 mb-3 font-bold text-indigo-400">
                    <span>BEFORE TRIMMING</span>
                    <span>AFTER TRIMMING</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block mb-2">// Heavy tokens</span>
                      <CodeTypewriter code={beforeCode} speed={15} />
                    </div>
                    <div className="border-l border-indigo-500/20 pl-4">
                      <span className="text-emerald-400 font-bold block mb-2">// Optimized</span>
                      <CodeTypewriter code={afterCode} speed={25} />
                    </div>
                  </div>
                </motion.div>

                {/* Key Features Block (md:col-span-5) */}
                <motion.div
                  variants={aboutFadeInRight}
                  className="md:col-span-5 flex flex-col gap-4"
                >
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-white mb-0.5">AST Tree-sitter</h4>
                      <p className="text-slate-400 text-[10px] leading-snug">Accurate parsing that understands grammar constructs, not regex patterns.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-white mb-0.5">100% Secure</h4>
                      <p className="text-slate-400 text-[10px] leading-snug">Runs strictly locally in the browser using WASM. Code never goes to a server.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-white mb-0.5">Real-time stats</h4>
                      <p className="text-slate-400 text-[10px] leading-snug">Measure token counts saved and compression percentages instantly.</p>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

          {/* Footer Area */}
          <motion.div
            variants={aboutFadeInUp}
            className="flex flex-col sm:flex-row justify-between items-center border-t border-indigo-500/10 pt-6 w-full text-[10px] text-slate-400 font-mono"
          >
            <span>© {new Date().getFullYear()} TOKENTRIM APPLICATION.</span>
          </motion.div>

        </motion.div>
      </section>
    </div>
  );
}
