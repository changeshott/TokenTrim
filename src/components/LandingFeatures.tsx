"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Cpu } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Lightning Fast Processing",
    description: "Built with WebAssembly and Tree-sitter for instantaneous AST parsing directly in your browser."
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "100% Local & Secure",
    description: "Zero server calls. Your source code never leaves your machine, ensuring absolute privacy."
  },
  {
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
    title: "Token Optimization",
    description: "Save up to 80% on LLM tokens by stripping function bodies while keeping interfaces and types intact."
  }
];

export function LandingFeatures() {
  return (
    <section className="py-2 max-w-6xl mx-auto px-6 w-full">
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
