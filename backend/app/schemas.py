from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# ----------------- QUESTIONS -----------------

class QuestionBase(BaseModel):
    type: str = Field(default="short_text", description="Question type")
    title: str = Field(default="Question title", description="Question title")
    description: Optional[str] = None
    is_required: bool = False
    options_json: str = "[]"
    properties_json: str = "{}"

class QuestionCreate(QuestionBase):
    order_index: Optional[int] = None

class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    is_required: Optional[bool] = None
    order_index: Optional[int] = None
    options_json: Optional[str] = None
    properties_json: Optional[str] = None

class QuestionResponse(QuestionBase):
    id: str
    form_id: str
    order_index: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class QuestionReorderItem(BaseModel):
    id: str
    order_index: int

class QuestionReorderRequest(BaseModel):
    items: List[QuestionReorderItem]

# ----------------- FORMS -----------------

class FormBase(BaseModel):
    title: str = "My New Form"
    description: Optional[str] = None
    theme_config: str = '{"primaryColor":"#0445FE","backgroundColor":"#FFFFFF","font":"Inter"}'
    welcome_screen_json: str = '{"enabled":false,"title":"Welcome to this form","description":"Please take a moment to answer","buttonText":"Start"}'
    thank_you_screen_json: str = '{"title":"Thank you!","description":"Your response has been submitted successfully.","buttonText":"Create your own form"}'

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_published: Optional[bool] = None
    theme_config: Optional[str] = None
    welcome_screen_json: Optional[str] = None
    thank_you_screen_json: Optional[str] = None

class FormListItem(BaseModel):
    id: str
    title: str
    description: Optional[str]
    slug: str
    is_published: bool
    questions_count: int
    responses_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FormResponse(FormBase):
    id: str
    slug: str
    is_published: bool
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionResponse] = []
    responses_count: int = 0

    class Config:
        from_attributes = True

# ----------------- PUBLIC RESPONDENT SCHEMAS -----------------

class PublicQuestionResponse(BaseModel):
    id: str
    type: str
    title: str
    description: Optional[str]
    is_required: bool
    order_index: int
    options_json: str
    properties_json: str

    class Config:
        from_attributes = True

class PublicFormResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    slug: str
    theme_config: str
    welcome_screen_json: str
    thank_you_screen_json: str
    questions: List[PublicQuestionResponse]

    class Config:
        from_attributes = True

# ----------------- SUBMISSIONS -----------------

class AnswerSubmission(BaseModel):
    question_id: str
    value: Optional[str] = None

class ResponseSubmissionRequest(BaseModel):
    time_spent_seconds: int = 0
    answers: List[AnswerSubmission]
    metadata_json: Optional[str] = "{}"

class ResponseSubmissionResult(BaseModel):
    response_id: str
    message: str

# ----------------- RESULTS & ANALYTICS -----------------

class AnswerDetail(BaseModel):
    question_id: str
    question_title: str
    question_type: str
    value: Optional[str]

class ResponseDetail(BaseModel):
    id: str
    submitted_at: datetime
    time_spent_seconds: int
    answers: List[AnswerDetail]

    class Config:
        from_attributes = True

class QuestionAnalyticsItem(BaseModel):
    question_id: str
    question_title: str
    question_type: str
    order_index: int
    total_answers: int
    # For choice / dropdown / yes_no: frequency distribution
    distribution: Optional[Dict[str, int]] = None
    # For number / rating: average, min, max
    average_number: Optional[float] = None
    min_number: Optional[float] = None
    max_number: Optional[float] = None
    # Sample text entries for text fields
    sample_text_answers: Optional[List[str]] = None

class FormAnalyticsResponse(BaseModel):
    form_id: str
    form_title: str
    total_responses: int
    completion_rate_percentage: float
    average_time_spent_seconds: float
    questions_analytics: List[QuestionAnalyticsItem]
