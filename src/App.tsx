import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
import { 
  Watch, Command, Radio, Zap, CheckCircle2, ArrowRight, 
  MessageSquare, ThumbsUp, Apple, BarChart3, Mail, LayoutTemplate,
  Star, Download, ChevronRight, Send
} from 'lucide-react';
import { cn } from './lib/utils';

// ============================================================================
// STEP 1: SETTING UP APP ANALYTICS (PostHog Integration)
// ============================================================================
// In a real production app, replace this with your actual PostHog Project API Key
// and keep it in an environment variable (e.g., process.env.VITE_POSTHOG_KEY).
if (typeof window !== 'undefined') {
  posthog.init('phc_dummy_key_for_logicflow_prototype', {
    api_host: 'https://app.posthog.com',
    autocapture: false, // We'll manually capture events for this demo
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug(false);
    }
  });
}

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeTab, setActiveTab] = useState<'landing' | 'feedback' | 'appstore'>('landing');
  const [showMakerPanel, setShowMakerPanel] = useState(true);

  // Track page views when tabs change
  useEffect(() => {
    posthog.capture('$pageview', { tab: activeTab });
  }, [activeTab]);

  // ============================================================================
  // STEP 0 & 3: WAITLIST & EMAIL SEQUENCE SYSTEM
  // ============================================================================
  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate network request to your email provider (e.g., Loops.so, Mailchimp, Formspree)
    setTimeout(() => {
      // 1. Track the conversion in Analytics
      posthog.capture('waitlist_joined', { email_domain: email.split('@')[1] });
      
      // 2. Trigger the automated email sequence (Simulated)
      console.log(`[EMAIL SEQUENCE TRIGGERED]: Added ${email} to "LogicFlow Welcome Sequence"`);
      console.log(`[EMAIL SEQUENCE]: Sending Day 0 Email: "Welcome to LogicFlow! Here is your setup guide."`);
      
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto border-b border-white/10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">LogicFlow</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button 
            onClick={() => setActiveTab('landing')}
            className={cn("hover:text-white transition-colors", activeTab === 'landing' && "text-white")}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            className={cn("hover:text-white transition-colors", activeTab === 'feedback' && "text-white")}
          >
            Feedback Board
          </button>
          <button 
            onClick={() => setActiveTab('appstore')}
            className={cn("hover:text-white transition-colors", activeTab === 'appstore' && "text-white")}
          >
            App Store
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-32">
        <AnimatePresence mode="wait">
          {/* ============================================================================
              STEP 5: THE LANDING PAGE
              ============================================================================ */}
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <section className="pt-16 pb-24 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-cyan-400 mb-8">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Beta launching soon
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

                {/* Waitlist Form */}
                <div className="max-w-md mx-auto">
                  {status === 'success' ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                      <p className="text-zinc-400 text-center text-sm">
                        Check your inbox. We just triggered your welcome email sequence!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleJoinWaitlist} className="relative group">
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
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                          {!status && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </form>
                  )}
                  <p className="text-xs text-zinc-500 mt-4 text-center">
                    Join 2,400+ producers waiting for early access.
                  </p>
                </div>
              </section>

              {/* Features Bento Grid */}
              <section className="grid md:grid-cols-3 gap-6">
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
                  <Radio className="w-8 h-8 text-cyan-400 mb-6" />
                  <h3 className="text-xl font-semibold mb-3">Two-Way Sync</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">See your track names, transport status, and metronome state directly on your Apple Watch in real-time.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
                  <Zap className="w-8 h-8 text-purple-400 mb-6" />
                  <h3 className="text-xl font-semibold mb-3">Zero Latency</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Custom Bluetooth MIDI implementation ensures your commands hit Logic Pro instantly. No Wi-Fi required.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
                  <Watch className="w-8 h-8 text-emerald-400 mb-6" />
                  <h3 className="text-xl font-semibold mb-3">Tactile Control</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Use the Digital Crown to scrub the timeline or adjust faders. Tap to record, cycle, and undo.</p>
                </div>
              </section>
            </motion.div>
          )}

          {/* ============================================================================
              STEP 2: SETTING UP A FEEDBACK BOARD
              ============================================================================ */}
          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Feature Requests</h2>
                <p className="text-zinc-400">Help us shape the future of LogicFlow. Vote on existing ideas or submit your own.</p>
              </div>

              <FeedbackBoard />
            </motion.div>
          )}

          {/* ============================================================================
              STEP 4: APP STORE LISTING
              ============================================================================ */}
          {activeTab === 'appstore' && (
            <motion.div
              key="appstore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white text-black rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                {/* Mock App Store Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-900 rounded-[22.5%] shadow-inner flex items-center justify-center flex-shrink-0 border border-zinc-200">
                    <Command className="w-16 h-16 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">LogicFlow Controller</h1>
                    <h2 className="text-xl text-zinc-500 mb-6">Pro DAW Remote for Watch</h2>
                    <div className="flex items-center gap-6">
                      <button className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full hover:bg-blue-700 transition-colors">
                        GET
                      </button>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-xs text-zinc-500 font-medium mt-1">4.9 • 1.2K Ratings</span>
                      </div>
                      <div className="hidden md:flex flex-col border-l border-zinc-200 pl-6">
                        <span className="text-lg font-bold text-zinc-400">#4</span>
                        <span className="text-xs text-zinc-500 font-medium">Music</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock App Store Screenshots */}
                <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
                  {[
                    { title: "Zero Latency", desc: "Instant Bluetooth MIDI" },
                    { title: "Digital Crown", desc: "Precision fader control" },
                    { title: "Two-Way Sync", desc: "See track names live" }
                  ].map((screen, i) => (
                    <div key={i} className="snap-center shrink-0 w-[250px] h-[500px] bg-zinc-100 rounded-[32px] border-8 border-zinc-200 flex flex-col items-center p-6 relative overflow-hidden">
                      <div className="text-center z-10 mt-4">
                        <h3 className="font-bold text-xl mb-2">{screen.title}</h3>
                        <p className="text-zinc-500 text-sm">{screen.desc}</p>
                      </div>
                      <div className="absolute bottom-[-20px] w-[200px] h-[240px] bg-zinc-900 rounded-[40px] border-4 border-zinc-800 shadow-2xl flex items-center justify-center">
                        <Watch className="w-16 h-16 text-cyan-400" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-200">
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    LogicFlow is the ultimate companion for Logic Pro users. Step away from your desk, step into the vocal booth, or pick up your guitar—and keep full control of your session right from your wrist.
                    <br/><br/>
                    Built with a custom Bluetooth MIDI implementation, LogicFlow guarantees zero-latency performance without relying on spotty Wi-Fi networks.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ============================================================================
          MAKER DASHBOARD (Proof of Execution)
          ============================================================================ */}
      <AnimatePresence>
        {showMakerPanel && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="bg-zinc-800 px-4 py-3 flex items-center justify-between border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-sm">Launch Checklist Executed</span>
              </div>
              <button onClick={() => setShowMakerPanel(false)} className="text-zinc-400 hover:text-white text-xs">Close</button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <ChecklistItem icon={<LayoutTemplate />} text="Step 0: Waitlist Page" done />
              <ChecklistItem icon={<BarChart3 />} text="Step 1: App Analytics (PostHog)" done />
              <ChecklistItem icon={<MessageSquare />} text="Step 2: Feedback Board" done />
              <ChecklistItem icon={<Mail />} text="Step 3: Email Sequence" done />
              <ChecklistItem icon={<Apple />} text="Step 4: App Store Listing" done />
              <ChecklistItem icon={<LayoutTemplate />} text="Step 5: Landing Page" done />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// FEEDBACK BOARD COMPONENT (Step 2 Implementation)
// ============================================================================
function FeedbackBoard() {
  const [ideas, setIdeas] = useState([
    { id: 1, title: 'Metronome haptic feedback', desc: 'Tap the wrist to the beat of the project tempo.', votes: 142, hasVoted: false },
    { id: 2, title: 'Support for Logic Pro iPad', desc: 'Allow connection to the iPad version of Logic.', votes: 89, hasVoted: false },
    { id: 3, title: 'Customizable buttons', desc: 'Let me map the 4 main buttons to any key command.', votes: 56, hasVoted: false },
  ]);
  const [newIdea, setNewIdea] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = (id: number) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        const isVoting = !idea.hasVoted;
        // Track the vote in Analytics
        posthog.capture('feedback_voted', { idea_id: id, idea_title: idea.title, action: isVoting ? 'upvote' : 'remove_vote' });
        return { ...idea, votes: idea.votes + (isVoting ? 1 : -1), hasVoted: isVoting };
      }
      return idea;
    }).sort((a, b) => b.votes - a.votes));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const idea = {
        id: Date.now(),
        title: newIdea,
        desc: newDesc,
        votes: 1,
        hasVoted: true
      };
      setIdeas([idea, ...ideas].sort((a, b) => b.votes - a.votes));
      
      // Track submission in Analytics
      posthog.capture('feedback_submitted', { title: newIdea });
      
      setNewIdea('');
      setNewDesc('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Submit New Idea */}
      <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-medium mb-4">Suggest a Feature</h3>
        <div className="space-y-4">
          <input
            type="text"
            required
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="Short, descriptive title"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Any additional details? (Optional)"
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newIdea}
            className="bg-white text-black font-medium px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Idea'}
            {!isSubmitting && <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Idea List */}
      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex gap-4 hover:bg-zinc-900/50 transition-colors">
            <button
              onClick={() => handleVote(idea.id)}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-xl border transition-colors flex-shrink-0",
                idea.hasVoted 
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" 
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              )}
            >
              <ThumbsUp className={cn("w-4 h-4 mb-1", idea.hasVoted && "fill-current")} />
              <span className="text-xs font-bold">{idea.votes}</span>
            </button>
            <div>
              <h4 className="font-medium text-zinc-100 text-lg">{idea.title}</h4>
              {idea.desc && <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{idea.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistItem({ icon, text, done }: { icon: React.ReactNode, text: string, done: boolean }) {
  return (
    <div className="flex items-center gap-3 text-zinc-300">
      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", done ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500")}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : React.cloneElement(icon as React.ReactElement<any>, { className: "w-3 h-3" })}
      </div>
      <span className={cn(done && "text-zinc-100 font-medium")}>{text}</span>
    </div>
  );
}
