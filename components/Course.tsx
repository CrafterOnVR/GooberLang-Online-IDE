import React, { useState } from 'react';
import { COURSE_CURRICULUM } from '../constants';
import { GraduationCap, CheckCircle, XCircle, ArrowRight, Lock } from 'lucide-react';

interface CourseProps {
  activeLessonIndex: number;
  completedLessons: number[];
  currentCode: string;
  onNextLesson: (code: string) => void;
  onJumpToLesson: (index: number) => void;
}

export const Course: React.FC<CourseProps> = ({ 
  activeLessonIndex, 
  completedLessons, 
  currentCode, 
  onNextLesson,
  onJumpToLesson
}) => {
  const [checkStatus, setCheckStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const lesson = COURSE_CURRICULUM[activeLessonIndex];
  const isCompleted = completedLessons.includes(activeLessonIndex);

  const handleCheck = () => {
    const passes = lesson.validationRegex.every(regex => regex.test(currentCode));
    if (passes) {
      setCheckStatus('success');
    } else {
      setCheckStatus('fail');
    }
  };

  const handleNext = () => {
    setCheckStatus('idle');
    const nextIndex = activeLessonIndex + 1;
    if (nextIndex < COURSE_CURRICULUM.length) {
        // Pass the starting code of the next lesson to the parent
        onNextLesson(COURSE_CURRICULUM[nextIndex].startCode);
    }
  };

  return (
    <div className="h-full bg-[#0f172a] border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1e293b] p-4">
         <div className="flex items-center mb-1">
            <GraduationCap size={18} className="text-blue-400 mr-2" />
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">GooberLang Academy</h2>
         </div>
         <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${((completedLessons.length) / COURSE_CURRICULUM.length) * 100}%` }}
            />
         </div>
         <div className="text-[10px] text-gray-400 mt-1 text-right">
            {completedLessons.length} / {COURSE_CURRICULUM.length} Completed
         </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{lesson.description}</p>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-2">Mission Objective</h4>
            <p className="text-sm text-white font-medium">{lesson.task}</p>
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 rounded p-3">
             <span className="text-xs font-bold text-blue-400 uppercase mr-2">Hint:</span>
             <span className="text-xs text-gray-400 font-mono">{lesson.hint}</span>
          </div>
        </div>

        {/* Validation Area */}
        <div className="mt-4 space-y-3">
           {checkStatus === 'fail' && (
             <div className="flex items-center p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm animate-in slide-in-from-bottom-2">
                <XCircle size={18} className="mr-2 shrink-0" />
                Try again! Check the hint above.
             </div>
           )}
           
           {checkStatus === 'success' && (
             <div className="flex items-center p-3 bg-green-900/20 border border-green-900/50 rounded text-green-200 text-sm animate-in slide-in-from-bottom-2">
                <CheckCircle size={18} className="mr-2 shrink-0" />
                Mission Accomplished!
             </div>
           )}

           {checkStatus !== 'success' ? (
             <button 
               onClick={handleCheck}
               className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
             >
               Check Code
             </button>
           ) : (
             <button 
               onClick={handleNext}
               className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] flex items-center justify-center"
             >
               Next Lesson <ArrowRight size={16} className="ml-2" />
             </button>
           )}
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-4">
           <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Curriculum Map</h4>
           <div className="space-y-1">
             {COURSE_CURRICULUM.map((l, idx) => {
               const locked = idx > Math.max(...completedLessons, 0) && idx > activeLessonIndex;
               const done = completedLessons.includes(idx);
               const active = idx === activeLessonIndex;
               
               return (
                 <button 
                   key={l.id}
                   disabled={locked}
                   onClick={() => onJumpToLesson(idx)}
                   className={`w-full flex items-center justify-between p-2 text-left rounded text-xs transition-colors ${
                     active ? 'bg-blue-900/20 text-blue-300 border border-blue-900/50' : 
                     locked ? 'opacity-40 cursor-not-allowed text-gray-500' : 
                     'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                   }`}
                 >
                    <span className="flex items-center">
                       {done ? <CheckCircle size={12} className="text-green-500 mr-2" /> : 
                        locked ? <Lock size={12} className="mr-2" /> : 
                        <span className="w-3 h-3 rounded-full border border-gray-600 mr-2 flex items-center justify-center"><div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-400' : ''}`} /></span>}
                       {l.title}
                    </span>
                 </button>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};