import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const watchOSCode = `// LogicFlowApp.swift
import SwiftUI

@main
struct LogicFlowApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// ConnectivityManager.swift (Shared)
import Foundation
import WatchConnectivity

class ConnectivityManager: NSObject, ObservableObject, WCSessionDelegate {
    static let shared = ConnectivityManager()
    @Published var connectionState: String = "Disconnected"
    
    override init() {
        super.init()
        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }
    }
    
    func sendCommand(_ command: String, value: Double? = nil) {
        if WCSession.default.isReachable {
            var message: [String: Any] = ["command": command]
            if let val = value { message["value"] = val }
            WCSession.default.sendMessage(message, replyHandler: nil)
        }
    }
    
    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        DispatchQueue.main.async {
            self.connectionState = state == .activated ? "Connected" : "Disconnected"
        }
    }
    
    #if os(iOS) || os(macOS)
    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) { WCSession.default.activate() }
    #endif
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        NotificationCenter.default.post(name: NSNotification.Name("ReceivedCommand"), object: nil, userInfo: message)
    }
}

// ContentView.swift
import SwiftUI

struct ContentView: View {
    @StateObject var connectivity = ConnectivityManager.shared
    
    var body: some View {
        TabView {
            TransportView()
            MixerView()
            MarkerView()
        }
        .tabViewStyle(PageTabViewStyle())
        .preferredColorScheme(.dark)
    }
}

// TransportView.swift
import SwiftUI

struct TransportView: View {
    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 20) {
                Button(action: { send("rewind") }) { Image(systemName: "backward.fill").font(.title2) }
                Button(action: { send("play") }) { Image(systemName: "play.fill").font(.title).foregroundColor(.green) }
                Button(action: { send("stop") }) { Image(systemName: "stop.fill").font(.title2).foregroundColor(.red) }
            }
            .buttonStyle(PlainButtonStyle())
            
            HStack(spacing: 20) {
                Button(action: { 
                    send("record")
                    WKInterfaceDevice.current().play(.start) // Haptic feedback
                }) { Image(systemName: "circle.fill").font(.title).foregroundColor(.red) }
                
                Button(action: { send("loop") }) { Image(systemName: "repeat").font(.title2) }
                Button(action: { send("metronome") }) { Image(systemName: "metronome").font(.title2) }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    func send(_ cmd: String) { ConnectivityManager.shared.sendCommand(cmd) }
}

// MixerView.swift
import SwiftUI

struct MixerView: View {
    @State private var volume: Double = 0.5
    
    var body: some View {
        VStack {
            Text("Track 1").font(.headline)
            
            HStack(spacing: 10) {
                Button("M") { send("mute") }.frame(width: 40, height: 40).background(Color.red.opacity(0.3)).cornerRadius(8)
                Button("S") { send("solo") }.frame(width: 40, height: 40).background(Color.yellow.opacity(0.3)).cornerRadius(8)
                Button("R") { send("arm") }.frame(width: 40, height: 40).background(Color.red.opacity(0.6)).cornerRadius(8)
            }
            .buttonStyle(PlainButtonStyle())
            .padding(.vertical, 8)
            
            Slider(value: $volume, in: 0...1) { editing in
                if !editing { send("volume", value: volume) }
            }
            .focusable(true)
            .digitalCrownRotation($volume, from: 0, through: 1, by: 0.05, sensitivity: .medium, isContinuous: false, isHapticFeedbackEnabled: true)
            .onChange(of: volume) { newValue in send("volume", value: newValue) }
        }
    }
    
    func send(_ cmd: String, value: Double? = nil) { ConnectivityManager.shared.sendCommand(cmd, value: value) }
}
`;

