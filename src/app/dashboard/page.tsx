"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderUp, Copy, CheckCircle2, Loader2, Code2, AlertCircle, Wand2, ArrowLeft } from "lucide-react";
import { useAstTrimmer } from "@/hooks/useAstTrimmer";
import { formatOutput } from "@/core/formatter";
import { FileTree } from "@/components/ui/FileTree";

export default function Dashboard() {
  const { processFiles, isProcessing, progress, files, error, reset, toggleFile, toggleAll } = useAstTrimmer();
  const [copied, setCopied] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectorySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(event.target.files);
    setMarkdown(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateMarkdown = () => {
    const selectedFiles = files.filter(f => f.selected);
    const md = formatOutput(selectedFiles);
    setMarkdown(md);
  };

  const copyToClipboard = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const metrics = useMemo(() => {
    if (!files || files.length === 0) return null;
    const selected = files.filter(f => f.selected);
    const totalOriginal = selected.reduce((acc, f) => acc + f.originalLength, 0);
    const totalTrimmed = selected.reduce((acc, f) => acc + f.trimmedLength, 0);
    const saved = totalOriginal - totalTrimmed;
    const percent = totalOriginal > 0 ? Math.round((saved / totalOriginal) * 100) : 0;
    
    // Roughly estimating 4 chars per token
    const tokensSaved = Math.round(saved / 4);
    
    return { percent, tokensSaved, fileCount: selected.length };
  }, [files]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center">

        {/* Page label badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-300/70">AST_OPTIMIZER // v1.0</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {!files.length && !isProcessing && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                {...({ webkitdirectory: "true", directory: "true" } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
              />

              <button
                onClick={handleDirectorySelect}
                className="group relative w-full flex flex-col items-center justify-center p-14 border border-dashed border-indigo-500/20 rounded-3xl bg-indigo-950/10 hover:bg-indigo-950/20 hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-5 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all duration-300">
                  <FolderUp className="w-8 h-8 text-indigo-400/60 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-1.5 text-white">Select Project Folder</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-indigo-200/40">Supports .ts .py .go .rs .java</p>
              </button>

              {error && (
                <div className="mt-6 flex items-center justify-center gap-2 text-red-400 bg-red-500/5 px-4 py-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md flex flex-col items-center p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/15 backdrop-blur-xl"
            >
              <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-indigo-300/60 mb-1">Parsing AST Tree</h3>
              <p className="text-base font-semibold text-white mb-1">Analyzing...</p>
              <p className="text-xs text-slate-500 mb-6 truncate w-full text-center">
                {progress.currentFile || "Preparing files"}
              </p>

              <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden border border-indigo-500/10">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                  style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between w-full text-[10px] font-mono text-indigo-400/40 uppercase tracking-wider">
                <span>{progress.current} processed</span>
                <span>{progress.total} total</span>
              </div>
            </motion.div>
          )}

          {files.length > 0 && !markdown && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-indigo-500/10 pb-4">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-400/50">[ FILE_SELECTION ]</span>
                  <h3 className="text-lg font-semibold text-white text-left">Select Files to Include</h3>
                </div>
                <button
                  onClick={reset}
                  className="font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors border border-slate-700/50 hover:border-slate-500/50 px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>

              <FileTree files={files} onToggle={toggleFile} onToggleAll={toggleAll} />

              {metrics && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-indigo-950/20 border border-indigo-500/15 p-5 rounded-2xl gap-4 backdrop-blur-sm">
                  <div className="flex items-center gap-6 text-left">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-indigo-400/40 mb-1">Compression</p>
                      <p className="text-2xl font-black text-emerald-400 tracking-tight">-{metrics.percent}%</p>
                    </div>
                    <div className="w-px h-10 bg-indigo-500/15" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-indigo-400/40 mb-1">Tokens Saved ~</p>
                      <p className="text-2xl font-black text-indigo-400 tracking-tight">{metrics.tokensSaved.toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={generateMarkdown}
                    disabled={metrics.fileCount === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                  >
                    <Wand2 className="w-4 h-4" />
                    Generate Output
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {markdown && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 border-b border-indigo-500/10 pb-4">
                <button
                  onClick={() => setMarkdown(null)}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Files
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] active:scale-95"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Context"}
                </button>
              </div>

              <div className="relative group rounded-2xl overflow-hidden border border-indigo-500/15 bg-[#060810]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                <pre className="p-6 text-sm text-slate-300 overflow-x-auto max-h-[60vh] custom-scrollbar text-left font-mono leading-relaxed">
                  <code>{markdown}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.45); }
      `}} />
    </div>
  );
}
