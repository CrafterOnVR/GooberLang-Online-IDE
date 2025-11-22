
import React, { useState, useRef, useEffect } from 'react';
import { FileNode } from '../types';
import { 
  Folder, FolderOpen, FileCode, Trash2, Upload, 
  ChevronRight, ChevronDown, FilePlus, FolderPlus,
  Download, ArchiveRestore, Gift, Play
} from 'lucide-react';

interface FileExplorerProps {
  files: FileNode[];
  activeFileId: string | null;
  onSelect: (file: FileNode) => void;
  onCreateFile: (parentId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onDelete: (id: string) => void;
  onImport: (files: FileList) => void;
  onToggleFolder: (id: string) => void;
  onSaveProject: () => void;
  onLoadProject: (files: FileList) => void;
  onRunProject: () => void;
  onOpenEasterEggs: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelect,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onImport,
  onToggleFolder,
  onSaveProject,
  onLoadProject,
  onRunProject,
  onOpenEasterEggs
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string; type: 'file' | 'folder' } | null>(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id, type: node.type });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImport(e.dataTransfer.files);
    }
  };

  const renderTree = (parentId: string | null = null) => {
    const children = files
      .filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });

    return children.map(node => {
        const isFolder = node.type === 'folder';
        const isActive = node.id === activeFileId;
        
        // Special File Visuals
        const isGolden = node.name === 'agi.gb' || node.name === 'god_mode.gb' || node.name === 'omega.gb';
        const isAIClass = !isGolden && (node.name === 'llm.gb' || node.name === 'optimization.gb' || node.name === 'multi.gb');
        
        return (
          <div key={node.id} className="group relative">
            <div
              className={`
                flex items-center px-2 py-1 text-xs cursor-pointer select-none transition-colors pr-12
                ${isActive ? 'bg-purple-900/40 text-purple-200' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
              `}
              style={{ paddingLeft: `${(node.depth * 12) + 8}px` }}
              onClick={() => isFolder ? onToggleFolder(node.id) : onSelect(node)}
              onContextMenu={(e) => handleContextMenu(e, node)}
            >
              {/* Visual Guide Line for Nested Items */}
              {node.depth > 0 && (
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-800/50" style={{ left: `${(node.depth * 12)}px` }} />
              )}

              <span className="mr-1 opacity-70">
                {isFolder ? (
                  node.isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />
                ) : <span className="w-[10px] inline-block" />}
              </span>
              
              <span className={`mr-2 ${isFolder ? 'text-yellow-500' : (isGolden ? 'text-yellow-400' : isAIClass ? 'text-cyan-400' : 'text-blue-400')}`}>
                {isFolder ? (
                  node.isOpen ? <FolderOpen size={14} /> : <Folder size={14} />
                ) : <FileCode size={14} className={isGolden ? "filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse" : isAIClass ? "filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" : ""} />}
              </span>
              
              <span className={`flex-1 truncate font-mono ${
                  isGolden 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-300 font-bold filter drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' 
                  : isAIClass 
                    ? 'text-cyan-300 font-bold filter drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]' 
                    : ''
                }`}>
                {node.name}
              </span>

              {/* Hover Actions */}
              <div className="absolute right-1 flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0b1221] rounded px-1 shadow-md border border-gray-800 z-10">
                 {isFolder && (
                   <>
                    <button onClick={(e) => { e.stopPropagation(); onCreateFile(node.id); }} className="p-1 hover:text-blue-400"><FilePlus size={10} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onCreateFolder(node.id); }} className="p-1 hover:text-yellow-400"><FolderPlus size={10} /></button>
                   </>
                 )}
                <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} className="p-1 hover:text-red-400"><Trash2 size={10} /></button>
              </div>
            </div>
            {isFolder && node.isOpen && renderTree(node.id)}
          </div>
        );
      });
  };

  return (
    <div 
      className={`h-full flex flex-col bg-[#0b1221] border-r border-gray-800 relative ${dragActive ? 'bg-gray-800/50' : ''}`}
      onDragEnter={handleDrag} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={handleDrop}
    >
      {dragActive && (
        <div className="absolute inset-0 z-50 bg-purple-500/20 border-2 border-dashed border-purple-500 flex items-center justify-center pointer-events-auto">
          <span className="text-purple-200 font-bold text-sm bg-gray-900 px-3 py-1 rounded shadow-xl">Drop to Import</span>
        </div>
      )}

      <div className="p-3 border-b border-gray-800 flex flex-col gap-2 shrink-0 bg-[#0b1221]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 uppercase">Explorer</span>
          <div className="flex items-center space-x-1">
             <button onClick={() => onCreateFile(null)} title="New File" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><FilePlus size={14} /></button>
             <button onClick={() => onCreateFolder(null)} title="New Folder" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><FolderPlus size={14} /></button>
             <button onClick={() => fileInputRef.current?.click()} title="Import" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"><Upload size={14} /></button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-800/50 gap-1">
          <div className="flex space-x-1">
            <button onClick={onSaveProject} className="flex items-center px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-400 hover:text-white transition-colors"><Download size={10} className="mr-1" /> Save</button>
            <button onClick={() => projectInputRef.current?.click()} className="flex items-center px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-400 hover:text-white transition-colors"><ArchiveRestore size={10} className="mr-1" /> Load</button>
          </div>
          <button 
            onClick={onRunProject} 
            className="flex-1 flex items-center justify-center px-2 py-1 rounded bg-green-900/30 hover:bg-green-900/50 text-[10px] text-green-400 hover:text-green-300 transition-colors border border-green-800/30"
          >
            <Play size={10} className="mr-1 fill-current" /> Run Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 relative">
          {/* Main Tree Render */}
          {renderTree(null)}
      </div>

      {contextMenu && (
        <div 
          className="fixed z-[60] bg-[#1e293b] border border-gray-700 rounded-lg shadow-2xl py-1 w-40"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()} 
        >
           {contextMenu.type === 'folder' && (
             <>
              <button onClick={() => { onCreateFile(contextMenu.nodeId); setContextMenu(null); }} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-purple-600 hover:text-white flex items-center"><FilePlus size={12} className="mr-2" /> New File</button>
              <button onClick={() => { onCreateFolder(contextMenu.nodeId); setContextMenu(null); }} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-purple-600 hover:text-white flex items-center"><FolderPlus size={12} className="mr-2" /> New Folder</button>
              <div className="h-[1px] bg-gray-700 my-1 mx-1" />
             </>
           )}
           <button onClick={() => { onDelete(contextMenu.nodeId); setContextMenu(null); }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/30 hover:text-red-200 flex items-center"><Trash2 size={12} className="mr-2" /> Delete</button>
        </div>
      )}
      
      <div className="p-2 bg-[#0b1221] border-t border-gray-800">
        <button onClick={onOpenEasterEggs} className="w-full flex items-center justify-center p-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 rounded text-[10px] text-gray-400 hover:text-purple-300 transition-all">
          <Gift size={10} className="mr-1.5" /> Secrets
        </button>
      </div>

      <input type="file" multiple ref={fileInputRef} className="hidden" accept=".gb,.txt" onChange={(e) => e.target.files && onImport(e.target.files)} />
      <input type="file" ref={projectInputRef} className="hidden" accept=".json" onChange={(e) => { if(e.target.files) { onLoadProject(e.target.files); e.target.value = ''; }}} />
    </div>
  );
};
