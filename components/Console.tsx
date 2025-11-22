import React, { useRef, useState, useLayoutEffect } from 'react';
import { LogEntry } from '../types';
import { AlertTriangle, CheckCircle, Activity, Terminal, ArrowDown } from 'lucide-react';

interface ConsoleProps {
  logs: LogEntry[];
}

export const Console: React.FC<ConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showResumeBtn, setShowResumeBtn] = useState(false);
  
  // Track if user has intentionally scrolled up using a ref to avoid stale state in event listeners
  const userScrolledUp = useRef(false);

  // Use useLayoutEffect to scroll BEFORE the browser paints the next frame
  // This prevents the "jumpy" behavior seen with useEffect
  useLayoutEffect(() => {
    if (scrollRef.current && !userScrolledUp.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]); // Run every time logs update

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Threshold to consider "at bottom" (e.g. 50px)
    const distFromBottom = scrollHeight - (scrollTop + clientHeight);
    
    if (distFromBottom > 50) {
      // User has scrolled up significantly
      userScrolledUp.current = true;
      setShowResumeBtn(true);
    } else {
      // User is back at bottom
      userScrolledUp.current = false;
      setShowResumeBtn(false);
    }
  };

  const scrollToBottom = () => {
    userScrolledUp.current = false;
    setShowResumeBtn(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />;
      case 'success': return <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />;
      case 'system': return <Activity size={14} className="text-purple-400 mt-0.5 shrink-0" />;
      default: return <Terminal size={14} className="text-gray-500 mt-0.5 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] relative group min-h-0">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm custom-scrollbar"
      >
        {logs.length === 0 && (
          <div className="text-gray-600 italic">System ready. Waiting for execution...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3 hover:bg-white/5 p-0.5 rounded -mx-1 px-1 transition-colors">
            {getIcon(log.type)}
            <div className="min-w-0 flex-1">
              <span className="text-gray-600 text-[10px] mr-2 select-none inline-block w-[60px] text-right font-mono opacity-60">
                {log.timestamp.split(' ')[0]}
              </span>
              <span className={`break-all whitespace-pre-wrap ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                log.type === 'system' ? 'text-purple-300' :
                'text-gray-300'
              }`}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Resume Auto-Scroll Button */}
      {showResumeBtn && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-900/50 transition-all animate-in fade-in zoom-in duration-200 z-10 opacity-90 hover:opacity-100"
          title="Resume Auto-scroll"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
};