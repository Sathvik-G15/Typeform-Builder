'use client';

import React, { useState, useEffect, use } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Code2,
  Globe,
  Radio,
  Loader2,
  Sparkles,
  QrCode
} from 'lucide-react';
import { getForm, updateForm } from '@/lib/api';
import { FormDetail } from '@/lib/types';
import { useToast } from '@/components/Toast';

export default function FormSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const { toast } = useToast();

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getForm(formId);
        setForm(data);
      } catch (err: any) {
        toast('Error loading form', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [formId]);

  const publicUrl = typeof window !== 'undefined' && form ? `${window.location.origin}/to/${form.slug}` : '';
  const embedCode = `<iframe\n  src="${publicUrl}"\n  width="100%"\n  height="600"\n  frameborder="0"\n  allow="camera; microphone; autoplay; encrypted-media;"\n></iframe>`;

  const copyToClipboard = (text: string, isEmbed = false) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
      toast('Embed HTML copied to clipboard!', 'success');
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast('Public share link copied!', 'success');
    }
  };

  const handleTogglePublish = async () => {
    if (!form) return;
    try {
      setUpdatingStatus(true);
      const next = !form.is_published;
      const updated = await updateForm(form.id, { is_published: next });
      setForm(updated);
      toast(next ? 'Form published! Link is live.' : 'Form set to draft.', 'success');
    } catch (err: any) {
      toast('Error changing status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
        <span className="text-sm">Loading share settings...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 p-6 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Share your form</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Publish and distribute your form to respondents anywhere.
          </p>
        </div>

        {/* Publication Status Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                form?.is_published
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {form?.is_published ? 'Form is Live & Published' : 'Form is in Draft Mode'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    form?.is_published ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {form?.is_published
                  ? 'Anyone with the link can fill and submit responses.'
                  : 'Respondents cannot view this form until you publish it.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTogglePublish}
            disabled={updatingStatus}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              form?.is_published
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
            }`}
          >
            {updatingStatus ? 'Updating...' : form?.is_published ? 'Unpublish' : 'Publish now'}
          </button>
        </div>

        {/* Shareable Link Box */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900">Public Form Link</span>
            {form?.is_published && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open in new tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-700 focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(publicUrl)}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy link'}</span>
            </button>
          </div>
        </div>

        {/* Embed In Website */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-neutral-600" />
            <span className="text-sm font-bold text-neutral-900">Embed in your website</span>
          </div>
          <p className="text-xs text-neutral-500">
            Paste this snippet into your React app, HTML page, or WordPress site to embed the form full-width.
          </p>

          <pre className="p-3.5 bg-neutral-900 text-neutral-200 rounded-xl text-xs font-mono overflow-x-auto">
            {embedCode}
          </pre>

          <div className="flex justify-end">
            <button
              onClick={() => copyToClipboard(embedCode, true)}
              className="inline-flex items-center gap-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            >
              {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmbed ? 'Copied Embed Code' : 'Copy Embed Snippet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
