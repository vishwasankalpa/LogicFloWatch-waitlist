import React from 'react';
import { Watch, Monitor, ArrowRightLeft, Music } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold">System Architecture</h2>
        <p className="text-zinc-400">How LogicFlow connects your Apple Watch to Logic Pro.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-zinc-900 rounded-2xl border border-white/10">
        
        {/* Watch Node */}
        <div className="flex flex-col items-center gap-4 w-48 text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Watch className="w-10 h-10 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Apple Watch</h3>
            <p className="text-xs text-zinc-400 mt-1">SwiftUI Interface<br/>Digital Crown Input<br/>Haptic Feedback</p>
          </div>
        </div>

        {/* Connection 1 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">WatchConnectivity</span>
          <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500/50 to-emerald-500/50 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-1 rounded-full">
              <ArrowRightLeft className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          <span className="text-xs text-zinc-500">WCSession Messages</span>
        </div>

        {/* Mac Node */}
        <div className="flex flex-col items-center gap-4 w-48 text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Monitor className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Mac Companion</h3>
            <p className="text-xs text-zinc-400 mt-1">Menu Bar App<br/>CoreMIDI Bridge<br/>Background Service</p>
          </div>
        </div>

        {/* Connection 2 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">CoreMIDI</span>
          <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-orange-500/50 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-1 rounded-full">
              <ArrowRightLeft className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          <span className="text-xs text-zinc-500">Virtual MIDI Port</span>
        </div>

        {/* Logic Pro Node */}
        <div className="flex flex-col items-center gap-4 w-48 text-center">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
            <Music className="w-10 h-10 text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Logic Pro</h3>
            <p className="text-xs text-zinc-400 mt-1">DAW<br/>MMC Listener<br/>MIDI Learn</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
          <h4 className="font-semibold text-white mb-2">1. User Input</h4>
          <p className="text-sm text-zinc-400">The user taps a button or turns the Digital Crown on the Apple Watch. SwiftUI captures this event and passes it to the ConnectivityManager.</p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
          <h4 className="font-semibold text-white mb-2">2. Transmission</h4>
          <p className="text-sm text-zinc-400">WatchConnectivity sends a lightweight dictionary (e.g., <code>{`{"command": "play"}`}</code>) via Bluetooth/Wi-Fi to the paired Mac running the companion app.</p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
          <h4 className="font-semibold text-white mb-2">3. MIDI Translation</h4>
          <p className="text-sm text-zinc-400">The Mac app receives the dictionary, translates it into a standard MIDI Machine Control (MMC) or Control Change (CC) packet, and broadcasts it to a Virtual MIDI Port.</p>
        </div>
      </div>
    </div>
  );
}
