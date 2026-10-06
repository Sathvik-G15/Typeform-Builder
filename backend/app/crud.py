import re
import uuid
import json
import io
import csv
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

from . import models, schemas

def slugify(text: str) -> str:
    # Basic slugify
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text or "form"

def generate_unique_slug(db: Session, title: str) -> str:
    base_slug = slugify(title)
    short_code = uuid.uuid4().hex[:6]
    slug = f"{base_slug}-{short_code}"
    # Ensure uniqueness
    while db.query(models.Form).filter(models.Form.slug == slug).first():
        short_code = uuid.uuid4().hex[:6]
        slug = f"{base_slug}-{short_code}"
    return slug

# ----------------- FORMS -----------------

def get_forms(db: Session, search: Optional[str] = None):
    query = db.query(models.Form)
    if search:
        query = query.filter(models.Form.title.ilike(f"%{search}%"))
    forms = query.order_by(models.Form.created_at.desc()).all()
    
    result = []
    for f in forms:
        q_count = len(f.questions)
        r_count = len(f.responses)
        result.append(
            schemas.FormListItem(
                id=f.id,
                title=f.title,
                description=f.description,
                slug=f.slug,
                is_published=f.is_published,
                questions_count=q_count,
                responses_count=r_count,
                created_at=f.created_at,
                updated_at=f.updated_at
            )
        )
    return result

def get_form(db: Session, form_id: str) -> Optional[models.Form]:
    return db.query(models.Form).filter(models.Form.id == form_id).first()

def get_form_by_slug(db: Session, slug: str) -> Optional[models.Form]:
    return db.query(models.Form).filter(models.Form.slug == slug).first()

def create_form(db: Session, form_in: schemas.FormCreate) -> models.Form:
    slug = generate_unique_slug(db, form_in.title)
    db_form = models.Form(
        title=form_in.title,
        description=form_in.description,
        slug=slug,
        is_published=False,
        theme_config=form_in.theme_config,
        welcome_screen_json=form_in.welcome_screen_json,
        thank_you_screen_json=form_in.thank_you_screen_json,
    )
    db.add(db_form)
    db.flush()

    # Create a default first question for convenience
    default_q = models.Question(
        form_id=db_form.id,
        type="short_text",
        title="What is your name?",
        description="Please provide your full name",
        is_required=True,
        order_index=0,
        options_json="[]",
        properties_json="{}"
    )
    db.add(default_q)
    db.commit()
    db.refresh(db_form)
    return db_form

def update_form(db: Session, form_id: str, form_in: schemas.FormUpdate) -> models.Form:
    db_form = get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    update_data = form_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_form, field, value)
    
    db_form.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_form)
    return db_form

def duplicate_form(db: Session, form_id: str) -> models.Form:
    original = get_form(db, form_id)
    if not original:
        raise HTTPException(status_code=404, detail="Form not found")
    
    new_title = f"{original.title} (Copy)"
    new_slug = generate_unique_slug(db, new_title)

    new_form = models.Form(
        title=new_title,
        description=original.description,
        slug=new_slug,
        is_published=False,
        theme_config=original.theme_config,
        welcome_screen_json=original.welcome_screen_json,
        thank_you_screen_json=original.thank_you_screen_json,
    )
    db.add(new_form)
    db.flush()

    for q in original.questions:
        dup_q = models.Question(
            form_id=new_form.id,
            type=q.type,
            title=q.title,
            description=q.description,
            is_required=q.is_required,
            order_index=q.order_index,
            options_json=q.options_json,
            properties_json=q.properties_json
        )
        db.add(dup_q)
    
    db.commit()
    db.refresh(new_form)
    return new_form

def delete_form(db: Session, form_id: str):
    db_form = get_form(db, form_id)
    if not db_form:
        raise HTTPException(status_code=404, detail="Form not found")
    db.delete(db_form)
    db.commit()
    return {"message": "Form deleted successfully"}

# ----------------- QUESTIONS -----------------

