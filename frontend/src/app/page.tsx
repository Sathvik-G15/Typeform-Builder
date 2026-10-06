'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Globe2
} from 'lucide-react';

export default function TypeformLandingPage() {
  // Interactive mini-demo state inside hero
  const [heroStep, setHeroStep] = useState(0);
  const [heroAnswer, setHeroAnswer] = useState<string | null>(null);

  const heroOptions = [
    { key: 'A', text: 'Boost conversion & lead capture' },
    { key: 'B', text: 'Collect high-quality user feedback' },
    { key: 'C', text: 'Conduct product & customer research' },
    { key: 'D', text: 'Streamline team registrations' },
  ];

  const handleHeroSelect = (text: string) => {
    setHeroAnswer(text);
    setTimeout(() => {
      setHeroStep(1);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* ---------------- 1. GLOBAL NAVIGATION ---------------- */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-serif italic font-black text-xl transition-transform group-hover:scale-105">
                t
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                typeform
              </span>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
              <a href="#features" className="hover:text-black transition-colors">
                Product
              </a>
              <a href="#templates" className="hover:text-black transition-colors">
                Templates
              </a>
              <a href="#analytics" className="hover:text-black transition-colors">
                Analytics
              </a>
              <Link href="/forms" className="hover:text-black transition-colors">
                Workspace
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/forms"
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/forms"
              className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow-sm"
            >
              Get started — free
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- 2. HERO SECTION ---------------- */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-100/50 via-indigo-100/30 to-rose-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-neutral-100/90 border border-neutral-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>The conversational form builder</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
                There's a better <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-500">
                  way to ask.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                You don't want to create a boring form. And people don't want to fill one out.
                Create thoughtful, conversational forms and surveys that people actually enjoy answering.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/forms"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-7 py-3.5 rounded-xl text-base font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <span>Create your first Typeform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/to/customer-feedback-survey"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 px-6 py-3.5 rounded-xl text-base font-semibold transition-all shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Try respondent demo</span>
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center lg:justify-start gap-5 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  Free forever plan
                </span>
                <span className="flex items-center gap-1.5 hidden sm:inline-flex">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  Full keyboard navigation
                </span>
              </div>
            </div>

            {/* Right Interactive Mini Typeform Widget */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl p-7 relative transition-all">
                {/* Mini Window Controls */}
                <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    interactive live preview
                  </span>
                </div>

                {heroStep === 0 ? (
                  <div className="py-6 space-y-5 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-blue-600">1 →</span>
                      <h3 className="text-xl font-bold text-neutral-900 leading-snug">
                        What will you use your next form for?
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Select one option below to see the interactive flow.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {heroOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleHeroSelect(opt.text)}
                          className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                            heroAnswer === opt.text
                              ? 'border-blue-600 bg-blue-50/60 text-blue-900'
                              : 'border-neutral-200 hover:border-black bg-white text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded border text-[11px] font-mono font-bold flex items-center justify-center ${
                                heroAnswer === opt.text
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="text-xs font-medium">{opt.text}</span>
                          </div>
                          {heroAnswer === opt.text && (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                      <span>press key A, B, C or click</span>
                      <span>1 of 2</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-neutral-900">
                        That was smooth, wasn't it?
                      </h4>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                        Your respondents get this exact polished, conversational experience every time.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <Link
                        href="/forms"
                        className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
                      >
                        Start building now
                      </Link>
                      <button
                        onClick={() => {
                          setHeroStep(0);
                          setHeroAnswer(null);
                        }}
                        className="text-xs text-neutral-500 hover:text-black underline"
                      >
                        Reset preview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. BRAND LOGOS (SOCIAL PROOF) ---------------- */}
      <section className="py-12 border-y border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-8">
            Trusted by modern leaders and 150,000+ top companies worldwide
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-serif font-black tracking-widest text-lg text-neutral-800">
              HERMÈS
            </span>
            <span className="font-sans font-black tracking-tight text-xl text-neutral-800">
              Uber
            </span>
            <span className="font-sans font-extrabold tracking-tight text-xl text-neutral-800">
              airbnb
            </span>
            <span className="font-serif font-bold italic text-lg text-neutral-800">
              Mailchimp
            </span>
            <span className="font-mono font-bold tracking-tighter text-lg text-neutral-800">
              Notion
            </span>
            <span className="font-sans font-bold text-lg text-neutral-800">
              HubSpot
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 4. SIGNATURE FEATURES SECTION ---------------- */}
      <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-24">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              <Zap className="w-3.5 h-3.5" />
              <span>One Question at a Time</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-snug">
              Keep respondents immersed and eliminate form fatigue.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Traditional multi-field web forms overwhelm users with endless walls of inputs.
              Typeform displays questions one at a time with smooth spring animations, driving completion rates up to 3.5x higher.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full keyboard navigation (Enter, arrow keys, letter shortcuts)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Auto-advances smoothly on single-choice answers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Responsive on all screens (desktop, tablet, mobile)</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-gradient-to-tr from-neutral-100 to-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xl">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 font-mono">
                  <span>3 →</span>
                  <span className="text-neutral-900 font-semibold text-sm">
                    Would you recommend us to a colleague?
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border-2 border-blue-600 bg-blue-50/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        Y
                      </span>
                      <span className="text-xs font-bold text-neutral-900">Yes</span>
                    </div>
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="p-3 rounded-xl border border-neutral-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-neutral-100 text-neutral-600 font-mono text-[10px] font-bold flex items-center justify-center">
                      N
                    </span>
                    <span className="text-xs font-medium text-neutral-700">No</span>
                  </div>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono pt-1">
                  key pressed: 'Y' • auto-advancing in 280ms...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
              <Sliders className="w-3.5 h-3.5" />
              <span>3-Pane Drag-and-Drop Builder</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-snug">
              Intuitive drag & drop design with instant live canvas preview.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Design your form effortlessly. Add, reorder, duplicate, and configure question settings while watching changes reflect instantly on the live WYSIWYG canvas.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>8 specialized question types (Rating, Yes/No, Dropdown, Text, Email)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live inline editing of question titles and descriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-click publish with instant shareable links & iframe embeds</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="bg-gradient-to-tr from-neutral-100 to-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xl">
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-neutral-900">Form Builder</span>
                  </div>
                  <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-600 font-medium">
                    Auto-saved
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-blue-300 bg-blue-50/50 flex items-center justify-between text-xs font-medium">
                    <span className="text-blue-900">1. Overall satisfaction (Rating)</span>
                    <span className="text-[10px] text-blue-600 font-mono">Required</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-white flex items-center justify-between text-xs text-neutral-700">
                    <span>2. Most relied feature (Choice)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">4 options</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-neutral-200 bg-white flex items-center justify-between text-xs text-neutral-700">
                    <span>3. Improvement suggestions (Long Text)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Optional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Analytics */}
        <div id="analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Real-Time Insights & Analytics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-snug">
              Turn submissions into actionable decisions in seconds.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Track responses as they arrive. View completion rates, question-by-question breakdown charts, average rating scores, and export everything into Excel or Google Sheets with one click.
            </p>
            <ul className="space-y-2 pt-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live KPI metrics: Submissions, Completion Rate, Average Duration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated percentage distribution bars for choice questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct CSV download with column mappings</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-gradient-to-tr from-neutral-100 to-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xl">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-md space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center pb-3 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                      Responses
                    </span>
                    <div className="text-lg font-bold font-mono text-neutral-900">20</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                      Completion
                    </span>
                    <div className="text-lg font-bold font-mono text-neutral-900">100%</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                      Avg Time
                    </span>
                    <div className="text-lg font-bold font-mono text-neutral-900">48s</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium text-neutral-700">
                    <span>Real-time Analytics Dashboard</span>
                    <span className="font-mono text-neutral-500">58%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '58%' }} />
                  </div>

                  <div className="flex justify-between font-medium text-neutral-700 pt-1">
                    <span>Automated Reporting</span>
                    <span className="font-mono text-neutral-500">25%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. TEMPLATES SHOWCASE ---------------- */}
      <section id="templates" className="py-20 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Popular templates to get started fast
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Ready-made conversational flows crafted for maximum engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/to/customer-feedback-survey"
              className="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-black hover:shadow-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                Customer Feedback & NPS
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Capture honest feedback, satisfaction ratings, and net promoter scores.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>6 questions • 12 submissions</span>
                <span className="text-blue-600 flex items-center gap-1">
                  Try live <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/to/senior-fullstack-engineer"
              className="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-black hover:shadow-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                Developer Job Application
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Screen talent seamlessly with question-by-question candidate applications.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>5 questions • 8 submissions</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  Try live <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/forms"
              className="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-black hover:shadow-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 group-hover:text-purple-600 transition-colors">
                Custom Blank Form
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Start with a blank canvas and customize every question, choice, and screen.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>All 8 question types</span>
                <span className="text-purple-600 flex items-center gap-1">
                  Create now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 6. BOTTOM CALL TO ACTION ---------------- */}
      <section className="py-20 bg-neutral-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-serif italic font-black text-2xl mx-auto">
            t
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Make forms people love filling out.
          </h2>
          <p className="text-neutral-400 text-base max-w-lg mx-auto">
            Get started in seconds. No coding or credit card required.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/forms"
              className="bg-white hover:bg-neutral-100 text-neutral-900 px-8 py-4 rounded-xl text-base font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Create your free form now
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 7. FOOTER ---------------- */}
      <footer className="bg-white border-t border-neutral-200 py-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-serif italic font-black text-sm">
                t
              </div>
              <span className="font-bold text-neutral-900 text-sm">typeform</span>
            </div>
            <p className="text-neutral-500 max-w-xs">
              A conversational form builder designed for higher completion rates and better respondent engagement.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/forms" className="hover:text-black">
                  Form Builder
                </Link>
              </li>
              <li>
                <Link href="/forms" className="hover:text-black">
                  Surveys & Polls
                </Link>
              </li>
              <li>
                <Link href="/forms" className="hover:text-black">
                  Analytics & Reports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Solutions
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/to/customer-feedback-survey" className="hover:text-black">
                  Customer Feedback
                </Link>
              </li>
              <li>
                <Link href="/to/senior-fullstack-engineer" className="hover:text-black">
                  Lead Generation
                </Link>
              </li>
              <li>
                <Link href="/forms" className="hover:text-black">
                  Human Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="http://localhost:8000/docs" target="_blank" className="hover:text-black">
                  API Docs (Swagger)
                </a>
              </li>
              <li>
                <Link href="/forms" className="hover:text-black">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/forms" className="hover:text-black">
                  Workspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© 2026 Typeform Clone Platform. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-black cursor-pointer">Privacy Policy</span>
            <span className="hover:text-black cursor-pointer">Terms of Service</span>
            <span className="hover:text-black cursor-pointer">Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
