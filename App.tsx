import React, { useState, useEffect, useRef } from 'react';
import { Editor } from './components/Editor';
import { Console } from './components/Console';
import { Visualizer } from './components/Visualizer';
import { Docs } from './components/Docs';
import { Course } from './components/Course';
import { FileExplorer } from './components/FileExplorer';
import { GooberRuntime } from './services/runtime';
import { getAllFiles, saveFile, deleteFile, clearFileSystem } from './services/storage';
import { LogEntry, PlotData, FileNode, RuntimeSignal } from './types';
import { LLM_CODE, DEFAULT_CODE, AGI_CODE, COURSE_CURRICULUM, OPTIMIZATION_CODE, MULTI_CODE, EASTER_EGGS, GOD_MODE_CODE, OMEGA_CODE } from './constants';
import { 
  Play, Layout, Activity, Terminal as TerminalIcon, 
  Cpu, Sidebar, Square, X, Zap, Sliders,
  AlertTriangle, Save, ShieldAlert, Pause, PlayCircle,
  CheckCircle, Move, GraduationCap, BookOpen, Terminal,
  User, Lock, LogIn
} from 'lucide-react';

// --- Modal Component ---
interface InputModalProps {
  isOpen: boolean;
  title: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  initialValue?: string;
  placeholder?: string;
  type?: 'input' | 'confirm' | 'confirm_runtime';
  message?: string;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, title, onSubmit, onCancel, initialValue = '', placeholder = '', type = 'input', message }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    setValue(initialValue);
  }, [isOpen, initialValue, type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-[#1e293b] border ${type === 'confirm_runtime' ? 'border-blue-500 shadow-blue-900/30' : 'border-gray-700 shadow-xl'} rounded-lg w-96 p-6 shadow-2xl transform transition-all scale-100`}>
        <h3 className={`text-lg font-bold mb-4 ${type === 'confirm_runtime' ? 'text-blue-400' : 'text-white'}`}>{title}</h3>
        
        {message && <p className="text-gray-300 text-sm mb-4 leading-relaxed">{message}</p>}
        
        <form onSubmit={handleSubmit}>
          {type === 'input' && (
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-[#0b1221] border border-gray-600 rounded p-2 text-white mb-6 focus:border-purple-500 outline-none transition-colors font-mono text-sm"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {type === 'confirm_runtime' ? 'Deny' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-sm font-bold text-white transition-transform hover:scale-105 ${
                type === 'confirm' ? 'bg-red-600 hover:bg-red-500' : 
                type === 'confirm_runtime' ? 'bg-blue-600 hover:bg-blue-500' :
                'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              {type === 'confirm_runtime' ? 'Approve' : type === 'confirm' ? 'Confirm' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Login Screen Component ---
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth request
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-500 relative z-10">
        
        <div className="flex flex-col items-center mb-8">
           <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg shadow-purple-500/30 mb-4 transform hover:scale-105 transition-transform">
              <Terminal size={32} className="text-white relative z-10" />
              <Zap size={16} className="text-yellow-300 absolute -top-1 -right-1 fill-current animate-pulse z-20 filter drop-shadow-md" />
           </div>
           <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-1">GooberLang IDE</h1>
           <p className="text-gray-400 text-sm font-mono">Neural Engineering Platform</p>
        </div>

        {/* Persistence Warning */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl flex items-start">
           <AlertTriangle size={18} className="text-yellow-500 mr-3 mt-0.5 shrink-0" />
           <div className="flex-1">
             <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-wide mb-1">Persistence Warning</h4>
             <p className="text-xs text-yellow-200/80 leading-relaxed">
               AI models and code files will <span className="text-yellow-100 font-bold underline">only be saved</span> to persistent storage if you are logged in. Guest sessions are volatile and will be wiped upon exit.
             </p>
           </div>
        </div>

        <div className="flex mb-6 bg-gray-900/50 p-1 rounded-lg">
           <button 
             onClick={() => setIsLoginMode(true)}
             className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLoginMode ? 'bg-gray-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
           >
             Log In
           </button>
           <button 
             onClick={() => setIsLoginMode(false)}
             className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLoginMode ? 'bg-gray-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
           >
             Sign Up
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Email Identity</label>
             <div className="relative group">
               <User size={16} className="absolute left-3 top-3 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
               <input 
                 required 
                 type="email" 
                 className="w-full bg-[#0b1221] border border-gray-600 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600" 
                 placeholder="researcher@lab.ai" 
               />
             </div>
           </div>
           
           <div>
             <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">Secure Access Token</label>
             <div className="relative group">
               <Lock size={16} className="absolute left-3 top-3 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
               <input 
                 required 
                 type="password" 
                 className="w-full bg-[#0b1221] border border-gray-600 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600" 
                 placeholder="••••••••••••" 
               />
             </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <>
                 <LogIn size={18} className="mr-2" />
                 {isLoginMode ? 'Access Terminal' : 'Initialize Account'}
               </>
             )}
           </button>
        </form>
        
        <div className="mt-6 text-center">
           <p className="text-[10px] text-gray-500">
             By accessing the system, you agree to the <span className="text-gray-400 hover:text-white cursor-pointer underline">Neural Ethics Protocols</span>.
           </p>
        </div>
      </div>
    </div>
  );
};

// --- Easter Eggs Modal ---
const EasterEggsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-purple-500/50 rounded-xl w-[600px] max-h-[80vh] flex flex-col shadow-2xl shadow-purple-900/40">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-purple-900/10">
          <div className="flex items-center">
             <Zap className="text-yellow-400 mr-2 animate-pulse" />
             <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Classified Secrets</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          {EASTER_EGGS.map((egg) => (
            <div key={egg.filename} className="bg-[#1e293b] border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-cyan-300 font-mono font-bold text-lg group-hover:text-cyan-200">{egg.filename}</h3>
                <span className="text-[10px] bg-purple-900/50 text-purple-200 px-2 py-1 rounded border border-purple-500/30">Class: AI</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{egg.description}</p>
              <div className="bg-black/30 p-2 rounded text-xs font-mono text-gray-400 border border-gray-800">
                <span className="text-yellow-500">Trigger:</span> {egg.trigger}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [plots, setPlots] = useState<PlotData[]>([]);
  
  // Refs to maintain state access in callbacks
  const filesRef = useRef<FileNode[]>([]);
  const runtimeRef = useRef<GooberRuntime | null>(null);
  const isRunningRef = useRef(false);

  // UI State
  const [sidePanelMode, setSidePanelMode] = useState<'none' | 'docs' | 'course'>('none');
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showEasterEggs, setShowEasterEggs] = useState(false);
  
  // Control Panel State
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [panelPos, setPanelPos] = useState({ x: typeof window !== 'undefined' ? window.innerWidth - 380 : 800, y: 80 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'input' | 'confirm' | 'confirm_runtime';
    title: string;
    action: 'create_file' | 'create_folder' | 'delete' | 'save_project' | 'load_project' | 'runtime_confirm' | null;
    targetId: string | null;
    message?: string;
  }>({ isOpen: false, type: 'input', title: '', action: null, targetId: null });

  // Sync ref with state
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Define handleCodeChange first so it can be used in initialization
  const handleCodeChange = (newCode: string) => {
    if (activeFileId) {
      setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));
      const file = files.find(f => f.id === activeFileId);
      if (file) saveFile({ ...file, content: newCode });
    }
  };

  // Ref for handleCodeChange to use in runtime callback
  const handleCodeChangeRef = useRef(handleCodeChange);
  useEffect(() => { handleCodeChangeRef.current = handleCodeChange; }, [handleCodeChange]);

  // --- Initialization ---
  useEffect(() => {
    getAllFiles().then(loadedFiles => {
      setFiles(loadedFiles);
      if (loadedFiles.length > 0) {
        setActiveFileId(loadedFiles[0].id);
      }
    }).catch(err => console.error("Failed to load files", err));

    // Initialize Runtime
    runtimeRef.current = new GooberRuntime(
      (log) => setLogs(prev => [...prev, log]),
      (plot) => setPlots(prev => {
        const existingIdx = prev.findIndex(p => p.id === plot.id);
        if (existingIdx !== -1) {
          const newPlots = [...prev];
          const existingPlot = newPlots[existingIdx];
          
          const newData = [...existingPlot.data, ...plot.data];
          if (newData.length > 100) {
             newData.splice(0, newData.length - 100);
          }

          newPlots[existingIdx] = {
             ...existingPlot,
             ...plot, 
             data: newData 
          };
          return newPlots;
        }
        return [...prev, plot];
      }),
      (message) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                type: 'confirm_runtime',
                title: 'Runtime Request',
                message: message,
                action: 'runtime_confirm',
                targetId: null
            });
            (window as any)._runtimeConfirmResolver = resolve;
        });
      },
      () => filesRef.current, 
      (newCode) => handleCodeChangeRef.current(newCode)
    );
  }, []);

  // --- Handlers ---

  const handleFileSelect = (file: FileNode) => {
    setActiveFileId(file.id);
  };

  // --- Modal Handlers ---
  const openModal = (type: 'input' | 'confirm', title: string, action: any, targetId: string | null = null) => {
    setModalState({ isOpen: true, type, title, action, targetId });
  };

  const handleModalSubmit = async (value: string) => {
    const { action, targetId } = modalState;
    
    if (action === 'runtime_confirm') {
        const resolver = (window as any)._runtimeConfirmResolver;
        if (resolver) resolver(true);
        setModalState({ ...modalState, isOpen: false });
        return;
    }
    
    if (action === 'create_file') {
      let content = DEFAULT_CODE;
      if (value === 'llm.gb') content = LLM_CODE;
      if (value === 'agi.gb') content = AGI_CODE;
      if (value === 'optimization.gb') content = OPTIMIZATION_CODE;
      if (value === 'multi.gb') content = MULTI_CODE;
      if (value === 'god_mode.gb' || value === 'god.gb') content = GOD_MODE_CODE;
      if (value === 'omega.gb') content = OMEGA_CODE;

      const newFile: FileNode = {
        id: Date.now().toString(),
        name: value.endsWith('.gb') ? value : `${value}.gb`,
        type: 'file',
        parentId: targetId,
        content: content,
        depth: targetId ? (files.find(f => f.id === targetId)?.depth || 0) + 1 : 0
      };
      await saveFile(newFile);
      setFiles(prev => {
         const updated = [...prev, newFile];
         if (targetId) {
             return updated.map(f => f.id === targetId ? { ...f, isOpen: true } : f);
         }
         return updated;
      });
      setActiveFileId(newFile.id);
      
      if (newFile.name === 'multi.gb') {
          const createIfMissing = async (name: string, code: string) => {
              if (!files.find(f => f.name === name)) {
                  const f: FileNode = {
                      id: Date.now().toString() + Math.random(),
                      name, type: 'file', parentId: targetId, content: code, depth: newFile.depth
                  };
                  await saveFile(f);
                  setFiles(prev => [...prev, f]);
              }
          };
          await createIfMissing('agi.gb', AGI_CODE);
          await createIfMissing('llm.gb', LLM_CODE);
          await createIfMissing('optimization.gb', OPTIMIZATION_CODE);
          
          const optFile = (await getAllFiles()).find(f => f.name === 'optimization.gb');
          if (optFile) {
             setActiveFileId(optFile.id);
             setTimeout(() => {
                 const file = files.find(f => f.name === 'optimization.gb') || optFile;
                 if (file && runtimeRef.current) {
                     setLogs([]); setPlots([]); setIsRunning(true); setShowControlPanel(true);
                     runtimeRef.current.run(file.content).finally(() => setIsRunning(false));
                 }
             }, 500);
          }
      }
    } 
    else if (action === 'create_folder') {
      const newFolder: FileNode = {
        id: Date.now().toString(),
        name: value,
        type: 'folder',
        parentId: targetId,
        content: '',
        isOpen: true,
        depth: targetId ? (files.find(f => f.id === targetId)?.depth || 0) + 1 : 0
      };
      await saveFile(newFolder);
      setFiles(prev => {
         const updated = [...prev, newFolder];
         if (targetId) {
             return updated.map(f => f.id === targetId ? { ...f, isOpen: true } : f);
         }
         return updated;
      });
    }
    else if (action === 'delete' && targetId) {
      await deleteFile(targetId);
      const children = files.filter(f => f.parentId === targetId);
      for (const child of children) await deleteFile(child.id);
      
      setFiles(prev => prev.filter(f => f.id !== targetId && f.parentId !== targetId));
      if (activeFileId === targetId) setActiveFileId(null);
    }
    else if (action === 'save_project') {
        const blob = new Blob([JSON.stringify(files)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${value || 'goober_project'}.json`;
        a.click();
    }

    setModalState({ ...modalState, isOpen: false });
  };

  const handleModalCancel = () => {
     if (modalState.action === 'runtime_confirm') {
        const resolver = (window as any)._runtimeConfirmResolver;
        if (resolver) resolver(false);
     }
     setModalState({ ...modalState, isOpen: false });
  };

  const handleRun = async () => {
    const file = files.find(f => f.id === activeFileId);
    if (!file || !runtimeRef.current) return;

    setLogs([]);
    setPlots([]);
    setIsRunning(true);
    setShowControlPanel(true);

    await runtimeRef.current.run(file.content);
    setIsRunning(false);
  };

  const handleRunProject = async () => {
    const allGbFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.gb'));
    if (allGbFiles.length === 0 || !runtimeRef.current) return;

    setLogs([]);
    setPlots([]);
    setIsRunning(true);
    setShowControlPanel(true);

    const combinedCode = allGbFiles.map(f => `// --- File: ${f.name} ---\n${f.content}`).join('\n\n');

    await runtimeRef.current.run(combinedCode);
    setIsRunning(false);
  };

  const handleStop = () => {
    if (runtimeRef.current) {
        runtimeRef.current.stop();
        runtimeRef.current.pushSignal('STOP'); 
    }
    setIsRunning(false);
  };

  const sendSignal = (signal: RuntimeSignal) => {
    runtimeRef.current?.pushSignal(signal);
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingPanel(true);
    dragOffset.current = {
        x: e.clientX - panelPos.x,
        y: e.clientY - panelPos.y
    };
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
        if (!isDraggingPanel) return;
        setPanelPos({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y
        });
    };
    const stopDrag = () => setIsDraggingPanel(false);
    
    if (isDraggingPanel) {
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', stopDrag);
    }
    return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', stopDrag);
    };
  }, [isDraggingPanel]);

  const activeFile = files.find(f => f.id === activeFileId);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-gray-300 font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-[#1e293b] border-b border-gray-700 flex items-center px-4 justify-between shrink-0 z-20">
        <div className="flex items-center space-x-3 group cursor-default select-none">
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 transform group-hover:scale-105">
            <Terminal size={18} className="text-white relative z-10" />
            <Zap size={10} className="text-yellow-300 absolute -top-1 -right-1 fill-current animate-pulse z-20 filter drop-shadow-md" />
          </div>
          <div className="flex flex-col leading-none justify-center">
            <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 drop-shadow-sm">
              GooberLang
            </span>
            <div className="flex items-center space-x-1">
                <span className="text-[9px] font-bold text-white bg-purple-600 px-1.5 py-0.5 rounded-sm shadow-purple-500/50 shadow-sm tracking-widest uppercase">IDE</span>
                <span className="text-[8px] text-gray-500 font-mono">v4.5</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-lg border border-gray-700/50">
           <button 
             onClick={isRunning ? handleStop : handleRun}
             className={`flex items-center px-4 py-1.5 rounded font-bold text-sm transition-all ${
               isRunning 
               ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
               : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
             }`}
           >
             {isRunning ? <Square size={14} className="mr-2 fill-current" /> : <Play size={14} className="mr-2 fill-current" />}
             {isRunning ? 'STOP ENGINE' : 'RUN KERNEL'}
           </button>
           
           {isRunning && (
             <button 
               onClick={handleStop} 
               className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors" 
               title="Emergency Kill Switch"
             >
               <Square size={14} />
             </button>
           )}
        </div>

        <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSidePanelMode(prev => prev === 'course' ? 'none' : 'course')}
              className={`p-2 rounded hover:bg-gray-700 transition-colors ${sidePanelMode === 'course' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              title="GooberLang Academy"
            >
              <GraduationCap size={18} />
            </button>
            <button 
              onClick={() => setSidePanelMode(prev => prev === 'docs' ? 'none' : 'docs')}
              className={`p-2 rounded hover:bg-gray-700 transition-colors ${sidePanelMode === 'docs' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              title="Cheatsheet & Docs"
            >
              <BookOpen size={18} />
            </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar: File Explorer */}
        <div className="w-64 bg-[#0b1221] border-r border-gray-800 flex flex-col shrink-0 z-10">
          <FileExplorer 
            files={files} 
            activeFileId={activeFileId} 
            onSelect={handleFileSelect}
            onCreateFile={(pid) => openModal('input', 'New File Name', 'create_file', pid)}
            onCreateFolder={(pid) => openModal('input', 'New Folder Name', 'create_folder', pid)}
            onDelete={(id) => openModal('confirm', 'Delete Item?', 'delete', id)}
            onImport={(fileList) => {
               Array.from(fileList).forEach(file => {
                  const reader = new FileReader();
                  reader.onload = async (e) => {
                     const content = e.target?.result as string;
                     const newFile: FileNode = {
                        id: Date.now().toString() + Math.random(),
                        name: file.name,
                        type: 'file',
                        parentId: null,
                        content: content || '',
                        depth: 0
                     };
                     await saveFile(newFile);
                     setFiles(prev => [...prev, newFile]);
                  };
                  reader.readAsText(file);
               });
            }}
            onToggleFolder={(id) => setFiles(prev => prev.map(f => f.id === id ? { ...f, isOpen: !f.isOpen } : f))}
            onSaveProject={() => openModal('input', 'Project Name', 'save_project')}
            onLoadProject={(fileList) => {
                if(fileList.length > 0) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const data = JSON.parse(e.target?.result as string);
                            await clearFileSystem();
                            for(const f of data) await saveFile(f);
                            setFiles(data);
                            if(data.length > 0) setActiveFileId(data[0].id);
                        } catch(err) { console.error(err); alert("Invalid project file"); }
                    };
                    reader.readAsText(fileList[0]);
                }
            }}
            onRunProject={handleRunProject}
            onOpenEasterEggs={() => setShowEasterEggs(true)}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
          {activeFile ? (
            <Editor key={activeFile.id} code={activeFile.content} onChange={handleCodeChange} />
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-600 flex-col">
                <Cpu size={48} className="mb-4 opacity-20" />
                <p>Select a file to begin neural engineering.</p>
             </div>
          )}
        </div>

        {/* System Console (Right Side) */}
        <div className={`${sidePanelMode !== 'none' ? 'hidden md:flex w-0 md:w-[30%]' : 'w-[35%]'} flex flex-col bg-[#0f172a] h-full border-l border-gray-800 min-h-0 z-10`}>
           <div className="flex-1 flex flex-col min-w-0 min-h-0">
              <div className="h-9 bg-[#0f172a] border-b border-gray-800 flex items-center px-1 shrink-0 justify-between">
                 <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 border-b-2 border-purple-500 text-white">
                   <TerminalIcon size={12} /> <span>System Console</span>
                 </div>
                 {isRunning && (
                    <button onClick={handleStop} className="mr-2 text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20">
                        <Square size={10} fill="currentColor" />
                    </button>
                 )}
              </div>
              <div className="flex-1 overflow-hidden relative min-h-0">
                <Console logs={logs} />
              </div>
           </div>
        </div>

        {/* Dynamic Side Panel (Docs or Course) */}
        {sidePanelMode !== 'none' && (
          <div className="w-[30%] bg-[#0f172a] border-l border-gray-800 flex flex-col z-20 shadow-2xl">
             {sidePanelMode === 'docs' && <Docs />}
             {sidePanelMode === 'course' && (
                <Course 
                  activeLessonIndex={activeLesson}
                  completedLessons={completedLessons}
                  currentCode={activeFile?.content || ''}
                  onNextLesson={(code) => {
                     if (!completedLessons.includes(activeLesson)) {
                        setCompletedLessons([...completedLessons, activeLesson]);
                     }
                     setActiveLesson(prev => prev + 1);
                     if (activeFile) handleCodeChange(code);
                  }}
                  onJumpToLesson={setActiveLesson}
                />
             )}
          </div>
        )}

        {/* --- MOVEABLE LIVE CONTROL PANEL --- */}
        {showControlPanel && (isRunning || plots.length > 0) && (
           <div 
             className="fixed z-50 bg-[#1e293b]/90 backdrop-blur border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden w-[400px]"
             style={{ top: panelPos.y, left: panelPos.x }}
           >
              {/* Draggable Header */}
              <div 
                onMouseDown={startDrag}
                className="h-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 flex items-center justify-between px-3 cursor-move border-b border-gray-700"
              >
                 <div className="flex items-center space-x-2">
                    <Activity size={14} className="text-purple-400 animate-pulse" />
                    <span className="text-xs font-bold text-gray-200 uppercase">Live Command Center</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Move size={12} className="text-gray-500" />
                    <button onClick={() => setShowControlPanel(false)} className="text-gray-400 hover:text-white"><X size={14}/></button>
                 </div>
              </div>

              {/* Visualizer Content */}
              <div className="h-[250px] bg-black/40">
                 <Visualizer plots={plots} />
              </div>

              {/* Control Buttons */}
              <div className="p-3 grid grid-cols-2 gap-2 border-t border-gray-700">
                 <button onClick={() => sendSignal('BOOST_LR')} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs py-2 rounded border border-blue-500/30 flex items-center justify-center transition-colors">
                    <Zap size={12} className="mr-1" /> Boost Plasticity
                 </button>
                 <button onClick={() => sendSignal('TRIGGER_ANOMALY')} className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 text-xs py-2 rounded border border-yellow-500/30 flex items-center justify-center transition-colors">
                    <AlertTriangle size={12} className="mr-1" /> Inject Anomaly
                 </button>
                 <button onClick={() => sendSignal('SPAR_INTENSE')} className="bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs py-2 rounded border border-red-500/30 flex items-center justify-center transition-colors">
                    <ShieldAlert size={12} className="mr-1" /> Max Sparring
                 </button>
                 <button onClick={() => sendSignal('SAVE_CHECKPOINT')} className="bg-green-600/20 hover:bg-green-600/40 text-green-300 text-xs py-2 rounded border border-green-500/30 flex items-center justify-center transition-colors">
                    <Save size={12} className="mr-1" /> Save Checkpoint
                 </button>
                 
                 {/* AGI Controls */}
                 <button onClick={() => sendSignal('PAUSE')} className="bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 text-xs py-2 rounded border border-gray-500/30 flex items-center justify-center transition-colors">
                    <Pause size={12} className="mr-1" /> Pause AGI
                 </button>
                 <button onClick={() => sendSignal('RESUME')} className="bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 text-xs py-2 rounded border border-gray-500/30 flex items-center justify-center transition-colors">
                    <PlayCircle size={12} className="mr-1" /> Resume AGI
                 </button>
                 
                 {/* Dedicated Stop Button */}
                 <button onClick={handleStop} className="col-span-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 text-xs py-2 rounded border border-red-500/40 flex items-center justify-center transition-colors mt-1 font-bold">
                    <Square size={12} className="mr-1 fill-current" /> EMERGENCY STOP
                 </button>
              </div>
           </div>
        )}

      </div>
      
      {/* Dialogs */}
      <InputModal 
         isOpen={modalState.isOpen} 
         title={modalState.title} 
         type={modalState.type}
         message={modalState.message}
         onSubmit={handleModalSubmit} 
         onCancel={handleModalCancel} 
      />
      <EasterEggsModal isOpen={showEasterEggs} onClose={() => setShowEasterEggs(false)} />
    </div>
  );
};

export default App;