import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Watch, Command, Radio, Zap, CheckCircle2, ArrowRight, PlayCircle } from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      // Using the provided Formspree endpoint
      const response = await fetch('https://formspree.io/f/xnjgyorn', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('idle');
        alert('Oops! There was a problem submitting your email.');
      }
    } catch (error) {
      setStatus('idle');
      alert('Oops! There was a problem submitting your email.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">LogicFlow</span>
        </div>
        <a 
          href="#waitlist" 
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Join Beta
        </a>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-cyan-400 mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                As seen on r/LogicPro
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                Control Logic Pro <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  from your wrist.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                The ultimate two-way Bluetooth MIDI controller for Apple Watch and Mac. 
                Record, loop, mix, and control your DAW without ever touching your mouse.
              </p>
            </motion.div>

            {/* Waitlist Form */}
            <motion.div 
              id="waitlist"
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                  <p className="text-zinc-400 text-center text-sm">
                    Keep an eye on your inbox. We'll send you a TestFlight invite as soon as the beta is ready.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-transparent border-none outline-none px-4 text-zinc-100 placeholder:text-zinc-500"
                      disabled={status === 'loading'}
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Joining...' : 'Join Beta'}
                      {!status && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}
              <p className="text-xs text-zinc-500 mt-4 text-center">
                No spam. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Video/Mockup Placeholder */}
        <section className="px-6 pb-32">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group flex items-center justify-center">
              {/* This is where they would put their Reddit video or a screenshot */}
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-zinc-800 opacity-50" />
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer border border-white/20">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-zinc-400 font-medium">Watch the Demo</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="px-6 pb-32 border-t border-zinc-900 pt-32 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for the modern studio.</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Everything you need to capture inspiration the moment it strikes, right from your wrist.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Radio className="w-6 h-6 text-cyan-400" />}
                title="Two-Way Sync"
                description="Not just a remote. See your track names, transport status, and metronome state directly on your Apple Watch."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-purple-400" />}
                title="Zero Latency"
                description="Custom Bluetooth MIDI implementation ensures your commands hit Logic Pro instantly. No Wi-Fi required."
              />
              <FeatureCard 
                icon={<Watch className="w-6 h-6 text-emerald-400" />}
                title="Tactile Control"
                description="Use the Digital Crown to scrub the timeline or adjust faders. Tap to record, cycle, and undo."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} LogicFlow. Built by a producer, for producers.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-zinc-100">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
