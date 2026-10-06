import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return uuid.uuid4().hex

class Form(Base):
    __tablename__ = "forms"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, default="My New Form")
    description = Column(Text, nullable=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    
    # JSON strings for custom theme and screens
    theme_config = Column(
        Text,
        default='{"primaryColor":"#0445FE","backgroundColor":"#FFFFFF","font":"Inter"}',
        nullable=False
    )
    welcome_screen_json = Column(
        Text,
        default='{"enabled":false,"title":"Welcome to this form","description":"Please take a moment to answer","buttonText":"Start"}',
        nullable=False
    )
    thank_you_screen_json = Column(
        Text,
        default='{"title":"Thank you!","description":"Your response has been submitted successfully.","buttonText":"Create your own form"}',
        nullable=False
    )

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    questions = relationship(
        "Question",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="Question.order_index"
    )
    responses = relationship(
        "Response",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="Response.submitted_at.desc()"
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Types: short_text, long_text, multiple_choice, dropdown, email, number, yes_no, rating
    type = Column(String(50), nullable=False, default="short_text")
    title = Column(Text, nullable=False, default="Question title")
    description = Column(Text, nullable=True)
    is_required = Column(Boolean, default=False, nullable=False)
    order_index = Column(Integer, default=0, nullable=False, index=True)
    
    # Options for multiple choice / dropdown (stored as JSON array: ["Option A", "Option B"])
    options_json = Column(Text, default="[]", nullable=False)
    
    # Properties for specifics like rating scale (e.g. {"rating_max": 5, "placeholder": "..."})
    properties_json = Column(Text, default="{}", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    form = relationship("Form", back_populates="questions")
    answers = relationship(
        "Answer",
        back_populates="question",
        cascade="all, delete-orphan"
    )


class Response(Base):
    __tablename__ = "responses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id", ondelete="CASCADE"), nullable=False, index=True)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    time_spent_seconds = Column(Integer, default=0, nullable=False)
    metadata_json = Column(Text, default="{}", nullable=True)

    form = relationship("Form", back_populates="responses")
    answers = relationship(
        "Answer",
        back_populates="response",
        cascade="all, delete-orphan"
    )


class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    response_id = Column(String(36), ForeignKey("responses.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    value = Column(Text, nullable=True)  # String, numeric, boolean or JSON representation

    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")
