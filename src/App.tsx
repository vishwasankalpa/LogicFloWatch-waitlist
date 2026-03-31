import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion } from 'framer-motion';
import { Download, Sparkles, Key, Loader2, Apple } from 'lucide-react';
import { cn } from './lib/utils';

// Declare the aistudio global
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [macLogo, setMacLogo] = useState<string | null>(null);
  const [watchLogo, setWatchLogo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success to mitigate race conditions
      setHasKey(true);
    }
  };

  const generateLogos = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Create a fresh instance to ensure it picks up the latest key
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

      // Common prompt elements
      const basePrompt = "A modern, stylish, and eye-catching app icon for a professional music production Logic Pro controller. The design should subtly and elegantly reflect music production, such as a sleek minimal fader, a subtle waveform, or a modern control knob. The background should be a dark, rich charcoal or deep space gray, avoiding pure black so it doesn't blend into the display. Layered style, minimalist, adhering to Apple design guidelines. High quality, 3D subtle depth, vector-like precision. No text.";

      // Generate Mac Logo
      const macPromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: `${basePrompt} Designed specifically for macOS, centered perfectly within a square frame.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      // Generate Watch Logo
      const watchPromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: `${basePrompt} Designed specifically for watchOS, with the core design elements centered perfectly within a circular safe area.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      const [macResponse, watchResponse] = await Promise.all([macPromise, watchPromise]);

      // Extract Mac Image
      const macPart = macResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (macPart?.inlineData) {
        setMacLogo(`data:${macPart.inlineData.mimeType};base64,${macPart.inlineData.data}`);
      }

      // Extract Watch Image
      const watchPart = watchResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (watchPart?.inlineData) {
        setWatchLogo(`data:${watchPart.inlineData.mimeType};base64,${watchPart.inlineData.data}`);
      }

    } catch (err: any) {
      console.error("Generation error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key not found or invalid. Please select your key again.");
      } else {
        setError(err.message || "Failed to generate logos. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#141414] border border-white/10 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">API Key Required</h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            To generate high-quality app icons using Gemini, you need to select your Google Cloud API key with billing enabled.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-white text-black font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            Select API Key
          </button>
          <p className="mt-4 text-xs text-gray-500">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-gray-400">
              Learn more about billing requirements
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 font-sans">
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-medium tracking-tight">LogicFlow Logo Studio</h1>
          </div>
          <button
            onClick={generateLogos}
            disabled={isGenerating}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Icons
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">Craft your app identity.</h2>
          <p className="text-gray-400 text-lg">
            Generate pixel-perfect, Apple-compliant icons for your professional music production app. 
            Designed for macOS and watchOS.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* macOS Icon Panel */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 flex flex-col items-center">
            <div className="w-full flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  macOS Icon
                </h3>
                <p className="text-sm text-gray-500 mt-1">1024x1024 • Rounded Rectangle</p>
              </div>
              {macLogo && (
                <button
                  onClick={() => downloadImage(macLogo, 'macOS-Icon-1024.png')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Download macOS Icon"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              {macLogo ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={macLogo}
                  alt="macOS App Icon"
                  className="w-full h-full object-cover shadow-2xl"
                  style={{ borderRadius: '22.5%' }} // Apple's continuous curve approximation
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500" style={{ borderRadius: '22.5%' }}>
                  {isGenerating ? <Loader2 className="w-8 h-8 animate-spin mb-2" /> : <Apple className="w-8 h-8 mb-2 opacity-50" />}
                  <span className="text-sm">{isGenerating ? 'Designing...' : 'Not generated'}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-500 max-w-xs">
              The icon is generated as a square. The rounded corners are applied via CSS to preview how macOS will mask it.
            </div>
          </div>

          {/* watchOS Icon Panel */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 flex flex-col items-center">
            <div className="w-full flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  watchOS Icon
                </h3>
                <p className="text-sm text-gray-500 mt-1">1024x1024 • Circular Mask</p>
              </div>
              {watchLogo && (
                <button
                  onClick={() => downloadImage(watchLogo, 'watchOS-Icon-1024.png')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Download watchOS Icon"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              {watchLogo ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={watchLogo}
                  alt="watchOS App Icon"
                  className="w-full h-full object-cover shadow-2xl rounded-full"
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-white/20 rounded-full flex flex-col items-center justify-center text-gray-500">
                  {isGenerating ? <Loader2 className="w-8 h-8 animate-spin mb-2" /> : <Apple className="w-8 h-8 mb-2 opacity-50" />}
                  <span className="text-sm">{isGenerating ? 'Designing...' : 'Not generated'}</span>
                </div>
              )}
            </div>

            <div className="mt-8 text-center text-xs text-gray-500 max-w-xs">
              The icon is generated as a square. The circular mask is applied via CSS to preview how watchOS will display it.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
