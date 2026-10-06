'use client';

import React, { useState, useEffect, use } from 'react';
import {
  BarChart3,
  ListFilter,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Loader2,
  X,
  Search,
  Star,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getAnalytics, getResponses, getExportCsvUrl } from '@/lib/api';
import { FormAnalyticsResponse, ResponseDetail } from '@/lib/types';
import { useToast } from '@/components/Toast';

export default function FormResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'summary' | 'responses'>('summary');
  const [analytics, setAnalytics] = useState<FormAnalyticsResponse | null>(null);
  const [responses, setResponses] = useState<ResponseDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Submissions search & inspect modal
  const [search, setSearch] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<ResponseDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [analyticsData, responsesData] = await Promise.all([
          getAnalytics(formId),
          getResponses(formId),
        ]);
        setAnalytics(analyticsData);
        setResponses(responsesData);
      } catch (err: any) {
        toast('Failed to load results', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [formId]);

  const handleDownloadCsv = () => {
    const url = getExportCsvUrl(formId);
    window.open(url, '_blank');
    toast('Downloading CSV...', 'success');
  };

  const filteredResponses = responses.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.answers.some((a) => (a.value || '').toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
        <span className="text-sm">Loading analytics and responses...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 p-6 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Results Header & Sub-tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Form Results & Analytics
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {analytics?.form_title} • {analytics?.total_responses || 0} total submissions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Toggle */}
            <div className="bg-white border border-neutral-200 p-1 rounded-xl flex items-center gap-1 shadow-2xs">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('responses')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'responses'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Responses ({responses.length})
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleDownloadCsv}
              disabled={responses.length === 0}
              className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 hover:border-black text-neutral-800 disabled:opacity-40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* ---------------- 1. SUMMARY TAB ---------------- */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Total Responses
                </span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">
                  {analytics?.total_responses ?? 0}
                </div>
                <span className="text-xs text-neutral-500 mt-1 block">Completed submissions</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Completion Rate
                </span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">
                  {analytics?.completion_rate_percentage ?? 0}%
                </div>
                <span className="text-xs text-neutral-500 mt-1 block">Of all who began form</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Average Time
                </span>
                <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">
                  {analytics?.average_time_spent_seconds ?? 0}s
                </div>
                <span className="text-xs text-neutral-500 mt-1 block">To complete all questions</span>
              </div>
            </div>

            {/* Question by Question Analytics Cards */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-neutral-900">Question Insights</h3>

              {analytics?.questions_analytics.map((qa, idx) => (
                <div
                  key={qa.question_id}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600">
                          {idx + 1} →
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900">{qa.question_title}</h4>
                      </div>
                      <span className="text-xs text-neutral-400 mt-0.5 block">
                        Type: {qa.question_type.replace('_', ' ')} • {qa.total_answers} answers
                      </span>
                    </div>

                    {/* Numeric or Rating Average Badge */}
                    {qa.average_number !== null && qa.average_number !== undefined && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                        <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                        <span>Average: {qa.average_number}</span>
                      </div>
                    )}
                  </div>

                  {/* Choice or Yes/No Distributions */}
                  {qa.distribution && Object.keys(qa.distribution).length > 0 && (
                    <div className="space-y-2.5 mt-3">
                      {Object.entries(qa.distribution).map(([choice, count]) => {
                        const total = qa.total_answers || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={choice} className="space-y-1">
                            <div className="flex justify-between text-xs text-neutral-700 font-medium">
                              <span>{choice}</span>
                              <span className="font-mono text-neutral-500">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Answers Sample list */}
                  {qa.sample_text_answers && qa.sample_text_answers.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <span className="text-xs font-semibold text-neutral-500 block">
                        Sample Responses:
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {qa.sample_text_answers.map((txt, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-2.5 bg-neutral-50 rounded-xl text-xs text-neutral-700 border border-neutral-100 italic"
                          >
                            "{txt}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 2. RESPONSES TAB ---------------- */}
        {activeTab === 'responses' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            {/* Table Search Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between gap-4">
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <span className="text-xs text-neutral-500">
                Showing {filteredResponses.length} of {responses.length} responses
              </span>
            </div>

            {/* Submissions Table */}
            {filteredResponses.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 text-xs">
                No submissions found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Submission ID</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Answers Preview</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {filteredResponses.map((r) => {
                      const dateStr = new Date(r.submitted_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const previewStr = r.answers
                        .slice(0, 2)
                        .map((a) => `${a.question_title}: ${a.value || '-'}`)
                        .join(' • ');

                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedResponse(r)}
                          className="hover:bg-neutral-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-neutral-900">
                            #{r.id.substring(0, 8)}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-500">{dateStr}</td>
                          <td className="py-3.5 px-4 font-mono">{r.time_spent_seconds}s</td>
                          <td className="py-3.5 px-4 max-w-sm truncate text-neutral-600">
                            {previewStr}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedResponse(r);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Individual Response Detail Drawer / Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Submission #{selectedResponse.id.substring(0, 8)}
                </h3>
                <span className="text-xs text-neutral-500">
                  {new Date(selectedResponse.submitted_at).toLocaleString()} • {selectedResponse.time_spent_seconds}s spent
                </span>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {selectedResponse.answers.map((ans, aIdx) => (
                <div key={ans.question_id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-[11px] font-mono font-bold text-blue-600 block mb-1">
                    {aIdx + 1}. {ans.question_title}
                  </span>
                  <div className="text-sm font-semibold text-neutral-900">
                    {ans.value ? ans.value : <span className="text-neutral-400 italic">No answer provided</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
