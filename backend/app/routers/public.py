from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/public/forms", tags=["public"])

@router.get("/{slug}", response_model=schemas.PublicFormResponse)
def get_public_form(slug: str, db: Session = Depends(get_db)):
    form = crud.get_form_by_slug(db, slug)
    if not form:
        form = crud.get_form(db, slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    return schemas.PublicFormResponse(
        id=form.id,
        title=form.title,
        description=form.description,
        slug=form.slug,
        theme_config=form.theme_config,
        welcome_screen_json=form.welcome_screen_json,
        thank_you_screen_json=form.thank_you_screen_json,
        questions=[schemas.PublicQuestionResponse.model_validate(q) for q in form.questions]
    )

@router.post("/{slug}/submit", response_model=schemas.ResponseSubmissionResult)
def submit_public_response(slug: str, submission: schemas.ResponseSubmissionRequest, db: Session = Depends(get_db)):
    form = crud.get_form_by_slug(db, slug)
    if not form:
        form = crud.get_form(db, slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    response = crud.create_response(db, form.id, submission)
    return schemas.ResponseSubmissionResult(
        response_id=response.id,
        message="Thank you! Your response has been submitted successfully."
    )
