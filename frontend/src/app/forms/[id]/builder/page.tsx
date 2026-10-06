'use client';

import React, { useState, useEffect, use } from 'react';
import {
  Type,
  AlignLeft,
  ListOrdered,
  ChevronDown,
  Mail,
  Hash,
  ToggleLeft,
  Star,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  Settings,
  Sparkles,
  Loader2,
  X,
  Check,
  HelpCircle,
  Eye
} from 'lucide-react';
import {
  getForm,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions
} from '@/lib/api';
import { FormDetail, Question, QuestionType } from '@/lib/types';
import { useToast } from '@/components/Toast';

const QUESTION_TYPES: {
  type: QuestionType;
  label: string;
  icon: any;
  desc: string;
}[] = [
  { type: 'short_text', label: 'Short Text', icon: Type, desc: 'Single-line text answer' },
  { type: 'long_text', label: 'Long Text', icon: AlignLeft, desc: 'Detailed, multi-line paragraph' },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: ListOrdered, desc: 'Select one from custom options' },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, desc: 'Select from a dropdown menu' },
  { type: 'email', label: 'Email', icon: Mail, desc: 'Validated email input' },
  { type: 'number', label: 'Number', icon: Hash, desc: 'Numeric integers or decimals' },
  { type: 'yes_no', label: 'Yes / No', icon: ToggleLeft, desc: 'Quick binary decision' },
  { type: 'rating', label: 'Rating', icon: Star, desc: 'Star or numerical rating scale' },
];

