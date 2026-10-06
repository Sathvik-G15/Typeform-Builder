from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/forms/{form_id}/questions", tags=["questions"])

@router.post("", response_model=schemas.QuestionResponse, status_code=201)
def add_question(form_id: str, question_in: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, form_id, question_in)

@router.patch("/{question_id}", response_model=schemas.QuestionResponse)
def update_question(form_id: str, question_id: str, question_in: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    return crud.update_question(db, question_id, question_in)

@router.delete("/{question_id}")
def delete_question(form_id: str, question_id: str, db: Session = Depends(get_db)):
    return crud.delete_question(db, question_id)

@router.post("/reorder")
def reorder_questions(form_id: str, reorder_in: schemas.QuestionReorderRequest, db: Session = Depends(get_db)):
    return crud.reorder_questions(db, form_id, reorder_in.items)