def create_question(db: Session, form_id: str, question_in: schemas.QuestionCreate) -> models.Question:
    form = get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Calculate next order index if not specified
    if question_in.order_index is None:
        max_idx = db.query(func.max(models.Question.order_index)).filter(models.Question.form_id == form_id).scalar()
        order_index = (max_idx + 1) if max_idx is not None else 0
    else:
        order_index = question_in.order_index

    # Default options for multiple choice or dropdown if empty
    options_json = question_in.options_json
    if question_in.type in ["multiple_choice", "dropdown"] and (not options_json or options_json == "[]"):
        options_json = json.dumps(["Option 1", "Option 2", "Option 3"])

    # Default properties for rating
    properties_json = question_in.properties_json
    if question_in.type == "rating" and (not properties_json or properties_json == "{}"):
        properties_json = json.dumps({"rating_max": 5, "shape": "star"})

    db_q = models.Question(
        form_id=form_id,
        type=question_in.type,
        title=question_in.title,
        description=question_in.description,
        is_required=question_in.is_required,
        order_index=order_index,
        options_json=options_json,
        properties_json=properties_json
    )
    db.add(db_q)
    db.commit()
    db.refresh(db_q)
    return db_q

def update_question(db: Session, question_id: str, question_in: schemas.QuestionUpdate) -> models.Question:
    db_q = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = question_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_q, field, value)
    
    db_q.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_q)
    return db_q

def delete_question(db: Session, question_id: str):
    db_q = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    form_id = db_q.form_id
    deleted_idx = db_q.order_index
    db.delete(db_q)
    db.flush()

    # Reorder remaining questions to be contiguous 0, 1, 2...
    remaining = db.query(models.Question).filter(
        models.Question.form_id == form_id,
        models.Question.order_index > deleted_idx
    ).all()
    for q in remaining:
        q.order_index -= 1
    
    db.commit()
    return {"message": "Question deleted successfully"}

def reorder_questions(db: Session, form_id: str, items: List[schemas.QuestionReorderItem]):
    form = get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    id_to_index = {item.id: item.order_index for item in items}
    questions = db.query(models.Question).filter(models.Question.form_id == form_id).all()
    
    for q in questions:
        if q.id in id_to_index:
            q.order_index = id_to_index[q.id]
            q.updated_at = datetime.utcnow()

    db.commit()
    return {"message": "Questions reordered successfully"}

# ----------------- RESPONSES & SUBMISSIONS -----------------

def create_response(db: Session, form_id: str, submission: schemas.ResponseSubmissionRequest) -> models.Response:
    form = get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if not form.is_published:
        raise HTTPException(status_code=403, detail="This form is currently in draft mode and not accepting responses")

    # Client + Server validation for required fields
    submission_answers = {ans.question_id: (ans.value.strip() if ans.value else "") for ans in submission.answers}
    for q in form.questions:
        val = submission_answers.get(q.id, "")
        if q.is_required and (val is None or val == ""):
            raise HTTPException(
                status_code=422,
                detail=f"Question '{q.title}' is required but was not provided"
            )
        # Email format validation
        if q.type == "email" and val:
            email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
            if not re.match(email_pattern, val):
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid email address provided for '{q.title}'"
                )
        # Number format validation
        if q.type == "number" and val:
            try:
                float(val)
            except ValueError:
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid numeric value provided for '{q.title}'"
                )

    new_response = models.Response(
        form_id=form.id,
        time_spent_seconds=submission.time_spent_seconds,
        metadata_json=submission.metadata_json or "{}"
    )
    db.add(new_response)
    db.flush()

    for ans in submission.answers:
        if ans.value is not None:
            db_ans = models.Answer(
                response_id=new_response.id,
                question_id=ans.question_id,
                value=ans.value
            )
            db.add(db_ans)

    db.commit()
    db.refresh(new_response)
    return new_response

