'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Check,
  Star,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldCheck,
  MousePointerClick,
  Sliders,
  Laptop,
  CheckCircle2,
  FileSpreadsheet,
  HeartHandshake,
  TrendingUp,
  Globe2,
  Play,
  RotateCcw,
  MessageSquare,
  Bot,
  Send,
  Workflow,
  Search,
  Filter,
  Users,
  Database,
  Calendar,
  CreditCard,
  Building2,
  Share2,
  Settings,
  Volume2,
  Radio,
  Activity,
  Tv,
  ExternalLink,
  Mail
} from 'lucide-react';

export default function TypeformLandingPage() {
  // ── Hero 3-Tab State & Auto-Advance Progress ──
  const [activeTab, setActiveTab] = useState<'ask' | 'act' | 'learn'>('ask');
  const [tabProgress, setTabProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Default to interactive so users can immediately fill out the form!
  const [viewMode, setViewMode] = useState<'video' | 'interactive'>('interactive');

  // Tab 1 (ASK) interactive 3-step form filling state
  const [demoStep, setDemoStep] = useState(0); // 0: multiple choice, 1: text/email, 2: rating, 3: completed
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoRating, setDemoRating] = useState<number | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCustomQuestion, setAiCustomQuestion] = useState<string | null>(null);

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Tab 2 (ACT) interactive workflow state
  const [activeWorkflowNode, setActiveWorkflowNode] = useState<number>(1);

  // Template filter state
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Auto-advance tabs every 9 seconds unless paused or actively filling
  useEffect(() => {
    // If user is actively filling out the demo form (step > 0), don't auto-switch tabs
    if (isPaused || (activeTab === 'ask' && demoStep > 0 && viewMode === 'interactive')) return;

    const interval = 90;
    const stepIncrement = (interval / 9000) * 100;

    const timer = setInterval(() => {
      setTabProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => {
            if (current === 'ask') return 'act';
            if (current === 'act') return 'learn';
            return 'ask';
          });
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, activeTab, demoStep, viewMode]);

  // Tab click
  const handleTabClick = (tab: 'ask' | 'act' | 'learn') => {
    setActiveTab(tab);
    setTabProgress(0);
  };

  // Step 1: Select goal option
  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
    setTimeout(() => {
      setDemoStep(1);
      setTimeout(() => emailInputRef.current?.focus(), 150);
    }, 350);
  };

  // Step 2: Submit email
  const handleEmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!demoEmail.trim()) {
      setDemoEmail('user@company.com');
    }
    setDemoStep(2);
  };

  // Step 3: Select rating
  const handleSelectRating = (score: number) => {
    setDemoRating(score);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#6366F1']
      });
    } catch (e) {}
    setTimeout(() => {
      setDemoStep(3);
    }, 350);
  };

  const handleResetDemo = () => {
    setDemoStep(0);
    setSelectedGoal(null);
    setDemoEmail('');
    setDemoRating(null);
    setAiCustomQuestion(null);
  };

  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setAiCustomQuestion(`How would you rate the experience of ${promptInput.trim()}?`);
      setIsGenerating(false);
      setDemoStep(0);
      setSelectedGoal(null);
    }, 600);
  };

  const templateCards = [
    {
      id: 1,
      title: 'Lead Generation & Qualification',
      category: 'leads',
      desc: 'Capture qualified inbound leads and score intent automatically.',
      questions: 5,
      completionRate: '91%',
      badge: 'Popular',
    },
    {
      id: 2,
      title: 'Customer Satisfaction & NPS',
      category: 'feedback',
      desc: 'Gauge net promoter score with follow-up sentiment prompts.',
      questions: 4,
      completionRate: '94%',
      badge: 'Essential',
    },
    {
      id: 3,
      title: 'Product Feedback & Discovery',
      category: 'feedback',
      desc: 'Collect qualitative feature feedback and prioritization data.',
      questions: 6,
      completionRate: '88%',
      badge: 'AI Follow-up',
    },
    {
      id: 4,
      title: 'Executive Event Registration',
      category: 'events',
      desc: 'Seamless attendee RSVP, session choices, and calendar sync.',
      questions: 4,
      completionRate: '96%',
      badge: 'Instant Sync',
    },
    {
      id: 5,
      title: 'Software Engineer Job Application',
      category: 'hr',
      desc: 'Screen candidates with portfolio links, skill ratings, and CV.',
      questions: 7,
      completionRate: '86%',
      badge: 'Hiring',
    },
    {
      id: 6,
      title: 'Website UX & Bug Report',
      category: 'feedback',
      desc: 'Empower users to report issues with screenshot attachments.',
      questions: 5,
      completionRate: '92%',
      badge: 'Diagnostics',
    },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templateCards
    : templateCards.filter((t) => t.category === selectedCategory);

  const logos = [
    { name: 'HERMÈS', style: 'font-serif tracking-widest text-xl' },
    { name: 'Uber', style: 'font-sans font-black tracking-tight text-xl' },
    { name: 'airbnb', style: 'font-sans font-bold tracking-tight text-xl' },
    { name: 'Mailchimp', style: 'font-serif italic text-xl' },
    { name: 'Notion', style: 'font-sans font-bold text-xl' },
    { name: 'HubSpot', style: 'font-sans font-semibold text-xl' },
    { name: 'SmartBug.', style: 'font-sans font-bold text-xl' },
    { name: 'Canva', style: 'font-sans font-bold text-xl' },
    { name: 'Zapier', style: 'font-sans font-black text-xl text-orange-600' },
  ];

  // Official Wistia Video IDs
  const wistiaVideos = {
    ask: 'zki3yjc4q4',
    act: 't7cmlcvvv1',
    learn: '2xnbogakrp',
    pillar1: 'jmjt5sn622',
    pillar2: 'yinhk73d2e',
    pillar3: 'g8ze4tncn4',
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white font-sans overflow-x-hidden">
      {/* ────────────────────────────────────────────────────────
          1. HEADER & GLOBAL NAVIGATION
      ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-neutral-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-serif italic font-black text-xl shadow-xs"
              >
                t
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                typeform
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-600">
              <a href="#ask" className="hover:text-black transition-colors">
                Product
              </a>
              <a href="#growth-flow" className="hover:text-black transition-colors flex items-center gap-1.5">
                Growth Flow
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  New
                </span>
              </a>
              <a href="#research-flow" className="hover:text-black transition-colors flex items-center gap-1.5">
                Research Flow
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  New
                </span>
              </a>
              <a href="#templates" className="hover:text-black transition-colors">
                Templates
              </a>
              <Link
                href="/to/customer-feedback-survey"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Live Form Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link href="/forms" className="hover:text-black font-semibold text-neutral-800 transition-colors">
                Workspace
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/forms"
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/forms"
                className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md block"
              >
                Get started — it’s free
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          2. HERO SECTION — HEADLINE & LIVE FILLABLE FORM SHOWCASE
      ──────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden bg-gradient-to-b from-[#FDFDFD] via-neutral-50/50 to-white">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-tr from-amber-100/50 via-sky-100/40 to-violet-100/40 blur-3xl -z-10 pointer-events-none rounded-full animate-pulse-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI forms &amp; automation</span>
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              <span className="text-neutral-500 font-normal">Next Gen Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.08] mb-6"
            >
              Your favorite forms.
              <br />
              <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                Now with AI automation.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8"
            >
              Combine AI forms and automated workflows to drive revenue growth.
              Run in-depth research and manage the entire customer lifecycle. All in Typeform.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/forms"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-base transition-all shadow-md hover:shadow-lg"
                >
                  <span>Get started — it’s free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/to/customer-feedback-survey"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all shadow-md shadow-blue-500/20"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Fill Live Form Demo ↗</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Quick Guarantees */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> 3.5x higher completion rates
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Fully functional conversational form
              </span>
            </div>
          </div>

          {/* ── 3-TAB SHOWCASE WITH LIVE FILLABLE FORM & ANIMATIONS ── */}
          <div
            id="features-preview"
            className="max-w-5xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* View Mode Toggle Bar */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Try answering below or toggle to watch official video</span>
              </div>
              <div className="inline-flex p-1 rounded-xl bg-neutral-200/80 border border-neutral-300/80 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('interactive')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'interactive'
                      ? 'bg-white text-black shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fill Form Demo (Active)</span>
                </button>
                <button
                  onClick={() => setViewMode('video')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'video'
                      ? 'bg-white text-black shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-blue-600" />
                  <span>Official UI Video</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation Header with Animated Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-neutral-100/90 rounded-2xl border border-neutral-200 mb-6 shadow-inner">
              {/* Tab 1: ASK */}
              <button
                onClick={() => handleTabClick('ask')}
                className={`flex flex-col text-left p-4 rounded-xl transition-all relative overflow-hidden cursor-pointer ${
                  activeTab === 'ask'
                    ? 'bg-white text-black shadow-md border border-neutral-200/80'
                    : 'hover:bg-neutral-200/50 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-400">
                    ASK
                  </span>
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'ask' ? 'bg-black ring-4 ring-black/10' : 'bg-transparent'}`} />
                </div>
                <div className="font-bold text-base text-neutral-900">Intelligent Forms</div>
                <div className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  Build forms that adapt to every respondent and analyze data for rich insights.
                </div>
                {activeTab === 'ask' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100">
                    <div
                      className="h-full bg-black transition-all duration-75"
                      style={{ width: `${tabProgress}%` }}
                    />
                  </div>
                )}
              </button>

              {/* Tab 2: ACT */}
              <button
                onClick={() => handleTabClick('act')}
                className={`flex flex-col text-left p-4 rounded-xl transition-all relative overflow-hidden cursor-pointer ${
                  activeTab === 'act'
                    ? 'bg-white text-black shadow-md border border-neutral-200/80'
                    : 'hover:bg-neutral-200/50 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600">
                    ACT
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                    NEW
                  </span>
                </div>
                <div className="font-bold text-base text-neutral-900">Growth Flow</div>
                <div className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  Convert and keep customers with automated AI segmentation and follow-ups.
                </div>
                {activeTab === 'act' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-75"
                      style={{ width: `${tabProgress}%` }}
                    />
                  </div>
                )}
              </button>

              {/* Tab 3: LEARN */}
              <button
                onClick={() => handleTabClick('learn')}
                className={`flex flex-col text-left p-4 rounded-xl transition-all relative overflow-hidden cursor-pointer ${
                  activeTab === 'learn'
                    ? 'bg-white text-black shadow-md border border-neutral-200/80'
                    : 'hover:bg-neutral-200/50 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600">
                    LEARN
                  </span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full">
                    NEW
                  </span>
                </div>
                <div className="font-bold text-base text-neutral-900">Research Flow</div>
                <div className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  Make confident decisions fast with AI-moderated studies and automated reports.
                </div>
                {activeTab === 'learn' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100">
                    <div
                      className="h-full bg-blue-600 transition-all duration-75"
                      style={{ width: `${tabProgress}%` }}
                    />
                  </div>
                )}
              </button>
            </div>

            {/* Display Frame: Live Interactive Form or Video */}
            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-neutral-800 relative overflow-hidden min-h-[520px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-radial from-neutral-800/40 via-neutral-900 to-neutral-950 pointer-events-none" />

              {/* MODE: VIDEO IFRAME */}
              {viewMode === 'video' ? (
                <div className="relative z-10 w-full rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-16/10 border border-neutral-800 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`video-${activeTab}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full"
                    >
                      <iframe
                        src={`https://fast.wistia.net/embed/iframe/${wistiaVideos[activeTab]}?autoplay=1&muted=1&loop=1&controlsVisibleOnLoad=false&playbar=false&smallPlayButton=false`}
                        title={`Typeform ${activeTab} Product Animation`}
                        allow="autoplay; fullscreen"
                        loading="eager"
                        className="w-full h-full border-0 pointer-events-none"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                /* MODE: FULLY WORKING INTERACTIVE FORM FILLING */
                <AnimatePresence mode="wait">
                  {/* TAB 1: ASK INTELLIGENT FORMS (3-Step Fillable Form) */}
                  {activeTab === 'ask' && (
                    <motion.div
                      key="tab-ask"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative z-10 max-w-2xl mx-auto w-full py-2"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <span className="font-semibold text-emerald-400">Interactive Form Filling Demo</span>
                          <span className="text-neutral-600">•</span>
                          <span>Step {demoStep < 3 ? demoStep + 1 : 3} of 3</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleResetDemo}
                          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Start over
                        </motion.button>
                      </div>

                      {/* QUESTION 1: Multiple Choice */}
                      {demoStep === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                          <div className="text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider flex items-center gap-2">
                            <span className="text-amber-400 font-bold">1 →</span>
                            <span>Choose an option below</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white leading-snug">
                            {aiCustomQuestion || "What is your primary goal for creating forms today?"}
                          </h2>

                          <div className="space-y-3 mb-6">
                            {[
                              { key: 'A', text: 'Capture qualified leads & boost conversions' },
                              { key: 'B', text: 'Collect customer NPS & product feedback' },
                              { key: 'C', text: 'Conduct AI-moderated user research' },
                              { key: 'D', text: 'Streamline event or employee registration' },
                            ].map((opt) => (
                              <motion.button
                                key={opt.key}
                                whileHover={{ scale: 1.015, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelectGoal(opt.text)}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  selectedGoal === opt.text
                                    ? 'bg-white text-black border-white shadow-xl'
                                    : 'bg-neutral-800/80 border-neutral-700/80 hover:bg-neutral-800 hover:border-neutral-500 text-neutral-200'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                                    selectedGoal === opt.text
                                      ? 'bg-black text-white'
                                      : 'bg-neutral-700 text-neutral-300'
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <span className="text-sm font-medium">{opt.text}</span>
                                {selectedGoal === opt.text && (
                                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  </motion.span>
                                )}
                              </motion.button>
                            ))}
                          </div>

                          {/* AI Prompt Generator Tester */}
                          <form onSubmit={handleGeneratePrompt} className="mt-8 pt-6 border-t border-neutral-800">
                            <div className="text-xs text-neutral-400 mb-2 flex items-center gap-1.5">
                              <Bot className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                              <span>Test prompt-to-form builder:</span>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                                placeholder="e.g. Employee onboarding survey with feedback..."
                                className="flex-1 bg-neutral-800/90 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                              />
                              <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                type="submit"
                                disabled={isGenerating}
                                className="bg-white text-black font-semibold px-4 py-2 rounded-xl text-xs hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                              >
                                {isGenerating ? 'Generating...' : 'Build Form'}
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {/* QUESTION 2: Typeable Email Input */}
                      {demoStep === 1 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                          <div className="text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider flex items-center gap-2">
                            <span className="text-blue-400 font-bold">2 →</span>
                            <span>Type your answer</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-white leading-snug">
                            Great choice! What work email should we send results to?
                          </h2>
                          <p className="text-neutral-400 text-xs mb-6">
                            Notice how conversational forms focus on one question at a time to prevent cognitive fatigue.
                          </p>

                          <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="relative">
                              <input
                                ref={emailInputRef}
                                type="email"
                                value={demoEmail}
                                onChange={(e) => setDemoEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-neutral-800/90 border-b-2 border-neutral-600 focus:border-white px-4 py-3 text-lg text-white placeholder-neutral-500 outline-none transition-colors"
                              />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="bg-white text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                              >
                                <span>OK</span>
                                <Check className="w-4 h-4" />
                              </motion.button>
                              <span className="text-xs text-neutral-500 font-mono">press Enter ↵</span>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {/* QUESTION 3: Star Rating */}
                      {demoStep === 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                          <div className="text-neutral-400 text-xs font-mono mb-2 uppercase tracking-wider flex items-center gap-2">
                            <span className="text-amber-400 font-bold">3 →</span>
                            <span>Rate your experience</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-white leading-snug">
                            How would you rate conversational forms vs traditional static forms?
                          </h2>
                          <p className="text-neutral-400 text-xs mb-6">
                            Click any star from 1 to 5 to record your answer instantly.
                          </p>

                          <div className="flex items-center gap-3 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                whileHover={{ scale: 1.15, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSelectRating(star)}
                                className={`w-14 h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                  demoRating === star
                                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg'
                                    : 'border-neutral-700 bg-neutral-800/80 hover:border-neutral-500 text-neutral-300'
                                }`}
                              >
                                <Star className={`w-6 h-6 ${demoRating === star ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`} />
                                <span className="text-xs font-bold font-mono">{star}</span>
                              </motion.button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-neutral-500 max-w-xs">
                            <span>1 (Poor)</span>
                            <span>5 (Indispensable)</span>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: Success / Confetti Screen */}
                      {demoStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-center py-6"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30"
                          >
                            <CheckCircle2 className="w-8 h-8" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Form completed in 18 seconds!
                          </h3>
                          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
                            You experienced Typeform's one-question-at-a-time conversational engine:
                            <br />
                            <span className="text-neutral-300 mt-2 block">
                              Goal: <strong>{selectedGoal}</strong> • Email: <strong>{demoEmail || 'user@company.com'}</strong> • Rating: <strong>{demoRating}/5 stars</strong>
                            </span>
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleResetDemo}
                              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer"
                            >
                              Fill again
                            </motion.button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link
                                href="/to/customer-feedback-survey"
                                target="_blank"
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
                              >
                                <span>Try Full 6-Question Form</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Link
                                href="/forms"
                                className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-xs font-bold text-black block"
                              >
                                Create your own form →
                              </Link>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 2: ACT GROWTH FLOW */}
                  {activeTab === 'act' && (
                    <motion.div
                      key="tab-act"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative z-10 max-w-3xl mx-auto w-full py-4"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <Workflow className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span>Growth Flow Canvas — Interactive Automation Pipeline</span>
                        </div>
                        <span className="text-[11px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Status: Active
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveWorkflowNode(1)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                            activeWorkflowNode === 1
                              ? 'bg-neutral-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                              : 'bg-neutral-800/40 border-neutral-700/60 hover:border-neutral-600'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 mb-1 flex items-center justify-between">
                            <span>Step 1: Trigger</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <div className="text-sm font-bold text-white mb-1">Form Submitted</div>
                          <div className="text-xs text-neutral-400">Captures email, budget, intent</div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveWorkflowNode(2)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                            activeWorkflowNode === 2
                              ? 'bg-neutral-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                              : 'bg-neutral-800/40 border-neutral-700/60 hover:border-neutral-600'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 mb-1 flex items-center justify-between">
                            <span>Step 2: AI Enrich</span>
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          </div>
                          <div className="text-sm font-bold text-white mb-1">Lead Scoring &amp; Match</div>
                          <div className="text-xs text-neutral-400">92% B2B match rate auto-enriched</div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveWorkflowNode(3)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                            activeWorkflowNode === 3
                              ? 'bg-neutral-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                              : 'bg-neutral-800/40 border-neutral-700/60 hover:border-neutral-600'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400 mb-1 flex items-center justify-between">
                            <span>Step 3: Action</span>
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          </div>
                          <div className="text-sm font-bold text-white mb-1">VIP Calendly &amp; Slack</div>
                          <div className="text-xs text-neutral-400">Routes VIP leads to Account Exec</div>
                        </motion.div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeWorkflowNode}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-5"
                        >
                          {activeWorkflowNode === 1 && (
                            <div className="text-xs text-neutral-300 space-y-2">
                              <div className="font-semibold text-white text-sm flex items-center gap-2">
                                <span>Trigger: High-Value Inbound Lead Form</span>
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                                  Inbound Webhook Ready
                                </span>
                              </div>
                              <p className="text-neutral-400">
                                Respondent completes 4 questions in under 45 seconds. Embedded Calendly calendar and Stripe checkout ready.
                              </p>
                              <div className="flex gap-2 pt-2">
                                <span className="bg-neutral-700/80 px-2 py-1 rounded text-[11px] font-mono">Response: Validated</span>
                                <span className="bg-neutral-700/80 px-2 py-1 rounded text-[11px] font-mono">Latency: 120ms</span>
                              </div>
                            </div>
                          )}
                          {activeWorkflowNode === 2 && (
                            <div className="text-xs text-neutral-300 space-y-2">
                              <div className="font-semibold text-white text-sm flex items-center gap-2">
                                <span>AI Enrichment Engine</span>
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                                  Match Engine: 92% B2B
                                </span>
                              </div>
                              <p className="text-neutral-400">
                                Automatically pulls company size, domain revenue, tech stack, and LinkedIn profile from the email address alone.
                              </p>
                              <div className="flex gap-2 pt-2">
                                <span className="bg-amber-950 text-amber-300 px-2 py-1 rounded text-[11px] font-mono">Intent Score: 96 / 100</span>
                                <span className="bg-neutral-700/80 px-2 py-1 rounded text-[11px] font-mono">Segment: Enterprise Tier 1</span>
                              </div>
                            </div>
                          )}
                          {activeWorkflowNode === 3 && (
                            <div className="text-xs text-neutral-300 space-y-2">
                              <div className="font-semibold text-white text-sm flex items-center gap-2">
                                <span>Automated Multi-Channel Execution</span>
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                                  3 Targets Triggered
                                </span>
                              </div>
                              <p className="text-neutral-400">
                                Sends instant Slack alert to #enterprise-wins, schedules 15-min discovery call, and updates CRM deal stage in HubSpot.
                              </p>
                              <div className="flex gap-2 pt-2">
                                <span className="bg-emerald-950 text-emerald-300 px-2 py-1 rounded text-[11px] font-mono">Slack Alert: Sent</span>
                                <span className="bg-blue-950 text-blue-300 px-2 py-1 rounded text-[11px] font-mono">CRM Status: Synced</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* TAB 3: LEARN RESEARCH FLOW */}
                  {activeTab === 'learn' && (
                    <motion.div
                      key="tab-learn"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative z-10 max-w-2xl mx-auto w-full py-4"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                          <span>Research Flow — Live AI-Moderated Interview</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/80">
                          <Volume2 className="w-3.5 h-3.5 text-blue-400 mr-1" />
                          {[12, 22, 16, 26, 14, 20, 8].map((h, i) => (
                            <span
                              key={i}
                              className="w-1 bg-blue-400 rounded-full inline-block"
                              style={{
                                animation: `waveform 0.8s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.12}s`,
                                height: `${h}px`
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 mb-6 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
                            AI
                          </div>
                          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-tl-none p-3.5 text-neutral-200">
                            <p className="leading-relaxed">
                              "Thanks for sharing! You mentioned your team switched form tools last month. What was the exact moment you decided the old software wasn't working?"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-neutral-700/80 border border-neutral-600 rounded-2xl rounded-tr-none p-3.5 text-white max-w-md">
                            <p className="leading-relaxed">
                              "Our mobile completion rate dropped below 20%. The forms looked clunky and had 30 inputs on one page. People just bounced."
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            P
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
                            AI
                          </div>
                          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-tl-none p-3.5 text-neutral-200">
                            <p className="leading-relaxed">
                              "That makes total sense. When you tested one-question-at-a-time flows, did completion rebound?"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400">
                            Live Sentiment &amp; Synthesis
                          </div>
                          <div className="text-xs font-medium text-neutral-300">
                            Theme: Mobile Fatigue • Sentiment: High Urgency • Recommendation: Conversational Redesign
                          </div>
                        </div>
                        <span className="text-xs font-bold text-blue-300 bg-blue-900/60 px-2.5 py-1 rounded-lg">
                          Confidence 98%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. SOCIAL PROOF & INFINITE CONTINUOUS MARQUEE
      ──────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-neutral-200/80 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Join 150,000+ businesses driving revenue with Typeform
          </p>
        </div>

        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-marquee flex items-center gap-16 py-2 text-neutral-400">
            {[...logos, ...logos, ...logos].map((logo, idx) => (
              <span
                key={idx}
                className={`cursor-pointer hover:text-black transition-colors ${logo.style} shrink-0`}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-100">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="md:col-span-1 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
                  Customer Impact
                </span>
                <p className="text-sm font-semibold text-neutral-900 leading-snug">
                  "SmartBug Media increased sales leads by 40% with one form."
                </p>
              </div>
              <div className="mt-4 text-xs text-neutral-500">
                — SmartBug Marketing Case Study
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center flex flex-col justify-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-1">
                3.5x
              </div>
              <div className="text-xs text-neutral-600 font-medium">
                More data captured vs traditional static forms
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center flex flex-col justify-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-1">
                48M+
              </div>
              <div className="text-xs text-neutral-600 font-medium">
                Responses collected monthly across the globe
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center flex flex-col justify-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-1">
                85%+
              </div>
              <div className="text-xs text-neutral-600 font-medium">
                Average form completion rate with conversational flow
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. PILLAR 1: BUILD FORMS AT THE DROP OF A PROMPT
      ──────────────────────────────────────────────────────── */}
      <section id="ask" className="py-24 sm:py-32 bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 block">
                ASK • INTELLIGENT FORMS
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6">
                Build forms at the drop of a prompt
              </h2>
              <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">
                With over 48 million responses collected monthly, Typeform AI builds best-in-class forms proven to get 3.5x more data. Brand easily, customize everything.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/to/customer-feedback-survey"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>Test Live Form</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <span className="text-neutral-300">|</span>
                <Link
                  href="/forms"
                  className="inline-flex items-center gap-2 text-sm font-bold text-black hover:gap-3 transition-all"
                >
                  <span>Explore workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-black shadow-xl border border-neutral-200 aspect-video">
              <iframe
                src={`https://fast.wistia.net/embed/iframe/${wistiaVideos.pillar1}?autoplay=1&muted=1&loop=1&controlsVisibleOnLoad=false&playbar=false&smallPlayButton=false`}
                title="Typeform AI Prompt Builder Animation"
                allow="autoplay; fullscreen"
                loading="lazy"
                className="w-full h-full border-0 pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  High Response Rate
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Build forms people actually fill out with beautiful design and conversational logic that adapts to every response, doubling completion rates vs. traditional web forms.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center text-xs font-semibold text-black gap-1">
                <span>One question at a time focus</span>
                <Check className="w-4 h-4 text-emerald-600 ml-auto" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  Deeper Insights
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Get rich answers with video and audio responses, plus extra context from AI-generated follow-up questions that adapt dynamically as people complete your form.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center text-xs font-semibold text-black gap-1">
                <span>Adaptive intelligent branching</span>
                <Check className="w-4 h-4 text-emerald-600 ml-auto" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  Advanced Analytics
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Surface key trends automatically with real-time drop-off rates, conversion metrics, respondent sentiment scores, and comprehensive funnel analysis.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center text-xs font-semibold text-black gap-1">
                <span>Drop-off &amp; completion funnels</span>
                <Check className="w-4 h-4 text-emerald-600 ml-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. PILLAR 2: WHEN THE FORM ENDS, THE FLOW BEGINS
      ──────────────────────────────────────────────────────── */}
      <section id="growth-flow" className="py-24 sm:py-32 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-emerald-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 block flex items-center gap-2">
                <span>GROWTH FLOW</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  New
                </span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                When the form ends, the flow begins...
              </h2>
              <p className="text-lg text-neutral-400 font-normal leading-relaxed mb-6">
                Be proactive with customer data. Set up automations that convert and keep customers for you. As opportunities arise, Growth Flow steps in to enrich leads, create segments, and send personalized messages.
              </p>
              <Link
                href="/forms"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Explore Growth Flow</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-700 aspect-video">
              <iframe
                src={`https://fast.wistia.net/embed/iframe/${wistiaVideos.pillar2}?autoplay=1&muted=1&loop=1&controlsVisibleOnLoad=false&playbar=false&smallPlayButton=false`}
                title="Growth Flow Product Automation"
                allow="autoplay; fullscreen"
                loading="lazy"
                className="w-full h-full border-0 pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-neutral-800/80 border border-neutral-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Instant Lead Capture
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Close deals directly in your forms. Capture e-signatures, schedule meetings with Google Calendar and Calendly, and accept instant payments with Stripe and Paypal.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span>Integrated Calendly &amp; Stripe</span>
                <Check className="w-4 h-4 ml-auto" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-neutral-800/80 border border-neutral-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Data Enrichment
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Enrich data to complete customer profiles, with industry-leading match rates of up to 92% for B2B companies and 71% for B2C companies.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-700 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span>Up to 92% match rates</span>
                <Check className="w-4 h-4 ml-auto" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-neutral-800/80 border border-neutral-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Customer Engagement
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Follow up instantly across email, SMS, and your favorite tools. Trigger personalized workflows from any form submission or contact update.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-700 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <span>Slack, HubSpot, Zapier sync</span>
                <Check className="w-4 h-4 ml-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          6. PILLAR 3: RUN FAST RESEARCH, MODERATED BY AI
      ──────────────────────────────────────────────────────── */}
      <section id="research-flow" className="py-24 sm:py-32 bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block flex items-center gap-2">
                <span>RESEARCH FLOW</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                  New
                </span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-6">
                Run fast research, moderated by AI
              </h2>
              <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">
                Make data-backed business decisions with Research Flow. It builds your research study, conducts 1,000s of AI-moderated interviews at once, and analyzes the findings. Fast.
              </p>
              <Link
                href="/forms"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>Explore Research Flow</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-black shadow-xl border border-neutral-200 aspect-video">
              <iframe
                src={`https://fast.wistia.net/embed/iframe/${wistiaVideos.pillar3}?autoplay=1&muted=1&loop=1&controlsVisibleOnLoad=false&playbar=false&smallPlayButton=false`}
                title="Research Flow AI Moderator Animation"
                allow="autoplay; fullscreen"
                loading="lazy"
                className="w-full h-full border-0 pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  Fast Insights
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Get insights in hours, not weeks. AI handles recruiting, moderating, and synthesizing research studies from start to finish, so you uncover deep insights at light speed.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>Hours instead of weeks</span>
                <Check className="w-4 h-4 text-blue-600 ml-auto" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  Qualitative &amp; Quantitative
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Run AI-moderated text, video, and voice interviews at survey scale and in one platform. Capture tone, hesitation, and the reasoning behind every answer.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>Multi-modal voice &amp; video</span>
                <Check className="w-4 h-4 text-purple-600 ml-auto" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  Verified Panel Recruitment
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Recruit high-quality participants from over 100M+ vetted profiles worldwide with custom screener questions and automated fraud detection.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>100M+ verified participants</span>
                <Check className="w-4 h-4 text-cyan-600 ml-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          7. TEMPLATES SHOWCASE
      ──────────────────────────────────────────────────────── */}
      <section id="templates" className="py-24 sm:py-32 bg-white border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                PRE-BUILT GALLERY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Crafted templates for every moment
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              {[
                { id: 'all', label: 'All Templates' },
                { id: 'leads', label: 'Lead Generation' },
                { id: 'feedback', label: 'Feedback & NPS' },
                { id: 'events', label: 'Events & RSVP' },
                { id: 'hr', label: 'Hiring & HR' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <motion.div
                key={tpl.id}
                whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
                transition={{ duration: 0.25 }}
                className="group rounded-3xl border border-neutral-200/90 bg-[#FAFAFA] p-6 hover:bg-white hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                      {tpl.badge}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {tpl.completionRate} avg. completion
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-black">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                    {tpl.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">
                    {tpl.questions} Questions • Ready to publish
                  </span>
                  <Link
                    href={`/forms/new?template=${encodeURIComponent(tpl.title)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 group-hover:translate-x-0.5 transition-transform"
                  >
                    Use template <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          8. INTEGRATIONS
      ──────────────────────────────────────────────────────── */}
      <section id="integrations" className="py-24 sm:py-32 bg-[#FDFDFD] border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 block">
            ECOSYSTEM &amp; CONNECTIVITY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
            Integrate with your tech stack
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto mb-14 font-normal">
            Send responses instantly to your CRM, trigger team notifications in Slack, or sync live data to Google Sheets and Notion. No code needed.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { name: 'Google Sheets', cat: 'Spreadsheet sync', tag: 'Instant sync' },
              { name: 'Slack', cat: 'Channel alerts', tag: 'Real-time' },
              { name: 'HubSpot', cat: 'CRM contact sync', tag: 'Bi-directional' },
              { name: 'Salesforce', cat: 'Enterprise CRM', tag: 'Automated' },
              { name: 'Zapier', cat: '5,000+ app integrations', tag: 'Universal' },
              { name: 'Notion', cat: 'Database entries', tag: 'Rich blocks' },
              { name: 'Stripe', cat: 'Payments & checkout', tag: 'Direct pay' },
              { name: 'Calendly', cat: 'Meeting booking', tag: 'Embedded' },
              { name: 'Mailchimp', cat: 'Email newsletter sync', tag: 'Audiences' },
              { name: 'Webhooks', cat: 'Custom REST endpoints', tag: 'JSON raw' },
            ].map((tool, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, borderColor: '#171717' }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-800 text-xs mb-3">
                    {tool.name[0]}
                  </div>
                  <div className="font-bold text-sm text-neutral-900 mb-0.5">{tool.name}</div>
                  <div className="text-[11px] text-neutral-500">{tool.cat}</div>
                </div>
                <div className="mt-4 pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
                  {tool.tag}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          9. CLOSING CONVERSION BANNER (DARK HERO STYLE)
      ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-neutral-800/40 blur-3xl rounded-full pointer-events-none animate-pulse-slow" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ready in under 2 minutes</span>
          </motion.span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            AI forms and automation.
            <br />
            All in Typeform.
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Create your first form, experience the conversational layout, and start collecting higher quality data today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/forms"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-base transition-all shadow-lg hover:shadow-xl block"
              >
                Get started — it’s free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/to/customer-feedback-survey"
                target="_blank"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-base border border-neutral-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Fill Live Form Demo</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <div className="mt-8 text-xs text-neutral-500">
            Free forever plan available • No credit card required • GDPR &amp; HIPAA compliant
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          10. FOOTER
      ──────────────────────────────────────────────────────── */}
      <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 pt-16 pb-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</h3>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#ask" className="hover:text-white transition-colors">Intelligent Forms</a></li>
                <li><a href="#growth-flow" className="hover:text-white transition-colors">Growth Flow</a></li>
                <li><a href="#research-flow" className="hover:text-white transition-colors">Research Flow</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Form Templates</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Integrations</a></li>
                <li><Link href="/forms" className="hover:text-white transition-colors">Builder Workspace</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Templates</h3>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#templates" className="hover:text-white transition-colors">Quiz Templates</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Survey Templates</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Feedback Forms</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Registration Forms</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Order Forms</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Job Applications</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Integrations</h3>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#integrations" className="hover:text-white transition-colors">Google Sheets</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Slack Integration</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">HubSpot CRM</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Salesforce</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Zapier Automations</a></li>
                <li><a href="#integrations" className="hover:text-white transition-colors">Stripe Checkout</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Resources</h3>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#ask" className="hover:text-white transition-colors">AI Form Generator</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Response Rate Benchmarks</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Help Center &amp; Docs</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Community Forum</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Typeform Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Get to know us</h3>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#ask" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Security &amp; Compliance</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Privacy Notice</a></li>
                <li><a href="#ask" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-serif italic font-black text-sm">
                t
              </div>
              <span>© 2026 Typeform SL. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6 text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </span>
              <span className="text-neutral-500">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">English</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
