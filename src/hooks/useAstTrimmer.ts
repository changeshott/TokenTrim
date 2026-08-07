import { useState } from "react";
import { detectLanguage, parseCode } from "@/core/parser";
import { trimCode } from "@/core/trimmer";

export interface ProcessedFileState {
  id: string;
  filename: string;
  originalContent: string;
  trimmedContent: string;
  language: string;
  originalLength: number;
  trimmedLength: number;
  selected: boolean;
}

export function useAstTrimmer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentFile: "" });
  const [files, setFiles] = useState<ProcessedFileState[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setIsProcessing(true);
    setFiles([]);
    setError(null);

    try {
      const validFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const lang = detectLanguage(fileList[i].name);
        if (lang) validFiles.push(fileList[i]);
      }

      if (validFiles.length === 0) {
        throw new Error("No supported files found (.ts, .tsx, .py, .go, .rs, .java).");
      }

      setProgress({ current: 0, total: validFiles.length, currentFile: "" });
      const processed: ProcessedFileState[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setProgress(p => ({ ...p, current: i + 1, currentFile: file.webkitRelativePath || file.name }));
        
        const content = await file.text();
        const lang = detectLanguage(file.name);
        
        if (lang) {
          try {
            const tree = await parseCode(content, lang);
            const trimmed = trimCode(content, tree, lang);
            processed.push({
              id: file.webkitRelativePath || file.name,
              filename: file.webkitRelativePath || file.name,
              originalContent: content,
              trimmedContent: trimmed,
              language: lang,
              originalLength: content.length,
              trimmedLength: trimmed.length,
              selected: true
            });
          } catch (e) {
            console.error(`Failed to parse ${file.name}`, e);
          }
        }
      }

      setFiles(processed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFile = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };
  
  const toggleAll = (selected: boolean) => {
    setFiles(prev => prev.map(f => ({ ...f, selected })));
  };

  const reset = () => {
    setFiles([]);
    setError(null);
    setProgress({ current: 0, total: 0, currentFile: "" });
  };

  return {
    processFiles,
    isProcessing,
    progress,
    files,
    error,
    reset,
    toggleFile,
    toggleAll
  };
}
