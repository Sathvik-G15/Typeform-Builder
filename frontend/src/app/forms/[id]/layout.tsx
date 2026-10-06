'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Share2,
  Check,
  Globe,
  Loader2,
  ExternalLink,
  Copy,
  Sliders,
  Layers,
  Sparkles,
  Radio
} from 'lucide-react';
import { getForm, updateForm } from '@/lib/api';
import { FormDetail } from '@/lib/types';
import { useToast } from '@/components/Toast';

export default function FormEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await getForm(formId);
        if (isMounted) {
          setForm(data);
          setTitle(data.title);
        }
      } catch (err: any) {
        toast(err.message || 'Error loading form', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [formId]);

  const handleTitleBlur = async () => {
    if (!form || title.trim() === form.title || !title.trim()) return;
    try {
      setSavingTitle(true);
      const updated = await updateForm(form.id, { title: title.trim() });
      setForm(updated);
      toast('Title saved', 'success');
    } catch (err: any) {
      toast(err.message || 'Error saving title', 'error');
      setTitle(form.title);
    } finally {
      setSavingTitle(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!form) return;
    try {
      setPublishing(true);
      const nextState = !form.is_published;
      const updated = await updateForm(form.id, { is_published: nextState });
      setForm(updated);
      toast(
        nextState
          ? 'Form is now Published! Public link is active.'
          : 'Form set to Draft mode. Public access disabled.',
        'success'
      );
    } catch (err: any) {
      toast(err.message || 'Error updating status', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!form) return;
    const url = `${window.location.origin}/to/${form.slug}`;
    navigator.clipboard.writeText(url);
    toast('Share link copied to clipboard!', 'success');
  };

  const isTabActive = (tab: string) => {
    if (tab === 'builder') return pathname.includes('/builder');
    if (tab === 'share') return pathname.includes('/share');
    if (tab === 'results') return pathname.includes('/results');
    return false;
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/forms"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Back to workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-4 w-px bg-neutral-200" />

          {/* Form Title Inline Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              placeholder="Form Title"
              className="font-medium text-sm text-neutral-900 bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-black px-2 py-1 rounded-md transition-all border border-transparent hover:border-neutral-200 focus:border-neutral-300 max-w-xs sm:max-w-sm truncate"
            />
            {savingTitle && <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />}
          </div>
        </div>

        {/* Center: Typeform Tab Switcher (Create / Connect / Share / Results) */}
        <nav className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          <Link
            href={`/forms/${formId}/builder`}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              isTabActive('builder')
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Create
          </Link>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-3 py-1 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
          >
            Connect
          </button>
          <Link
            href={`/forms/${formId}/share`}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              isTabActive('share')
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Share
          </Link>
          <Link
            href={`/forms/${formId}/results`}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              isTabActive('results')
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Results
          </Link>
        </nav>

        {/* Right: Preview & Publish Actions */}
        <div className="flex items-center gap-2">
          {form?.is_published && (
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-neutral-500" />
              <span>Copy Link</span>
            </button>
          )}

          {form && (
            <a
              href={`/to/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-all"
              title="Open public form in new tab"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          )}

          {/* Publish / Unpublish Button */}
          <button
            onClick={handleTogglePublish}
            disabled={publishing || !form}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              form?.is_published
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-black hover:bg-neutral-800 text-white'
            }`}
          >
            {publishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : form?.is_published ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Radio className="w-3.5 h-3.5" />
            )}
            <span>{form?.is_published ? 'Published' : 'Publish'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>

      {/* Connect Placeholder Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Integrations & Webhooks</h3>
            <p className="text-xs text-neutral-500 mt-2">
              Connect this form with Slack, Google Sheets, Zapier, Notion, and custom Webhooks.
            </p>
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 text-xs text-left space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span>Google Sheets Sync</span>
                <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Slack Notifications</span>
                <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Custom Webhook Deliveries</span>
                <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">Coming Soon</span>
              </div>
            </div>
            <button
              onClick={() => setShowConnectModal(false)}
              className="mt-5 w-full bg-black hover:bg-neutral-800 text-white py-2 rounded-lg text-xs font-semibold transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
