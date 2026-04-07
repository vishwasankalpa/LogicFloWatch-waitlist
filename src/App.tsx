import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
import { 
  Watch, Command, Radio, Zap, CheckCircle2, ArrowRight, 
  MessageSquare, ThumbsUp, Apple, BarChart3, Mail, LayoutTemplate,
  Star, Download, ChevronRight, Send
} from 'lucide-react';
import { cn } from './lib/utils';

// REAL FIREBASE IMPORTS
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  increment 
} from 'firebase/firestore';

// Analytics Init
if (typeof window !== 'undefined') {
  posthog.init('phc_dummy_key_for_logicflow_prototype', {
    api_host: 'https://app.posthog.com',
    autocapture: false,
  });
}

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeTab, setActiveTab] = useState<'landing' | 'feedback' | 'appstore'>('landing');

  useEffect(() => {
    posthog.capture('$pageview', { tab: activeTab });
  }, [activeTab]);

  // ============================================================================
  // REAL WAITLIST LOGIC
  // ============================================================================
  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      // SAVE TO FIRESTORE
      await addDoc(collection(db, "waitlist"), {
        email: email,
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        source: 'vercel_app'
      });

      posthog.capture('waitlist_joined', { email_domain: email.split('@')[1] });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error("Error joining waitlist:", error);
      alert("Something went wrong. Please try again!");
      setStatus('idle');
    }
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
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden relative border border-zinc-800">
            <Command className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">LogicFlow</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button onClick={() => setActiveTab('landing')} className={cn("hover:text-white transition-colors", activeTab === 'landing' && "text-white")}>Home</button>
          <button onClick={() => setActiveTab('feedback')} className={cn("hover:text-white transition-colors", activeTab === 'feedback' && "text-white")}>Feedback Board</button>
          <button onClick={() => setActiveTab('appstore')} className={cn("hover:text-white transition-colors", activeTab === 'appstore' && "text-white")}>App Store</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <section className="pt-16 pb-24 text-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                  Control Logic Pro <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">from your wrist.</span>
                </h1>
                
                <div className="max-w-md mx-auto">
                  {status === 'success' ? (
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                    </div>
                  ) : (
                    <form onSubmit={handleJoinWaitlist} className="relative group">
                      <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
                        <input
                          type="email" required value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full bg-transparent border-none outline-none px-4 text-zinc-100"
                        />
                        <button type="submit" disabled={status === 'loading'} className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-950 font-semibold">
                          {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <FeedbackBoard />
            </motion.div>
          )}

          {activeTab === 'appstore' && (
            <motion.div key="appstore" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white text-black rounded-[40px] p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Coming Soon to the App Store</h2>
                <p className="text-zinc-500">We are currently in the final stages of beta testing.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================================
// REAL FEEDBACK BOARD LOGIC
// ============================================================================
function FeedbackBoard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FETCH IDEAS IN REAL-TIME
  useEffect(() => {
    const q = query(collection(db, "feedback"), orderBy("votes", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideasData);
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async (id: string) => {
    const ideaRef = doc(db, "feedback", id);
    await updateDoc(ideaRef, {
      votes: increment(1)
    });
    posthog.capture('feedback_voted', { idea_id: id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "feedback"), {
        title: newIdea,
        description: newDesc,
        votes: 1,
        createdAt: serverTimestamp()
      });
      setNewIdea('');
      setNewDesc('');
    } catch (error) {
      console.error("Error submitting idea:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-medium">Suggest a Feature</h3>
        <input
          type="text" required value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Title"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3"
        />
        <textarea
          value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description" rows={3}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 resize-none"
        />
        <button type="submit" disabled={isSubmitting} className="bg-white text-black font-medium px-6 py-2.5 rounded-xl">
          {isSubmitting ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex gap-4">
            <button onClick={() => handleVote(idea.id)} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border border-zinc-800 bg-zinc-950">
              <ThumbsUp className="w-4 h-4 mb-1" />
              <span className="text-xs font-bold">{idea.votes}</span>
            </button>
            <div>
              <h4 className="font-medium text-zinc-100 text-lg">{idea.title}</h4>
              <p className="text-zinc-400 text-sm mt-1">{idea.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
