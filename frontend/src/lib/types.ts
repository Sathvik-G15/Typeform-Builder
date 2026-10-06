export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'dropdown'
  | 'email'
  | 'number'
  | 'yes_no'
  | 'rating';

export interface Question {
  id: string;
  form_id: string;
  type: QuestionType;
  title: string;
  description?: string | null;
  is_required: boolean;
  order_index: number;
  options_json: string;
  properties_json: string;
  created_at: string;
  updated_at: string;
}

export interface FormListItem {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  is_published: boolean;
  questions_count: number;
  responses_count: number;
  created_at: string;
  updated_at: string;
}

export interface FormDetail {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  is_published: boolean;
  theme_config: string;
  welcome_screen_json: string;
  thank_you_screen_json: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
  responses_count: number;
}

export interface PublicQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string | null;
  is_required: boolean;
  order_index: number;
  options_json: string;
  properties_json: string;
}

export interface PublicForm {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  theme_config: string;
  welcome_screen_json: string;
  thank_you_screen_json: string;
  questions: PublicQuestion[];
}

export interface AnswerSubmission {
  question_id: string;
  value?: string | null;
}

export interface ResponseSubmissionRequest {
  time_spent_seconds: number;
  answers: AnswerSubmission[];
  metadata_json?: string;
}

export interface AnswerDetail {
  question_id: string;
  question_title: string;
  question_type: string;
  value?: string | null;
}

export interface ResponseDetail {
  id: string;
  submitted_at: string;
  time_spent_seconds: number;
  answers: AnswerDetail[];
}

export interface QuestionAnalyticsItem {
  question_id: string;
  question_title: string;
  question_type: string;
  order_index: number;
  total_answers: number;
  distribution?: Record<string, number> | null;
  average_number?: number | null;
  min_number?: number | null;
  max_number?: number | null;
  sample_text_answers?: string[] | null;
}

export interface FormAnalyticsResponse {
  form_id: string;
  form_title: string;
  total_responses: number;
  completion_rate_percentage: number;
  average_time_spent_seconds: number;
  questions_analytics: QuestionAnalyticsItem[];
}
