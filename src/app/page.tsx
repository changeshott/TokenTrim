"use client";

import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Dynamically import ThreeCanvas to avoid SSR issues with window/document
const ThreeCanvas = dynamic(
  () => import("@/components/ThreeCanvas").then((mod) => mod.ThreeCanvas),
  { ssr: false }
);

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "I'm TokenTrim, an AST optimization tool. I strip function bodies to save LLM tokens while preserving critical signatures.";
  
  // State for cursor coordinate tracking (for dynamic spotlight and glow)
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
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

  const itemDown = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const itemUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const itemScale = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { ease: "easeOut", duration: 0.8 } }
  };

  return (
    <motion.div 
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full h-screen bg-[#02050f] text-slate-200 overflow-hidden font-sans flex flex-col justify-between p-6 md:p-10 select-none"
    >
      
      {/* Background Grid Lines Overlay (Illuminated by cursor mask) */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '33.33% 33.33vh',
          backgroundPosition: 'center center',
          // Radial mask that lights up grid lines near the mouse cursor
          WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)`,
          maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)`,
        }}
      />
      
      {/* Soft Cyber Glow Portal (Follows cursor behind the grid) */}
      <div 
        className="absolute pointer-events-none rounded-full opacity-35 z-0 bg-gradient-to-r from-indigo-500/40 via-purple-600/30 to-cyan-500/40 blur-[130px] mix-blend-screen transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x - 225}px`,
          top: `${mousePos.y - 225}px`,
          width: '450px',
          height: '450px',
        }}
      />
      
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

      {/* 3D Canvas Container (Full Screen Background) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-[1000px] h-[90vh] opacity-90 mix-blend-screen">
          <ThreeCanvas />
        </div>
      </div>

      {/* TOP HEADER ROW */}
      <motion.header variants={itemDown} className="z-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Top Left */}
        <div className="flex flex-col gap-2">
          <div className="font-bold tracking-widest text-xs uppercase flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-cover rounded" />
            TOKENTRIM.APP
          </div>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
            Optimize & <br /> Compress
          </div>
        </div>

        {/* Top Middle */}
        <div className="hidden md:flex flex-col px-8 border-l border-indigo-500/10 h-16 justify-center">
          <p className="font-mono text-[10px] text-indigo-200/50 leading-relaxed uppercase tracking-wider">
            Thinking in tokens.<br/>
            Trimming with care.
          </p>
        </div>

        {/* Top Right */}
        <div className="hidden md:flex flex-col items-end gap-3 text-right">
          <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-indigo-200/80">
            <Link href="/dashboard" className="hover:text-white transition-colors pointer-events-auto">Dashboard</Link>
            <a href="https://github.com/changeshott/TokenTrim" target="_blank" rel="noreferrer" className="hover:text-white transition-colors pointer-events-auto">GitHub</a>
            <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">About</span>
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
        {/* Bottom Left */}
        <div>
          <p className="font-mono text-[10px] text-indigo-200/40 uppercase tracking-widest">
            {liveTime} SYS_READY
          </p>
        </div>

        {/* Bottom Middle */}
        <div className="hidden md:flex justify-center">
          <p className="font-mono text-[10px] tracking-widest text-indigo-200/40">
            0996 X 0378 Y
          </p>
        </div>

        {/* Bottom Right */}
        <div className="flex justify-between md:justify-end items-center gap-6">
          <a 
            href="/dashboard"
            className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] pointer-events-auto"
          >
            LAUNCH APP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Globe className="w-5 h-5 text-indigo-200/40 hidden md:block" />
        </div>
      </motion.footer>
    </motion.div>
  );
}
