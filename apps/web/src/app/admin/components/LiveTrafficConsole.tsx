import { useRef, useEffect } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { SystemLog } from '../../../types';

interface LiveTrafficConsoleProps {
  systemLogs: SystemLog[];
  onClearLogs: () => void;
}

export default function LiveTrafficConsole({
  systemLogs,
  onClearLogs,
}: LiveTrafficConsoleProps) {
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log to bottom when logs update
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [systemLogs]);

  return (
    <div className="bg-[#121513] text-zinc-300 rounded-2xl p-5 border border-brand-green/40 shadow-xl flex flex-col h-full overflow-hidden" id="system-terminal-log">
      
      {/* Console Header navbar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800" id="terminal-navbar">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5" id="terminal-window-dots">
            <span className="w-3 h-3 rounded-full bg-red-500/80 block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 block"></span>
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-brand-gold-light ml-2">
            <Terminal className="w-4 h-4" />
            <span>system-activity-log</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">

          <button
            onClick={onClearLogs}
            className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-brand-gold font-semibold font-mono px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Flush console log trace"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Log
          </button>
        </div>
      </div>

      {/* Log trace body viewer */}
      <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-4 whitespace-pre-wrap select-text scrollbar-thin scrollbar-thumb-zinc-800" id="terminal-body-pane">
        {systemLogs.map((log) => (
          <div key={log.id} className="border-b border-zinc-900 pb-3" id={`trace-block-${log.id}`}>
            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
              <span className="text-zinc-500 font-bold">[{log.timestamp}]</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded text-[10px] select-none ${
                  log.apiName === 'Groq API'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                    : log.apiName === 'Gemini API'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                    : log.apiName === 'Cohere.ai API'
                    ? 'bg-amber-950 text-brand-gold-light border border-amber-800/50'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                }`}
              >
                {log.apiName}
              </span>
              <span className="text-zinc-400 font-semibold">{log.method}</span>
              <span className="text-brand-gold">{log.endpoint}</span>
              <span className="text-zinc-500 font-medium">({log.latencyMs}ms)</span>
              <span className="text-emerald-400 ml-auto font-bold">{log.status}</span>
            </div>
            {/* JSON Body */}
            <div className="bg-black/40 text-emerald-300/90 rounded p-2.5 text-[11px] overflow-x-auto shadow-inner border border-zinc-900">
              {log.payload}
            </div>
          </div>
        ))}
        <div ref={consoleBottomRef}></div>
      </div>

      <p className="text-[10px] text-zinc-600 font-mono text-center pt-2.5 border-t border-zinc-800 flex items-center justify-center gap-1.5 select-none animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
        Listening for activity...
      </p>
    </div>
  );
}
