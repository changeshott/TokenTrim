import { ProcessedFileState } from "@/hooks/useAstTrimmer";
import { CheckSquare, Square, FileText } from "lucide-react";

interface FileTreeProps {
  files: ProcessedFileState[];
  onToggle: (id: string) => void;
  onToggleAll: (selected: boolean) => void;
}

export function FileTree({ files, onToggle, onToggleAll }: FileTreeProps) {
  const allSelected = files.every(f => f.selected);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden flex flex-col mt-6">
      <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => onToggleAll(!allSelected)} className="text-slate-400 hover:text-indigo-400 transition-colors">
            {allSelected ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5" />}
          </button>
          <span className="text-sm font-semibold text-slate-200">
            Selected {files.filter(f => f.selected).length} of {files.length} files
          </span>
        </div>
      </div>
      
      <div className="max-h-[40vh] overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1">
        {files.map(file => {
          const savedChars = file.originalLength - file.trimmedLength;
          const savedPercent = file.originalLength ? ((savedChars / file.originalLength) * 100).toFixed(0) : 0;
          
          return (
            <div 
              key={file.id} 
              onClick={() => onToggle(file.id)}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button className="text-slate-500">
                  {file.selected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
                </button>
                <FileText className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                <span className="text-sm text-slate-300 truncate font-mono">{file.filename}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 whitespace-nowrap pl-4">
                <span className="text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  -{savedPercent}%
                </span>
                <span className="w-16 text-right">{formatBytes(file.trimmedLength)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
