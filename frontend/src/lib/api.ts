import {
  FormListItem,
  FormDetail,
  PublicForm,
  Question,
  ResponseDetail,
  FormAnalyticsResponse,
  ResponseSubmissionRequest,
  QuestionType
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

// ----------------- FORMS -----------------

export async function getForms(search?: string): Promise<FormListItem[]> {
  const url = search ? `${API_BASE}/api/forms?search=${encodeURIComponent(search)}` : `${API_BASE}/api/forms`;
  const res = await fetch(url, { cache: 'no-store' });
  return handleResponse<FormListItem[]>(res);
}

export async function createForm(title: string, description?: string): Promise<FormDetail> {
  const res = await fetch(`${API_BASE}/api/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description: description || '' }),
  });
  return handleResponse<FormDetail>(res);
}

export async function getForm(formId: string): Promise<FormDetail> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}`, { cache: 'no-store' });
  return handleResponse<FormDetail>(res);
}

export async function updateForm(formId: string, updates: Partial<FormDetail>): Promise<FormDetail> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<FormDetail>(res);
}

export async function duplicateForm(formId: string): Promise<FormDetail> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/duplicate`, {
    method: 'POST',
  });
  return handleResponse<FormDetail>(res);
}

export async function deleteForm(formId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(res);
}

// ----------------- QUESTIONS -----------------

export async function addQuestion(
  formId: string,
  data: {
    type: QuestionType;
    title: string;
    description?: string;
    is_required?: boolean;
    options_json?: string;
    properties_json?: string;
  }
): Promise<Question> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Question>(res);
}

export async function updateQuestion(
  formId: string,
  questionId: string,
  updates: Partial<Question>
): Promise<Question> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/questions/${questionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Question>(res);
}

export async function deleteQuestion(
  formId: string,
  questionId: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/questions/${questionId}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(res);
}

export async function reorderQuestions(
  formId: string,
  items: { id: string; order_index: number }[]
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/questions/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return handleResponse<{ message: string }>(res);
}

// ----------------- PUBLIC RESPONDENT -----------------

export async function getPublicForm(slug: string): Promise<PublicForm> {
  const res = await fetch(`${API_BASE}/api/public/forms/${slug}`, { cache: 'no-store' });
  return handleResponse<PublicForm>(res);
}

export async function submitPublicResponse(
  slug: string,
  submission: ResponseSubmissionRequest
): Promise<{ response_id: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/public/forms/${slug}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  return handleResponse<{ response_id: string; message: string }>(res);
}

// ----------------- ANALYTICS & RESPONSES -----------------

export async function getResponses(formId: string): Promise<ResponseDetail[]> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/responses`, { cache: 'no-store' });
  return handleResponse<ResponseDetail[]>(res);
}

export async function getResponseDetail(formId: string, responseId: string): Promise<ResponseDetail> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/responses/${responseId}`, { cache: 'no-store' });
  return handleResponse<ResponseDetail>(res);
}

export async function getAnalytics(formId: string): Promise<FormAnalyticsResponse> {
  const res = await fetch(`${API_BASE}/api/forms/${formId}/analytics`, { cache: 'no-store' });
  return handleResponse<FormAnalyticsResponse>(res);
}

export function getExportCsvUrl(formId: string): string {
  return `${API_BASE}/api/forms/${formId}/export/csv`;
}
