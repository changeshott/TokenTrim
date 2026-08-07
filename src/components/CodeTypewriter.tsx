"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CodeTypewriterProps {
  code: string;
  speed?: number;
}

export function CodeTypewriter({ code, speed = 20 }: CodeTypewriterProps) {
  const ref = useRef<HTMLDivElement>(null);
  // once: false triggers typing reset and replay when scrolled out and back in
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
    if (!isInView) {
      setDisplayedCode("");
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedCode(code.slice(0, index + 1));
      index++;
      if (index >= code.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, code, speed]);

  return (
    <div ref={ref} className="font-mono text-[10px] leading-tight select-none min-h-[70px]">
      <pre className="whitespace-pre">
        {displayedCode}
        <span className="animate-pulse ml-0.5 text-indigo-400">|</span>
      </pre>
    </div>
  );
}
