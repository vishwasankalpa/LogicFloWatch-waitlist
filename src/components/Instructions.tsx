import React from 'react';
import ReactMarkdown from 'react-markdown';

const instructions = `
# Setup Guide

Follow these steps to build, run, and configure LogicFlow.

## 1. Xcode Project Setup

1. Open Xcode and create a new **App** project.
2. Select **Multiplatform** or create an iOS app and add a **Watch App** target.
3. Ensure you have two targets:
   - \`LogicFlowMac\` (macOS App)
   - \`LogicFlowWatch\` (watchOS App)
4. Copy the code from the **watchOS Code** tab into your Watch target.
5. Copy the code from the **macOS Code** tab into your Mac target.
6. Ensure \`WatchConnectivity.framework\` and \`CoreMIDI.framework\` are linked in your build phases.

## 2. Running the Apps

1. Build and run the **macOS App** on your Mac. You should see a new menu bar icon (a dial).
2. Build and run the **watchOS App** on your Apple Watch (or simulator).
3. Open the menu bar app on your Mac. The status should change from "Disconnected" to "Connected".

## 3. Configuring Logic Pro

By default, Logic Pro does not listen to MMC (MIDI Machine Control) or map custom CCs automatically. You need to configure it.

### Enabling Transport Controls (MMC)
1. Open Logic Pro.
2. Go to **Logic Pro > Settings > MIDI...**
3. Go to the **Sync** tab, then click **MIDI Sync Project Settings**.
4. Check the box for **Listen to MIDI Machine Control (MMC) Input**.
5. Now, Play, Stop, Record, and Rewind from the Watch will work instantly.

### Mapping Custom Controls (Volume, Mute, Solo)
1. In Logic Pro, press \`Cmd + L\` to open the **Controller Assignments** window.
2. Click on the **Volume** fader of Track 1.
3. On your Apple Watch, turn the Digital Crown. Logic will "learn" the CC message (CC 7).
4. Repeat this process for Mute (tap M on watch), Solo (tap S), and Arm (tap R).
5. You can also map the Marker and Undo buttons using the same \`Cmd + L\` method by clicking the corresponding buttons in Logic's UI and tapping the Watch.

## Troubleshooting

- **Watch says Disconnected:** Ensure Bluetooth and Wi-Fi are enabled on both devices. If using simulators, ensure you are running the paired Watch simulator for the specific Mac/iPhone.
- **Commands not reaching Logic:** Open the "Audio MIDI Setup" app on your Mac. Go to Window > Show MIDI Studio. Ensure "LogicFlow Virtual In" appears as an active MIDI destination.
`;

export default function Instructions() {
  return (
    <div className="max-w-3xl mx-auto bg-zinc-900 rounded-2xl p-8 border border-white/10">
      <div className="prose prose-invert prose-zinc max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-zinc-200 prose-code:text-indigo-400 prose-code:bg-indigo-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
        <ReactMarkdown>{instructions}</ReactMarkdown>
      </div>
    </div>
  );
}
