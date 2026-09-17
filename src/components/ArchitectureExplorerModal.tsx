import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderGit2, 
  Code, 
  Layers, 
  Cpu, 
  Database, 
  Box, 
  Check, 
  Copy 
} from 'lucide-react';
import { ArchModule } from '../data/architectureData';

interface ArchitectureExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureExplorerModal({ isOpen, onClose }: ArchitectureExplorerModalProps) {
  const [modules, setModules] = useState<ArchModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('client');
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/architecture/modules')
        .then(res => res.json())
        .then(data => setModules(data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeModule = modules.find(m => m.id === selectedModuleId) || modules[0];
  const activeFile = activeModule?.files?.[selectedFileIdx] || activeModule?.files?.[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Enterprise Full-Stack Architecture</h3>
              <p className="text-xs text-slate-400">Clean modular code layout for Client, Server, ML Microservices, and Containers</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Module Selector Bar */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap gap-2">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                setSelectedFileIdx(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedModuleId === mod.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{mod.name.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Split View: Left File List, Right Code Viewer */}
        {activeModule && (
          <div className="flex flex-col md:flex-row flex-1 min-h-[400px] overflow-hidden">
            
            {/* Left Sidebar: File Tree */}
            <div className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800 p-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Module Technologies
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeModule.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] bg-slate-800 text-cyan-300 rounded font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Source Code Files
                </span>
                <div className="space-y-1">
                  {activeModule.files.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFileIdx(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all block truncate ${
                        selectedFileIdx === idx
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {file.filename}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Code Viewer */}
            {activeFile && (
              <div className="flex-1 flex flex-col bg-slate-950 p-4 min-h-0 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <p className="text-xs font-mono text-cyan-300 font-bold">{activeFile.filename}</p>
                    <p className="text-[11px] text-slate-400">{activeFile.description}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(activeFile.codeSnippet)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
                  <code>{activeFile.codeSnippet}</code>
                </pre>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