const macOSCode = `// LogicFlowMacApp.swift
import SwiftUI

@main
struct LogicFlowMacApp: App {
    @StateObject var connectivity = ConnectivityManager.shared
    
    init() {
        _ = MIDIManager.shared
        NotificationCenter.default.addObserver(forName: NSNotification.Name("ReceivedCommand"), object: nil, queue: .main) { notification in
            if let userInfo = notification.userInfo, let command = userInfo["command"] as? String {
                handleCommand(command, value: userInfo["value"] as? Double)
            }
        }
    }
    
    var body: some Scene {
        MenuBarExtra("LogicFlow", systemImage: "dial.min.fill") {
            VStack(alignment: .leading) {
                Text("LogicFlow Companion").font(.headline)
                Divider()
                HStack {
                    Circle().fill(connectivity.connectionState == "Connected" ? Color.green : Color.red).frame(width: 8, height: 8)
                    Text("Watch: \\(connectivity.connectionState)")
                }
                Divider()
                Button("Quit") { NSApplication.shared.terminate(nil) }
            }
            .padding()
        }
        .menuBarExtraStyle(.window)
    }
    
    func handleCommand(_ command: String, value: Double?) {
        let midi = MIDIManager.shared
        switch command {
        case "play": midi.sendMMC(command: 0x02)
        case "stop": midi.sendMMC(command: 0x01)
        case "record": midi.sendMMC(command: 0x06)
        case "rewind": midi.sendMMC(command: 0x05)
        case "volume":
            if let val = value {
                let midiVal = UInt8(val * 127)
                midi.sendCC(channel: 0, cc: 7, value: midiVal)
            }
        case "mute": midi.sendCC(channel: 0, cc: 9, value: 127)
        case "solo": midi.sendCC(channel: 0, cc: 10, value: 127)
        case "arm": midi.sendCC(channel: 0, cc: 11, value: 127)
        case "loop": midi.sendCC(channel: 0, cc: 113, value: 127)
        case "metronome": midi.sendCC(channel: 0, cc: 114, value: 127)
        case "prev_marker": midi.sendCC(channel: 0, cc: 115, value: 127)
        case "next_marker": midi.sendCC(channel: 0, cc: 116, value: 127)
        case "undo": midi.sendCC(channel: 0, cc: 117, value: 127)
        default: break
        }
    }
}

// MIDIManager.swift
import Foundation
import CoreMIDI

class MIDIManager {
    static let shared = MIDIManager()
    var midiClient: MIDIClientRef = 0
    var virtualDest: MIDIEndpointRef = 0
    
    init() {
        MIDIClientCreate("LogicFlowClient" as CFString, nil, nil, &midiClient)
        MIDIDestinationCreate(midiClient, "LogicFlow Virtual In" as CFString, { pktList, readProcRefCon, srcConnRefCon in
            // Handle incoming MIDI if needed
        }, nil, &virtualDest)
    }
    
    func sendMMC(command: UInt8) {
        var packet = MIDIPacket()
        packet.timeStamp = 0
        packet.length = 6
        packet.data.0 = 0xF0
        packet.data.1 = 0x7F
        packet.data.2 = 0x7F
        packet.data.3 = 0x06
        packet.data.4 = command
        packet.data.5 = 0xF7
        
        var packetList = MIDIPacketList(numPackets: 1, packet: packet)
        MIDIReceived(virtualDest, &packetList)
    }
    
    func sendCC(channel: UInt8, cc: UInt8, value: UInt8) {
        var packet = MIDIPacket()
        packet.timeStamp = 0
        packet.length = 3
        packet.data.0 = 0xB0 | channel
        packet.data.1 = cc
        packet.data.2 = value
        
        var packetList = MIDIPacketList(numPackets: 1, packet: packet)
        MIDIReceived(virtualDest, &packetList)
    }
}
`;

export default function CodeViewer({ type }: { type: 'watchos' | 'macos' }) {
  const code = type === 'watchos' ? watchOSCode : macOSCode;
  
  return (
    <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-zinc-800/50 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-medium text-sm text-zinc-200">
          {type === 'watchos' ? 'Apple Watch App (SwiftUI)' : 'Mac Companion App (macOS)'}
        </h3>
        <span className="text-xs text-zinc-500">Swift 5.9+</span>
      </div>
      <div className="p-4 overflow-x-auto text-sm">
        <SyntaxHighlighter 
          language="swift" 
          style={vscDarkPlus}
          customStyle={{ margin: 0, background: 'transparent' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