export default function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const { toast } = useToast();

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Modal for adding question
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);

  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const loadFormData = async () => {
    try {
      setLoading(true);
      const data = await getForm(formId);
      setForm(data);
      if (data.questions.length > 0 && !selectedQuestionId) {
        setSelectedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      toast(err.message || 'Error loading form details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFormData();
  }, [formId]);

  const activeQuestion = form?.questions.find((q) => q.id === selectedQuestionId) || form?.questions[0];

  // Helper to parse JSON options safely
  const getOptions = (q?: Question): string[] => {
    if (!q || !q.options_json) return [];
    try {
      const parsed = JSON.parse(q.options_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Helper to parse properties
  const getProperties = (q?: Question): Record<string, any> => {
    if (!q || !q.properties_json) return {};
    try {
      return JSON.parse(q.properties_json);
    } catch {
      return {};
    }
  };

  // ---------------- QUESTION MUTATIONS ----------------

  const handleAddQuestion = async (type: QuestionType) => {
    if (!form) return;
    try {
      setSavingQuestion(true);
      let defaultTitle = 'Question title';
      let optionsJson = '[]';
      let propertiesJson = '{}';

      if (type === 'multiple_choice' || type === 'dropdown') {
        optionsJson = JSON.stringify(['Option 1', 'Option 2', 'Option 3']);
      } else if (type === 'rating') {
        propertiesJson = JSON.stringify({ rating_max: 5, shape: 'star' });
      }

      const created = await addQuestion(form.id, {
        type,
        title: defaultTitle,
        description: '',
        is_required: false,
        options_json: optionsJson,
        properties_json: propertiesJson,
      });

      setForm((prev) => {
        if (!prev) return prev;
        return { ...prev, questions: [...prev.questions, created] };
      });
      setSelectedQuestionId(created.id);
      setIsTypeModalOpen(false);
      toast('Question added', 'success');
    } catch (err: any) {
      toast(err.message || 'Error adding question', 'error');
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleUpdateActiveQuestion = async (updates: Partial<Question>) => {
    if (!activeQuestion || !form) return;
    try {
      const updated = await updateQuestion(form.id, activeQuestion.id, updates);
      setForm((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) => (q.id === updated.id ? updated : q)),
        };
      });
    } catch (err: any) {
      toast(err.message || 'Error updating question', 'error');
    }
  };

  const handleDeleteQuestion = async (e: React.MouseEvent, qId: string) => {
    e.stopPropagation();
    if (!form) return;
    if (form.questions.length <= 1) {
      toast('A form must have at least one question', 'error');
      return;
    }
    try {
      await deleteQuestion(form.id, qId);
      const remaining = form.questions.filter((q) => q.id !== qId);
      setForm((prev) => (prev ? { ...prev, questions: remaining } : prev));
      if (selectedQuestionId === qId) {
        setSelectedQuestionId(remaining[0]?.id || null);
      }
      toast('Question removed', 'info');
    } catch (err: any) {
      toast(err.message || 'Error deleting question', 'error');
    }
  };

  // Reordering (Drag and Drop / Move Up & Down)
  const handleMove = async (fromIdx: number, toIdx: number) => {
    if (!form || toIdx < 0 || toIdx >= form.questions.length) return;
    const newQuestions = [...form.questions];
    const [moved] = newQuestions.splice(fromIdx, 1);
    newQuestions.splice(toIdx, 0, moved);

    // Update order_indices
    const reorderPayload = newQuestions.map((q, idx) => ({
      id: q.id,
      order_index: idx,
    }));

    setForm({ ...form, questions: newQuestions });

    try {
      await reorderQuestions(form.id, reorderPayload);
    } catch (err: any) {
      toast('Error saving new question order', 'error');
      loadFormData();
    }
  };

  // Choice Option editing
  const handleUpdateOption = (index: number, value: string) => {
    if (!activeQuestion) return;
    const currentOptions = getOptions(activeQuestion);
    currentOptions[index] = value;
    handleUpdateActiveQuestion({ options_json: JSON.stringify(currentOptions) });
  };

  const handleAddOption = () => {
    if (!activeQuestion) return;
    const currentOptions = getOptions(activeQuestion);
    currentOptions.push(`Option ${currentOptions.length + 1}`);
    handleUpdateActiveQuestion({ options_json: JSON.stringify(currentOptions) });
  };

  const handleRemoveOption = (index: number) => {
    if (!activeQuestion) return;
    const currentOptions = getOptions(activeQuestion);
    if (currentOptions.length <= 1) {
      toast('At least one option is required', 'error');
      return;
    }
    currentOptions.splice(index, 1);
    handleUpdateActiveQuestion({ options_json: JSON.stringify(currentOptions) });
  };

  const getTypeIcon = (type: QuestionType) => {
    const item = QUESTION_TYPES.find((q) => q.type === type);
    const IconComponent = item ? item.icon : Type;
    return <IconComponent className="w-3.5 h-3.5 shrink-0" />;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
        <span className="text-sm">Loading builder...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ---------------- 1. LEFT SIDEBAR: QUESTIONS LIST ---------------- */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Questions ({form?.questions.length || 0})
          </span>
          <button
            onClick={() => setIsTypeModalOpen(true)}
            className="p-1 rounded-md text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Add question"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {form?.questions.map((q, idx) => {
            const isSelected = q.id === (activeQuestion?.id || '');
            return (
              <div
                key={q.id}
                draggable
                onDragStart={() => setDraggedIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedIdx !== null && draggedIdx !== idx) {
                    handleMove(draggedIdx, idx);
                  }
                  setDraggedIdx(null);
                }}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-medium shadow-2xs'
                    : 'bg-white hover:bg-neutral-50 border-transparent hover:border-neutral-200 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="cursor-grab text-neutral-300 hover:text-neutral-500">
                    <GripVertical className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 shrink-0">
                    {idx + 1}
                  </span>
                  <div
                    className={`p-1 rounded-md ${
                      isSelected ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {getTypeIcon(q.type)}
                  </div>
                  <span className="truncate max-w-[110px]">{q.title || 'Untitled question'}</span>
                </div>

                {/* Move & Delete controls */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, idx - 1);
                    }}
                    disabled={idx === 0}
                    className="p-0.5 rounded text-neutral-400 hover:text-black disabled:opacity-20"
                    title="Move up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, idx + 1);
                    }}
                    disabled={idx === (form?.questions.length || 1) - 1}
                    className="p-0.5 rounded text-neutral-400 hover:text-black disabled:opacity-20"
                    title="Move down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteQuestion(e, q.id)}
                    className="p-0.5 rounded text-neutral-400 hover:text-red-600"
                    title="Delete question"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Question Button in sidebar */}
        <div className="p-3 border-t border-neutral-100">
          <button
            onClick={() => setIsTypeModalOpen(true)}
            className="w-full py-2 px-3 border border-dashed border-neutral-300 hover:border-black rounded-lg text-xs font-medium text-neutral-600 hover:text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add question</span>
          </button>
        </div>
      </aside>

      {/* ---------------- 2. CENTER: LIVE WYSIWYG CANVAS ---------------- */}
      <main className="flex-1 bg-white overflow-y-auto flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {activeQuestion ? (
          <div className="w-full max-w-xl animate-in fade-in duration-200">
            {/* Question Index Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-blue-600 font-mono">
                {(form?.questions.findIndex((q) => q.id === activeQuestion.id) ?? 0) + 1}
                <span className="text-blue-400 ml-1">→</span>
              </span>
              {activeQuestion.is_required && (
                <span className="text-red-500 font-bold text-sm" title="Required">*</span>
              )}
            </div>

            {/* Editable Question Title */}
            <textarea
              rows={2}
              value={activeQuestion.title}
              onChange={(e) => handleUpdateActiveQuestion({ title: e.target.value })}
              placeholder="Type your question here..."
              className="w-full text-2xl sm:text-3xl font-medium text-neutral-900 bg-transparent border-none outline-none resize-none focus:ring-0 placeholder:text-neutral-300 leading-tight"
            />

            {/* Editable Description / Helper */}
            <input
              type="text"
              value={activeQuestion.description || ''}
              onChange={(e) => handleUpdateActiveQuestion({ description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full text-sm text-neutral-500 bg-transparent border-none outline-none focus:ring-0 placeholder:text-neutral-300 mt-1"
            />

            {/* Live Interactive Input Preview */}
            <div className="mt-8">
              {/* Short Text Preview */}
              {activeQuestion.type === 'short_text' && (
                <div>
                  <input
                    type="text"
                    disabled
                    placeholder="Type your answer here..."
                    className="w-full pb-2 text-xl border-b border-neutral-300 text-neutral-800 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-xs opacity-90 cursor-default">
                      <span>OK</span>
                      <Check className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-neutral-400">press Enter ↵</span>
                  </div>
                </div>
              )}

              {/* Long Text Preview */}
              {activeQuestion.type === 'long_text' && (
                <div>
                  <textarea
                    rows={3}
                    disabled
                    placeholder="Type your detailed answer here..."
                    className="w-full p-3 border border-neutral-300 rounded-xl text-neutral-800 placeholder:text-neutral-400 bg-neutral-50/50 resize-none"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-xs opacity-90 cursor-default">
                      <span>OK</span>
                      <Check className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-neutral-400">press Shift + Enter ↵ for newline</span>
                  </div>
                </div>
              )}

              {/* Multiple Choice Preview */}
              {activeQuestion.type === 'multiple_choice' && (
                <div className="space-y-2.5">
                  {getOptions(activeQuestion).map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    return (
                      <div
                        key={oIdx}
                        className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 transition-all cursor-default"
                      >
                        <span className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-600 font-mono text-xs flex items-center justify-center font-bold">
                          {letter}
                        </span>
                        <span className="text-sm text-neutral-800 font-medium">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Preview */}
              {activeQuestion.type === 'dropdown' && (
                <div className="relative">
                  <select
                    disabled
                    className="w-full p-3.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-700 appearance-none"
                  >
                    <option value="">Select an option...</option>
                    {getOptions(activeQuestion).map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Yes / No Preview */}
              {activeQuestion.type === 'yes_no' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-black transition-all cursor-default">
                    <span className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 font-mono text-xs flex items-center justify-center font-bold">
                      Y
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">Yes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-black transition-all cursor-default">
                    <span className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 font-mono text-xs flex items-center justify-center font-bold">
                      N
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">No</span>
                  </div>
                </div>
              )}

              {/* Rating Scale Preview */}
              {activeQuestion.type === 'rating' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-12 h-12 rounded-xl border border-neutral-200 flex flex-col items-center justify-center gap-1 hover:border-black transition-all cursor-default"
                      >
                        <Star className="w-4 h-4 text-neutral-400" />
                        <span className="text-[10px] text-neutral-400 font-mono font-bold">{star}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 max-w-[270px]">
                    <span>1 (Poor)</span>
                    <span>5 (Excellent)</span>
                  </div>
                </div>
              )}

              {/* Email Preview */}
              {activeQuestion.type === 'email' && (
                <div>
                  <input
                    type="email"
                    disabled
                    placeholder="name@example.com"
                    className="w-full pb-2 text-xl border-b border-neutral-300 text-neutral-800 placeholder:text-neutral-400 bg-transparent"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-xs opacity-90 cursor-default">
                      <span>OK</span>
                      <Check className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-neutral-400">press Enter ↵</span>
                  </div>
                </div>
              )}

              {/* Number Preview */}
              {activeQuestion.type === 'number' && (
                <div>
                  <input
                    type="number"
                    disabled
                    placeholder="0"
                    className="w-full pb-2 text-xl border-b border-neutral-300 text-neutral-800 placeholder:text-neutral-400 bg-transparent"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-xs opacity-90 cursor-default">
                      <span>OK</span>
                      <Check className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-neutral-400">press Enter ↵</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-neutral-400">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p className="text-sm">Select or add a question to start editing</p>
          </div>
        )}
      </main>

      {/* ---------------- 3. RIGHT INSPECTOR: QUESTION SETTINGS ---------------- */}
      <aside className="w-72 bg-white border-l border-neutral-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-3.5 border-b border-neutral-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-neutral-500" />
          <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            Question Settings
          </span>
        </div>

        {activeQuestion ? (
          <div className="p-4 space-y-6">
            {/* Question Type Switcher */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Question Type
              </label>
              <select
                value={activeQuestion.type}
                onChange={(e) =>
                  handleUpdateActiveQuestion({ type: e.target.value as QuestionType })
                }
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div>
                <span className="text-xs font-semibold text-neutral-800 block">Required</span>
                <span className="text-[11px] text-neutral-400">Cannot skip without answering</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleUpdateActiveQuestion({ is_required: !activeQuestion.is_required })
                }
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  activeQuestion.is_required ? 'bg-blue-600 justify-end' : 'bg-neutral-200 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Choices Manager for Multiple Choice & Dropdown */}
            {(activeQuestion.type === 'multiple_choice' || activeQuestion.type === 'dropdown') && (
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800">Choices</span>
                  <button
                    onClick={handleAddOption}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add choice</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {getOptions(activeQuestion).map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1.5">
                      <span className="text-[11px] text-neutral-400 font-mono w-4">
                        {String.fromCharCode(65 + cIdx)}.
                      </span>
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) => handleUpdateOption(cIdx, e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <button
                        onClick={() => handleRemoveOption(cIdx)}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                        title="Remove choice"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Config (1-5 vs 1-10) */}
            {activeQuestion.type === 'rating' && (
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <span className="text-xs font-semibold text-neutral-800 block">Rating Scale</span>
                <div className="flex items-center gap-2">
                  {[5, 10].map((step) => {
                    const props = getProperties(activeQuestion);
                    const currentStep = props.rating_max || 5;
                    const isSelected = currentStep === step;
                    return (
                      <button
                        key={step}
                        onClick={() =>
                          handleUpdateActiveQuestion({
                            properties_json: JSON.stringify({ ...props, rating_max: step }),
                          })
                        }
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        1 to {step}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-xs text-neutral-400 italic">No question selected</div>
        )}
      </aside>

      {/* ---------------- QUESTION TYPE PICKER MODAL ---------------- */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Add a question</h3>
                <p className="text-xs text-neutral-500">
                  Select a question type to add to your form
                </p>
              </div>
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 max-h-[60vh] overflow-y-auto">
              {QUESTION_TYPES.map((t) => {
                const IconComp = t.icon;
                return (
                  <button
                    key={t.type}
                    disabled={savingQuestion}
                    onClick={() => handleAddQuestion(t.type)}
                    className="p-3.5 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50/70 transition-all text-left flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors text-neutral-700 shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{t.label}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{t.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