def get_responses_for_form(db: Session, form_id: str):
    form = get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    responses = db.query(models.Response).filter(models.Response.form_id == form_id).order_by(models.Response.submitted_at.desc()).all()
    q_dict = {q.id: q for q in form.questions}

    result = []
    for r in responses:
        ans_details = []
        for a in r.answers:
            q = q_dict.get(a.question_id)
            if q:
                ans_details.append(
                    schemas.AnswerDetail(
                        question_id=q.id,
                        question_title=q.title,
                        question_type=q.type,
                        value=a.value
                    )
                )
        result.append(
            schemas.ResponseDetail(
                id=r.id,
                submitted_at=r.submitted_at,
                time_spent_seconds=r.time_spent_seconds,
                answers=ans_details
            )
        )
    return result

def get_response_by_id(db: Session, response_id: str) -> Optional[schemas.ResponseDetail]:
    r = db.query(models.Response).filter(models.Response.id == response_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Response not found")
    
    form = r.form
    q_dict = {q.id: q for q in form.questions}
    ans_details = []
    for a in r.answers:
        q = q_dict.get(a.question_id)
        if q:
            ans_details.append(
                schemas.AnswerDetail(
                    question_id=q.id,
                    question_title=q.title,
                    question_type=q.type,
                    value=a.value
                )
            )
    return schemas.ResponseDetail(
        id=r.id,
        submitted_at=r.submitted_at,
        time_spent_seconds=r.time_spent_seconds,
        answers=ans_details
    )

# ----------------- ANALYTICS & CSV -----------------

def get_form_analytics(db: Session, form_id: str) -> schemas.FormAnalyticsResponse:
    form = get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    responses = form.responses
    total_responses = len(responses)
    avg_time = sum(r.time_spent_seconds for r in responses) / total_responses if total_responses > 0 else 0.0

    questions_analytics = []
    for q in form.questions:
        answers = [a.value for a in q.answers if a.value is not None and a.value != ""]
        total_q_answers = len(answers)

        distribution = None
        avg_num = None
        min_num = None
        max_num = None
        sample_texts = None

        if q.type in ["multiple_choice", "dropdown", "yes_no"]:
            freq = {}
            for val in answers:
                freq[val] = freq.get(val, 0) + 1
            distribution = freq
        elif q.type in ["rating", "number"]:
            numeric_vals = []
            for val in answers:
                try:
                    numeric_vals.append(float(val))
                except ValueError:
                    pass
            if numeric_vals:
                avg_num = round(sum(numeric_vals) / len(numeric_vals), 2)
                min_num = min(numeric_vals)
                max_num = max(numeric_vals)
        else:
            sample_texts = answers[:10]  # First 10 samples

        questions_analytics.append(
            schemas.QuestionAnalyticsItem(
                question_id=q.id,
                question_title=q.title,
                question_type=q.type,
                order_index=q.order_index,
                total_answers=total_q_answers,
                distribution=distribution,
                average_number=avg_num,
                min_number=min_num,
                max_number=max_num,
                sample_text_answers=sample_texts
            )
        )

    completion_rate = 100.0 if total_responses > 0 else 0.0

    return schemas.FormAnalyticsResponse(
        form_id=form.id,
        form_title=form.title,
        total_responses=total_responses,
        completion_rate_percentage=completion_rate,
        average_time_spent_seconds=round(avg_time, 1),
        questions_analytics=questions_analytics
    )

def generate_csv_export(db: Session, form_id: str) -> str:
    form = get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    output = io.StringIO()
    writer = csv.writer(output)

    # Header: Submission ID, Date Submitted, Time Spent (s), Question 1, Question 2...
    headers = ["Response ID", "Submitted At (UTC)", "Time Spent (s)"]
    for q in form.questions:
        headers.append(f"{q.title} ({q.type})")
    writer.writerow(headers)

    for r in form.responses:
        ans_map = {a.question_id: a.value for a in r.answers}
        row = [
            r.id,
            r.submitted_at.strftime("%Y-%m-%d %H:%M:%S"),
            r.time_spent_seconds
        ]
        for q in form.questions:
            row.append(ans_map.get(q.id, ""))
        writer.writerow(row)

    return output.getvalue()
