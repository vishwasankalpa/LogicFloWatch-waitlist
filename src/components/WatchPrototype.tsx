import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Square, Circle, Rewind, Repeat, 
  ListMusic, Volume2, Mic, ChevronLeft, 
  ChevronRight, Undo2, Activity, VolumeX, Monitor
} from 'lucide-react';

export default function WatchPrototype() {
  const [activeTab, setActiveTab] = useState(0);
  const [volume, setVolume] = useState(50);
  const [logs, setLogs] = useState<{id: number, cmd: string, val?: number, time: string}[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (cmd: string, val?: number) => {
    const newLog = {
      id: Date.now(),
      cmd,
      val,
      time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 })
    };
    setLogs(prev => [...prev, newLog].slice(-20)); // Keep last 20
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (cmd: string, val?: number) => {
    addLog(cmd, val);
    
    // Simulate some state changes
    if (cmd === 'play') setIsPlaying(true);
    if (cmd === 'stop') { setIsPlaying(false); setIsRecording(false); }
    if (cmd === 'record') setIsRecording(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
      
      {/* Watch Container */}
      <div className="relative w-[300px] h-[360px] bg-zinc-900 rounded-[60px] p-4 shadow-2xl border-[12px] border-zinc-800 flex flex-col items-center justify-center ring-1 ring-white/10">
        {/* Digital Crown Mock */}
        <div className="absolute -right-4 top-24 w-3 h-16 bg-zinc-700 rounded-r-lg border-y border-r border-zinc-600 shadow-inner"></div>
        {/* Side Button Mock */}
        <div className="absolute -right-3 top-48 w-2 h-12 bg-zinc-800 rounded-r-md border-y border-r border-zinc-700"></div>

        {/* Screen */}
        <div className="w-full h-full bg-black rounded-[40px] overflow-hidden relative flex flex-col">
          {/* Status Bar */}
          <div className="h-8 flex items-center justify-between px-5 text-[10px] text-zinc-400 font-medium">
            <span>10:09</span>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : isPlaying ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 flex"
              animate={{ x: `-${activeTab * 100}%` }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Tab 0: Transport */}
              <div className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-4 gap-4">
                <div className="flex gap-4">
                  <button onClick={() => handleCommand('rewind')} className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 transition-colors">
                    <Rewind className="w-5 h-5 text-white" fill="currentColor" />
                  </button>
                  <button onClick={() => handleCommand('play')} className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 transition-colors">
                    <Play className="w-6 h-6 text-green-500" fill="currentColor" />
                  </button>
                  <button onClick={() => handleCommand('stop')} className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 transition-colors">
                    <Square className="w-5 h-5 text-red-500" fill="currentColor" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleCommand('record')} className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 transition-colors">
                    <Circle className="w-6 h-6 text-red-500" fill="currentColor" />
                  </button>
                  <button onClick={() => handleCommand('loop')} className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 transition-colors">
                    <Repeat className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={() => handleCommand('metronome')} className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 transition-colors">
                    <Activity className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Tab 1: Mixer */}
              <div className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-4 gap-3">
                <div className="text-sm font-semibold text-white">Track 1</div>
                
                <div className="flex gap-3">
                  <button onClick={() => handleCommand('mute')} className="w-10 h-10 rounded-lg bg-red-500/20 text-red-500 font-bold flex items-center justify-center active:bg-red-500/40 transition-colors">M</button>
                  <button onClick={() => handleCommand('solo')} className="w-10 h-10 rounded-lg bg-yellow-500/20 text-yellow-500 font-bold flex items-center justify-center active:bg-yellow-500/40 transition-colors">S</button>
                  <button onClick={() => handleCommand('arm')} className="w-10 h-10 rounded-lg bg-red-500/50 text-white font-bold flex items-center justify-center active:bg-red-500/70 transition-colors">R</button>
                </div>

                <div className="w-full px-2 mt-2 flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <VolumeX className="w-3 h-3" />
                    <Volume2 className="w-3 h-3" />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      handleCommand('volume', Number(e.target.value));
                    }}
                    className="w-full h-2 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                  <div className="text-[10px] text-center text-zinc-500 mt-1">Crown to adjust</div>
                </div>
              </div>

              {/* Tab 2: Markers */}
              <div className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-4 gap-2">
                <button onClick={() => handleCommand('prev_marker')} className="w-full py-3 px-4 rounded-xl bg-zinc-800 flex items-center justify-between active:bg-zinc-700 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium">Prev Marker</span>
                  <div className="w-4"></div>
                </button>
                <button onClick={() => handleCommand('next_marker')} className="w-full py-3 px-4 rounded-xl bg-zinc-800 flex items-center justify-between active:bg-zinc-700 transition-colors">
                  <div className="w-4"></div>
                  <span className="text-sm font-medium">Next Marker</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => handleCommand('undo')} className="w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 active:bg-zinc-800 transition-colors mt-2">
                  <Undo2 className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">Undo</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Page Indicators */}
          <div className="h-6 flex items-center justify-center gap-1.5 pb-2">
            {[0, 1, 2].map(i => (
              <button 
                key={i}
                onClick={() => setActiveTab(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${activeTab === i ? 'bg-white' : 'bg-zinc-700'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mac Companion Simulator */}
      <div className="flex-1 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-zinc-800/50 px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-zinc-400" />
            <h3 className="font-medium text-sm">Mac Companion Log</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            Connected
          </div>
        </div>
        
        <div 
          ref={logContainerRef}
          className="h-[300px] overflow-y-auto p-4 font-mono text-xs flex flex-col gap-2"
        >
          {logs.length === 0 ? (
            <div className="text-zinc-500 h-full flex items-center justify-center text-center">
              Waiting for commands from Watch...<br/>
              Interact with the prototype to see MIDI/OSC commands.
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 text-zinc-300 border-b border-white/5 pb-2">
                <span className="text-zinc-500 shrink-0">{log.time}</span>
                <div>
                  <span className="text-indigo-400 font-semibold">Received: </span>
                  <span className="text-white">{log.cmd}</span>
                  {log.val !== undefined && <span className="text-emerald-400 ml-2">val: {log.val}</span>}
                  
                  <div className="text-zinc-500 mt-1">
                    {log.cmd === 'play' && '→ MMC: F0 7F 7F 06 02 F7'}
                    {log.cmd === 'stop' && '→ MMC: F0 7F 7F 06 01 F7'}
                    {log.cmd === 'record' && '→ MMC: F0 7F 7F 06 06 F7'}
                    {log.cmd === 'rewind' && '→ MMC: F0 7F 7F 06 05 F7'}
                    {log.cmd === 'volume' && `→ CC: Ch 1, CC 7, Val ${Math.round((log.val || 0) * 1.27)}`}
                    {['mute', 'solo', 'arm', 'loop', 'metronome', 'prev_marker', 'next_marker', 'undo'].includes(log.cmd) && `→ CC: Ch 1, Custom CC, Val 127`}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
