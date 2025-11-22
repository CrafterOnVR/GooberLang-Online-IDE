import React, { useState } from 'react';
import { DOCS } from '../constants';
import { ChevronRight, ChevronDown, BookOpen, Code, Search, Copy, Check } from 'lucide-react';

export const Docs: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>("Tensor & Data");
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const toggle = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleCopyAll = () => {
    const textContent = DOCS.map(cat => {
      const items = cat.items.map(item => `  ${item.name}${item.signature}\n    - ${item.desc}`).join('\n');
      return `[ ${cat.category} ]\n${items}`;
    }).join('\n\n');

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredDocs = DOCS.map(cat => ({
    category: cat.category,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="h-full bg-[#0f172a] border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1e293b] p-4">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <BookOpen size={16} className="text-purple-400 mr-2" />
                <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Global Cheatsheet</h2>
            </div>
            <button 
              onClick={handleCopyAll}
              className="text-xs flex items-center space-x-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700"
              title="Copy all docs to clipboard"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
         </div>
         <div className="relative">
            <Search size={12} className="absolute left-2 top-2.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search GB functions..." 
              className="w-full bg-[#0b1221] border border-gray-700 rounded py-1.5 pl-7 pr-2 text-xs text-gray-300 focus:border-purple-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
             {filteredDocs.map((cat) => (
              <div key={cat.category} className="mb-2">
                <button
                  onClick={() => toggle(cat.category)}
                  className="w-full flex items-center justify-between p-2 text-left text-gray-300 hover:bg-gray-800 rounded transition-colors text-xs font-semibold uppercase tracking-wide"
                >
                  {cat.category}
                  {(openCategory === cat.category || searchTerm) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                {(openCategory === cat.category || searchTerm) && (
                  <div className="mt-1 ml-2 space-y-1 border-l-2 border-gray-800 pl-2">
                    {cat.items.map((item) => (
                      <div key={item.name} className="p-2 hover:bg-gray-800/50 rounded group cursor-text select-text">
                        <div className="flex items-center text-purple-300 font-mono text-xs">
                          <Code size={10} className="mr-1 opacity-50" />
                          {item.name}
                        </div>
                        <div className="text-gray-500 text-[10px] font-mono mt-0.5">{item.signature}</div>
                        <div className="text-gray-400 text-xs mt-1 leading-tight">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredDocs.length === 0 && (
              <div className="text-center text-gray-500 text-xs mt-4">No functions found.</div>
            )}
      </div>
    </div>
  );
};