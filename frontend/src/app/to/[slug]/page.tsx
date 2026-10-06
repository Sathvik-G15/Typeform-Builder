'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  Sparkles,
  Star,
  Lock,
  ArrowRight
} from 'lucide-react';
import { getPublicForm, submitPublicResponse } from '@/lib/api';
import { PublicForm, PublicQuestion } from '@/lib/types';

export default function RespondentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [form, setForm] = useState<PublicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Flow State
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Answers State: question_id -> string value
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Validation / Error shake state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Timing
  const startTimeRef = useRef<number>(Date.now());

  // Input auto-focus reference
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Load Form
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getPublicForm(slug);
        setForm(data);

        // Check if welcome screen is enabled
        let welcome = { enabled: false };
        try {
          welcome = JSON.parse(data.welcome_screen_json);
        } catch {}
        if (!welcome.enabled) {
          setStarted(true);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Form not found or unavailable');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const questions = form?.questions || [];
  const currentQuestion: PublicQuestion | undefined = questions[currentIndex];

  // Helper options
  const getOptions = (q?: PublicQuestion): string[] => {
    if (!q || !q.options_json) return [];
    try {
      const p = JSON.parse(q.options_json);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  };

  const getProperties = (q?: PublicQuestion): Record<string, any> => {
    if (!q || !q.properties_json) return {};
    try {
      return JSON.parse(q.properties_json);
    } catch {
      return {};
    }
  };

  // Auto-focus input on change
  useEffect(() => {
    if (started && !submitted) {
      setValidationError(null);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, started, submitted]);

  // Validation function
  const validateCurrent = (): boolean => {
    if (!currentQuestion) return true;
    const val = (answers[currentQuestion.id] || '').trim();

    if (currentQuestion.is_required && !val) {
      setValidationError('Please fill this in');
      setShakeKey((k) => k + 1);
      return false;
    }

    if (currentQuestion.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setValidationError('Please enter a valid email address');
        setShakeKey((k) => k + 1);
        return false;
      }
    }

    if (currentQuestion.type === 'number' && val) {
      if (isNaN(Number(val))) {
        setValidationError('Please enter a valid number');
        setShakeKey((k) => k + 1);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  // Advance Forward
  const handleNext = async () => {
    if (!validateCurrent()) return;

    if (currentIndex < questions.length - 1) {
      setDirection('forward');
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question reached: submit form
      await handleSubmitForm();
    }
  };

  // Move Backward
  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('backward');
      setValidationError(null);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit form handler
  const handleSubmitForm = async () => {
    if (!form) return;
    try {
      setSubmitting(true);
      const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const submissionAnswers = Object.entries(answers).map(([qId, val]) => ({
        question_id: qId,
        value: val,
      }));

      await submitPublicResponse(form.slug, {
        time_spent_seconds: timeSpent,
        answers: submissionAnswers,
        metadata_json: JSON.stringify({ userAgent: navigator.userAgent }),
      });

      setSubmitted(true);

      // Trigger signature celebratory confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0445FE', '#10B981', '#F59E0B', '#EC4899', '#6366F1'],
      });
    } catch (err: any) {
      setValidationError(err.message || 'Error submitting response. Please try again.');
      setShakeKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-advance helper for choice/rating/yes-no selections
  const handleSelectOptionAndAdvance = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    setValidationError(null);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setDirection('forward');
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleSubmitForm();
      }
    }, 280);
  };

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (submitted || submitting) return;

      // Start screen enter
      if (!started) {
        if (e.key === 'Enter') {
          e.preventDefault();
          setStarted(true);
          startTimeRef.current = Date.now();
        }
        return;
      }

      // If active question is long_text, Enter with shift is newline; Enter alone advances
      if (currentQuestion?.type === 'long_text') {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      // Enter key advances
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Arrow Up / Down navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Multiple choice keyboard shortcuts (A, B, C...)
      if (currentQuestion?.type === 'multiple_choice') {
        const opts = getOptions(currentQuestion);
        const char = e.key.toUpperCase();
        const code = char.charCodeAt(0) - 65; // A -> 0, B -> 1
        if (code >= 0 && code < opts.length) {
          e.preventDefault();
          handleSelectOptionAndAdvance(currentQuestion.id, opts[code]);
          return;
        }
      }

      // Yes / No keyboard shortcuts (Y or N)
      if (currentQuestion?.type === 'yes_no') {
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleSelectOptionAndAdvance(currentQuestion.id, 'Yes');
          return;
        }
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          handleSelectOptionAndAdvance(currentQuestion.id, 'No');
          return;
        }
      }

      // Rating keyboard shortcuts (1, 2, 3, 4, 5...)
      if (currentQuestion?.type === 'rating') {
        const num = parseInt(e.key, 10);
        const max = getProperties(currentQuestion).rating_max || 5;
        if (!isNaN(num) && num >= 1 && num <= max) {
          e.preventDefault();
          handleSelectOptionAndAdvance(currentQuestion.id, num.toString());
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, submitted, submitting, currentIndex, currentQuestion, answers]);

  // Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-neutral-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-600" />
        <span className="text-sm font-medium">Loading form...</span>
      </div>
    );
  }

  // Error / Draft Protection Screen
  if (errorMsg || !form) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-500">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Form Unavailable</h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          {errorMsg || 'This form is either private, in draft status, or does not exist.'}
        </p>
      </div>
    );
  }

  // Progress percentage
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  // Thank You Screen Info
  let thankYouInfo = {
    title: 'Thank you!',
    description: 'Your response has been submitted successfully.',
    buttonText: 'Create your own form',
  };
  try {
    thankYouInfo = JSON.parse(form.thank_you_screen_json);
  } catch {}

  // Welcome Screen Info
  let welcomeInfo = {
    title: form.title,
    description: form.description || 'Welcome! Please take a moment to answer this form.',
    buttonText: 'Start',
  };
  try {
    welcomeInfo = { ...welcomeInfo, ...JSON.parse(form.welcome_screen_json) };
  } catch {}

  return (
    <div className="h-screen w-screen bg-[#FDFDFD] text-neutral-900 flex flex-col justify-between overflow-hidden relative">
      {/* Top Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-100 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${submitted ? 100 : progressPercent}%` }}
        />
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* ---------------- 1. WELCOME SCREEN ---------------- */}
        {!started && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="max-w-xl w-full text-left space-y-5"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
              {welcomeInfo.title}
            </h1>
            {welcomeInfo.description && (
              <p className="text-base sm:text-lg text-neutral-500 font-normal leading-relaxed">
                {welcomeInfo.description}
              </p>
            )}

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  setStarted(true);
                  startTimeRef.current = Date.now();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{welcomeInfo.buttonText || 'Start'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-400 font-mono">press Enter ↵</span>
            </div>
          </motion.div>
        )}

        {/* ---------------- 2. QUESTION CAROUSEL ---------------- */}
        {started && !submitted && currentQuestion && (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              initial={{
                opacity: 0,
                y: direction === 'forward' ? 40 : -40,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: direction === 'forward' ? -40 : 40,
              }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="max-w-xl w-full space-y-6"
            >
              {/* Question Number & Title Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-600 font-mono">
                  <span>{currentIndex + 1}</span>
                  <span>→</span>
                  {currentQuestion.is_required && (
                    <span className="text-red-500 font-bold" title="Required field">*</span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 leading-snug">
                  {currentQuestion.title}
                </h2>

                {currentQuestion.description && (
                  <p className="text-sm text-neutral-500 font-normal">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {/* Input Area with Shake on Validation Error */}
              <motion.div
                key={shakeKey}
                animate={
                  validationError
                    ? { x: [-12, 12, -8, 8, -4, 4, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Short Text */}
                {currentQuestion.type === 'short_text' && (
                  <div className="space-y-3">
                    <input
                      ref={inputRef as any}
                      type="text"
                      autoFocus
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
                      }
                      className="w-full pb-2 text-xl sm:text-2xl border-b-2 border-neutral-300 focus:border-blue-600 text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none transition-colors"
                    />
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span>{currentIndex === questions.length - 1 ? 'Submit' : 'OK'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-400 font-mono">press Enter ↵</span>
                    </div>
                  </div>
                )}

                {/* Long Text */}
                {currentQuestion.type === 'long_text' && (
                  <div className="space-y-3">
                    <textarea
                      ref={inputRef as any}
                      rows={4}
                      autoFocus
                      placeholder="Type your detailed answer here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
                      }
                      className="w-full p-4 border-2 border-neutral-200 focus:border-blue-600 rounded-2xl text-base text-neutral-900 placeholder:text-neutral-300 bg-white outline-none transition-colors resize-none shadow-2xs"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span>{currentIndex === questions.length - 1 ? 'Submit' : 'OK'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-400 font-mono">
                        press Shift + Enter ↵ for newline
                      </span>
                    </div>
                  </div>
                )}

                {/* Multiple Choice */}
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-2.5">
                    {getOptions(currentQuestion).map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = answers[currentQuestion.id] === opt;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOptionAndAdvance(currentQuestion.id, opt)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                              : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-md border text-xs font-mono font-bold flex items-center justify-center ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="text-sm sm:text-base font-medium">{opt}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Dropdown */}
                {currentQuestion.type === 'dropdown' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => {
                          setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
                          setValidationError(null);
                        }}
                        className="w-full p-4 bg-white border-2 border-neutral-200 focus:border-blue-600 rounded-xl text-base text-neutral-900 appearance-none outline-none shadow-2xs"
                      >
                        <option value="">Select an option...</option>
                        {getOptions(currentQuestion).map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span>{currentIndex === questions.length - 1 ? 'Submit' : 'OK'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-400 font-mono">press Enter ↵</span>
                    </div>
                  </div>
                )}

                {/* Yes / No */}
                {currentQuestion.type === 'yes_no' && (
                  <div className="grid grid-cols-2 gap-3.5">
                    {['Yes', 'No'].map((val) => {
                      const keyLetter = val === 'Yes' ? 'Y' : 'N';
                      const isSelected = answers[currentQuestion.id] === val;
                      return (
                        <div
                          key={val}
                          onClick={() => handleSelectOptionAndAdvance(currentQuestion.id, val)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                              : 'border-neutral-200 hover:border-black bg-white text-neutral-900'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-md border text-xs font-mono font-bold flex items-center justify-center ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                              }`}
                            >
                              {keyLetter}
                            </span>
                            <span className="text-base font-semibold">{val}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rating Scale */}
                {currentQuestion.type === 'rating' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {Array.from(
                        { length: getProperties(currentQuestion).rating_max || 5 },
                        (_, i) => i + 1
                      ).map((score) => {
                        const isSelected = answers[currentQuestion.id] === score.toString();
                        return (
                          <div
                            key={score}
                            onClick={() =>
                              handleSelectOptionAndAdvance(currentQuestion.id, score.toString())
                            }
                            className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                                : 'border-neutral-200 hover:border-black bg-white text-neutral-600'
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isSelected ? 'text-blue-600 fill-blue-600' : 'text-neutral-400'
                              }`}
                            />
                            <span className="text-xs font-mono font-bold">{score}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between text-xs text-neutral-400 max-w-xs">
                      <span>1 (Poor)</span>
                      <span>{getProperties(currentQuestion).rating_max || 5} (Excellent)</span>
                    </div>
                  </div>
                )}

                {/* Email */}
                {currentQuestion.type === 'email' && (
                  <div className="space-y-3">
                    <input
                      ref={inputRef as any}
                      type="email"
                      autoFocus
                      placeholder="name@example.com"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
                      }
                      className="w-full pb-2 text-xl sm:text-2xl border-b-2 border-neutral-300 focus:border-blue-600 text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none transition-colors"
                    />
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span>{currentIndex === questions.length - 1 ? 'Submit' : 'OK'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-400 font-mono">press Enter ↵</span>
                    </div>
                  </div>
                )}

                {/* Number */}
                {currentQuestion.type === 'number' && (
                  <div className="space-y-3">
                    <input
                      ref={inputRef as any}
                      type="number"
                      autoFocus
                      placeholder="0"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) =>
                        setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
                      }
                      className="w-full pb-2 text-xl sm:text-2xl border-b-2 border-neutral-300 focus:border-blue-600 text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none transition-colors"
                    />
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span>{currentIndex === questions.length - 1 ? 'Submit' : 'OK'}</span>
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-400 font-mono">press Enter ↵</span>
                    </div>
                  </div>
                )}

                {/* Validation Error Banner */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationError}</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ---------------- 3. SUBMITTED / THANK YOU SCREEN ---------------- */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {thankYouInfo.title || 'Thank you!'}
            </h2>

            <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {thankYouInfo.description ||
                'Your response has been submitted successfully and recorded.'}
            </p>

            <div className="pt-4">
              <a
                href="/forms"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                <span>{thankYouInfo.buttonText || 'Create your own form'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* ---------------- FOOTER CONTROLS ---------------- */}
      <footer className="h-16 px-6 flex items-center justify-between border-t border-neutral-100 bg-white/70 backdrop-blur-xs z-20">
        {/* Branding */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="font-serif italic font-bold text-neutral-900">t</span>
          <span>Powered by <strong>Typeform</strong></span>
        </div>

        {/* Up / Down Navigation Chevrons */}
        {started && !submitted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
              {currentIndex + 1} of {questions.length}
            </span>

            <div className="flex items-center rounded-xl bg-neutral-100 p-0.5 border border-neutral-200">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-lg text-neutral-700 hover:text-black hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
                title="Previous question (Arrow Up)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={submitting}
                className="p-1.5 rounded-lg text-neutral-700 hover:text-black hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
                title="Next question (Arrow Down / Enter)"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
