export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'error' | 'success' | 'system';
  message: string;
}

export interface PlotSeries {
  key: string;
  color: string;
  name?: string;
}

export interface PlotData {
  id: string;
  title: string;
  xAxisKey: string;
  yAxisLabel?: string;
  series: PlotSeries[];
  data: any[]; // Array of objects for Recharts
  type: 'line' | 'bar' | 'area' | 'scatter';
}

export interface ExecutionResult {
  logs: string[];
  plots: PlotData[];
  error?: string;
  isFinished?: boolean; // True if the code execution has naturally ended
  confirmationRequest?: string; // Message if the runtime is waiting for user input
}

export enum ViewMode {
  EDITOR = 'EDITOR',
  VISUALIZATION = 'VISUALIZATION',
  CHEATSHEET = 'CHEATSHEET',
  COURSE = 'COURSE'
}

export interface DocItem {
  category: string;
  items: { name: string; signature: string; desc: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  task: string;
  hint: string;
  validationRegex: RegExp[]; // Patterns that must exist in code to pass
  startCode: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content: string; // For folders, this is ignored/empty
  isOpen?: boolean; // UI state for folders
  depth: number; // Helper for UI indentation
}

export interface EasterEgg {
  filename: string;
  description: string;
  trigger: string;
}

export type RuntimeSignal = 'STOP' | 'BOOST_LR' | 'TRIGGER_ANOMALY' | 'SPAR_INTENSE' | 'SAVE_CHECKPOINT' | 'PAUSE' | 'RESUME' | 'CONFIRM_YES' | 'CONFIRM_NO';