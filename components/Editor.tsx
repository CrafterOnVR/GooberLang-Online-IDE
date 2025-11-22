import React, { useState, useRef, useLayoutEffect } from 'react';
import { AUTOCOMPLETE_TOKENS } from '../constants';
import { Undo, Redo } from 'lucide-react';

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorCoords, setCursorCoords] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

  // --- Undo/Redo History State ---
  const [history, setHistory] = useState<string[]>([code]);
  const [historyIndex, setHistoryIndex] = useState(0);
  // Ref to track the last pushed code to prevent duplicates during rapid typing/updates
  const lastPushedCode = useRef(code);

  const pushToHistory = (newCode: string) => {
    if (newCode === lastPushedCode.current) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    
    // Limit history size to prevent memory issues
    if (newHistory.length > 100) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    lastPushedCode.current = newCode;
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevCode = history[newIndex];
      setHistoryIndex(newIndex);
      lastPushedCode.current = prevCode;
      onChange(prevCode);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextCode = history[newIndex];
      setHistoryIndex(newIndex);
      lastPushedCode.current = nextCode;
      onChange(nextCode);
    }
  };

  // --- Robust Scroll Synchronization ---
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !highlight || !lineNumbers) return;

    const handleScroll = () => {
      // Sync all layers to the textarea's scroll position immediately
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    // Attach native event listener for immediate response (better than React's onScroll)
    textarea.addEventListener('scroll', handleScroll);
    
    // Initial sync in case of re-render
    handleScroll();

    return () => {
      textarea.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Helper: Get caret coordinates for positioning the dropdown
  const updateCursorCoords = () => {
    if (!textareaRef.current) return;
    
    const { selectionStart } = textareaRef.current;
    const text = textareaRef.current.value;
    
    const div = document.createElement('div');
    const style = getComputedStyle(textareaRef.current);
    
    ['fontFamily', 'fontSize', 'fontWeight', 'wordWrap', 'whiteSpace', 'border', 'padding', 'margin'].forEach(prop => {
      (div.style as any)[prop] = (style as any)[prop];
    });
    
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.width = `${textareaRef.current.clientWidth}px`;
    div.textContent = text.substring(0, selectionStart);
    
    const span = document.createElement('span');
    span.textContent = text.substring(selectionStart) || '.'; 
    div.appendChild(span);
    
    document.body.appendChild(div);
    
    const top = span.offsetTop - textareaRef.current.scrollTop;
    const left = span.offsetLeft;
    
    document.body.removeChild(div);
    
    setCursorCoords({ top: top + 24, left });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Undo/Redo Shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            handleRedo();
        } else {
            handleUndo();
        }
        return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
        return;
    }

    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        insertSuggestion(suggestions[suggestionIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  const insertSuggestion = (suggestion: string) => {
    if (!textareaRef.current) return;
    const val = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    
    let start = selStart;
    while (start > 0 && /[\w.]/.test(val[start - 1])) {
      start--;
    }
    
    const before = val.substring(0, start);
    const after = val.substring(selStart);
    const newCode = before + suggestion + after;
    
    onChange(newCode);
    pushToHistory(newCode); // Save to history
    setShowSuggestions(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + suggestion.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    pushToHistory(val); // Save to history
    updateCursorCoords();
    
    const selStart = e.target.selectionStart;
    let start = selStart;
    while (start > 0 && /[\w.]/.test(val[start - 1])) {
      start--;
    }
    const currentWord = val.substring(start, selStart);
    
    if (currentWord.length > 1) {
      const matches = AUTOCOMPLETE_TOKENS.filter(t => 
        t.toLowerCase().startsWith(currentWord.toLowerCase()) && t !== currentWord
      );
      if (matches.length > 0) {
        setSuggestions(matches);
        setSuggestionIndex(0);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');

  const highlightCode = (inputCode: string) => {
    if (!inputCode) return '';

    let safeCode = inputCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const tokens: {[key: string]: string} = {};
    let tokenCounter = 0;
    
    const stash = (className: string) => (match: string) => {
      const key = `___TOKEN_${tokenCounter++}___`;
      tokens[key] = `<span class="${className}">${match}</span>`;
      return key;
    };

    safeCode = safeCode.replace(/(".*?")/g, stash("text-green-400"));
    safeCode = safeCode.replace(/(\/\/.*)/g, stash("text-gray-500 italic"));
    
    // Reordered: Numbers before Keywords to prevent '400' in 'text-purple-400' being highlighted
    safeCode = safeCode.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-300">$1</span>');
    
    safeCode = safeCode.replace(/\b(var|function|return|if|else|while|for|true|false|null|await|async|try|catch|const|let|break|continue)\b/g, 
      '<span class="text-purple-400 font-bold">$1</span>');
    safeCode = safeCode.replace(/\b(GB)\b/g, '<span class="text-blue-400 font-bold">$1</span>');
    safeCode = safeCode.replace(/\b([A-Z]\w+)(?=\()/g, '<span class="text-yellow-200">$1</span>'); 
    safeCode = safeCode.replace(/\b([a-z]\w+)(?=\()/g, '<span class="text-yellow-100">$1</span>'); 

    Object.keys(tokens).forEach(key => {
       safeCode = safeCode.split(key).join(tokens[key]);
    });

    return safeCode;
  };

  return (
    <div className="relative w-full h-full flex bg-[#0f172a] overflow-hidden group">
      {/* Style to hide scrollbar on highlight layer but keep space reserved */}
      <style>{`
        .editor-highlight-layer::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .editor-highlight-layer::-webkit-scrollbar-thumb {
          background: transparent;
        }
        /* Force scrollbar track to always exist to match textarea width */
        .force-scroll {
            overflow-y: scroll;
        }
      `}</style>

      {/* Line Numbers */}
      <div 
        ref={lineNumbersRef}
        className="w-12 py-4 text-right pr-3 text-gray-600 bg-[#0f172a] select-none border-r border-gray-800 font-mono text-sm leading-6 overflow-hidden"
      >
        <pre>{lineNumbers}</pre>
      </div>
      
      {/* Editor Container */}
      <div className="relative flex-1 h-full overflow-hidden">
        
        {/* Undo/Redo Controls (Floating) */}
        <div className="absolute top-2 right-4 flex items-center space-x-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 bg-gray-800/90 text-gray-400 hover:text-white hover:bg-gray-700/90 rounded border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors backdrop-blur-sm shadow-sm"
                title="Undo (Ctrl+Z)"
            >
                <Undo size={14} />
            </button>
            <button 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 bg-gray-800/90 text-gray-400 hover:text-white hover:bg-gray-700/90 rounded border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors backdrop-blur-sm shadow-sm"
                title="Redo (Ctrl+Y)"
            >
                <Redo size={14} />
            </button>
        </div>

        {/* Syntax Highlighting Layer (Background) */}
        <div
          ref={highlightRef}
          className="editor-highlight-layer force-scroll absolute inset-0 w-full h-full py-4 px-4 m-0 font-mono text-sm leading-6 bg-transparent pointer-events-none whitespace-pre-wrap break-all z-0"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
        />

        {/* Input Layer (Foreground) */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={updateCursorCoords}
          className="force-scroll absolute inset-0 w-full h-full py-4 px-4 bg-transparent outline-none resize-none font-mono text-sm leading-6 text-transparent caret-white z-10 custom-scrollbar whitespace-pre-wrap break-all"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder="// Start coding your neural network..."
        />
        
        {/* Autocomplete Popup */}
        {showSuggestions && (
          <div 
            className="absolute z-50 bg-[#1e293b] border border-purple-500/50 rounded-lg shadow-2xl max-h-40 overflow-y-auto min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
            style={{ top: cursorCoords.top, left: cursorCoords.left }}
          >
            <div className="px-2 py-1 text-[10px] font-bold text-purple-400 uppercase border-b border-gray-700 bg-gray-800/50 flex justify-between">
              <span>Suggestion</span>
              <span className="text-gray-500">Tab/Enter</span>
            </div>
            {suggestions.map((s, i) => (
              <button
                key={s}
                onMouseDown={(e) => { e.preventDefault(); insertSuggestion(s); }}
                className={`w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-purple-600/20 text-gray-300 hover:text-white ${i === suggestionIndex ? 'bg-purple-900/40 text-white ring-1 ring-purple-500/30' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};