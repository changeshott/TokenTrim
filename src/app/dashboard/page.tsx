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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium tracking-wide">Workspace</span>
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
                className="group relative w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <FolderUp className="w-12 h-12 text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select Project Folder</h3>
                <p className="text-sm text-slate-500">Supports .ts, .py, .go, .rs, .java files</p>
              </button>
              
              {error && (
                <div className="mt-6 flex items-center justify-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20">
                  <AlertCircle className="w-5 h-5" />
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
              className="w-full max-w-md flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-6" />
              <h3 className="text-lg font-medium mb-2">Analyzing AST...</h3>
              <p className="text-sm text-slate-400 mb-6 truncate w-full text-center">
                {progress.currentFile || "Preparing files"}
              </p>
              
              <div className="w-full bg-black/50 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between w-full text-xs text-slate-500">
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
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-left">Select Files to Include</h3>
                <button 
                  onClick={reset}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <FileTree files={files} onToggle={toggleFile} onToggleAll={toggleAll} />
              
              {metrics && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl gap-4">
                  <div className="flex items-center gap-6 text-left">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Compression</p>
                      <p className="text-2xl font-semibold text-emerald-400">-{metrics.percent}%</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Est. Tokens Saved</p>
                      <p className="text-2xl font-semibold text-indigo-400">~{metrics.tokensSaved.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={generateMarkdown}
                    disabled={metrics.fileCount === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Wand2 className="w-5 h-5" />
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
              <div className="flex items-center justify-between mb-4 px-2">
                <button 
                  onClick={() => setMarkdown(null)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Files
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Context"}
                </button>
              </div>
              
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f11]">
                <pre className="p-6 text-sm text-slate-300 overflow-x-auto max-h-[60vh] custom-scrollbar text-left font-mono">
                  <code>{markdown}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </div>
  );
}
