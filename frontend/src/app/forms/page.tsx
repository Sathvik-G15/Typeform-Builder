'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileText,
  Clock
} from 'lucide-react';
import { getForms, createForm, duplicateForm, deleteForm } from '@/lib/api';
import { FormListItem } from '@/lib/types';
import { useToast } from '@/components/Toast';

export default function FormsDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Active Menu ID for 3-dots
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const loadForms = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const data = await getForms(searchQuery);
      setForms(data);
    } catch (err: any) {
      toast(err.message || 'Failed to load forms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadForms(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Close 3-dots dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      setCreating(true);
      const created = await createForm(newTitle.trim(), newDescription.trim());
      toast('Form created successfully!', 'success');
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDescription('');
      router.push(`/forms/${created.id}/builder`);
    } catch (err: any) {
      toast(err.message || 'Error creating form', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      const duplicated = await duplicateForm(formId);
      toast('Form duplicated!', 'success');
      loadForms(search);
    } catch (err: any) {
      toast(err.message || 'Error duplicating form', 'error');
    }
  };

  const handleDelete = async (e: React.MouseEvent, formId: string, formTitle: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (!window.confirm(`Are you sure you want to delete "${formTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteForm(formId);
      toast('Form deleted', 'info');
      setForms((prev) => prev.filter((f) => f.id !== formId));
    } catch (err: any) {
      toast(err.message || 'Error deleting form', 'error');
    }
  };

  const handleCopyLink = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const url = `${window.location.origin}/to/${slug}`;
    navigator.clipboard.writeText(url);
    toast('Public share link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Typeform Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold tracking-tight text-lg shadow-xs">
              <span className="font-serif italic font-black">t</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-neutral-900">Typeform</span>
              <span className="text-xs text-neutral-400">My Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create form</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Workspace Title & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Forms & Surveys</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Create, customize, and analyze conversational forms.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search forms..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-900 transition-all"
            />
          </div>
        </div>

        {/* Forms Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-neutral-500" />
            <span className="text-sm">Loading your forms...</span>
          </div>
        ) : forms.length === 0 ? (
          <div className="border border-dashed border-neutral-300 rounded-2xl p-12 text-center bg-white">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">
              {search ? 'No forms matching your search' : 'No forms yet'}
            </h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
              {search
                ? 'Try a different keyword or clear the search field.'
                : 'Create your first conversational form to start collecting responses.'}
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-5 inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create form</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => router.push(`/forms/${form.id}/builder`)}
                className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  {/* Status & Options Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        form.is_published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          form.is_published ? 'bg-emerald-500' : 'bg-neutral-400'
                        }`}
                      />
                      {form.is_published ? 'Published' : 'Draft'}
                    </span>

                    {/* Three-dots menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === form.id ? null : form.id);
                        }}
                        className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === form.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-30 text-xs font-medium text-neutral-700"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/forms/${form.id}/builder`);
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-neutral-50 flex items-center gap-2"
                          >
                            <FileText className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Edit Builder</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/forms/${form.id}/results`);
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-neutral-50 flex items-center gap-2"
                          >
                            <BarChart3 className="w-3.5 h-3.5 text-neutral-500" />
                            <span>View Results</span>
                          </button>
                          {form.is_published && (
                            <button
                              onClick={(e) => handleCopyLink(e, form.slug)}
                              className="w-full px-3.5 py-2 text-left hover:bg-neutral-50 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Copy Public Link</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDuplicate(e, form.id)}
                            className="w-full px-3.5 py-2 text-left hover:bg-neutral-50 flex items-center gap-2"
                          >
                            <Layers className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Duplicate</span>
                          </button>
                          <hr className="my-1 border-neutral-100" />
                          <button
                            onClick={(e) => handleDelete(e, form.id, form.title)}
                            className="w-full px-3.5 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-base text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {form.title}
                  </h3>
                  {form.description ? (
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {form.description}
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400 italic mt-1">No description provided</p>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      {form.questions_count} {form.questions_count === 1 ? 'question' : 'questions'}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-neutral-700">
                      <BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
                      {form.responses_count} {form.responses_count === 1 ? 'response' : 'responses'}
                    </span>
                  </div>

                  {form.is_published && (
                    <a
                      href={`/to/${form.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Open public form"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Form Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-neutral-900">Create new form</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Give your conversational form a clear name to begin designing.
            </p>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Form Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Product Feedback Survey"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Collect thoughts from active beta users"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-900 transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-xs cursor-pointer"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Continue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
