'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createForm, addQuestion, updateForm } from '@/lib/api';
import { Loader2, Sparkles, ArrowRight, Play, Settings } from 'lucide-react';

function NewFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateName = searchParams.get('template') || 'Blank Form';

  const [loading, setLoading] = useState(true);
  const [createdForm, setCreatedForm] = useState<any>(null);

  useEffect(() => {
    async function create() {
      try {
        setLoading(true);
        const title = templateName === 'Blank Form' ? 'My New Typeform' : templateName;
        const form = await createForm(title, `Created from ${templateName}`);

        // Add template questions
        if (templateName.toLowerCase().includes('lead')) {
          await addQuestion(form.id, {
            type: 'short_text',
            title: 'What is your company name?',
            is_required: true,
          });
          await addQuestion(form.id, {
            type: 'email',
            title: 'What is your work email?',
            is_required: true,
          });
          await addQuestion(form.id, {
            type: 'multiple_choice',
            title: 'What is your estimated annual budget?',
            options_json: JSON.stringify(['Under $10k', '$10k - $50k', '$50k - $250k', '$250k+']),
            is_required: false,
          });
        } else if (templateName.toLowerCase().includes('feedback') || templateName.toLowerCase().includes('nps')) {
          await addQuestion(form.id, {
            type: 'rating',
            title: 'How satisfied are you with our product?',
            properties_json: JSON.stringify({ rating_max: 5 }),
            is_required: true,
          });
          await addQuestion(form.id, {
            type: 'long_text',
            title: 'What is one thing we could improve?',
            is_required: false,
          });
          await addQuestion(form.id, {
            type: 'email',
            title: 'Your email address (optional for follow-up):',
            is_required: false,
          });
        } else if (templateName.toLowerCase().includes('event') || templateName.toLowerCase().includes('rsvp')) {
          await addQuestion(form.id, {
            type: 'multiple_choice',
            title: 'Will you be attending in person or virtually?',
            options_json: JSON.stringify(['In Person (San Francisco)', 'Virtual Livestream', 'Unable to attend']),
            is_required: true,
          });
          await addQuestion(form.id, {
            type: 'email',
            title: 'Where should we send your ticket confirmation?',
            is_required: true,
          });
        }

        // Publish by default so it can immediately be filled
        await updateForm(form.id, { is_published: true });

        // Redirect directly to the builder
        router.push(`/forms/${form.id}/builder`);
      } catch (err) {
        console.error('Error creating template form:', err);
        router.push('/forms');
      }
    }

    create();
  }, [templateName, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FDFDFD] text-neutral-800 p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold">Creating your form...</h2>
        <p className="text-sm text-neutral-500">
          Setting up <strong>{templateName}</strong> with ready-to-use conversational questions.
        </p>
        <div className="flex justify-center pt-2">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      </div>
    </div>
  );
}

export default function NewFormPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    }>
      <NewFormContent />
    </Suspense>
  );
}
