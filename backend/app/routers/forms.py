from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/forms", tags=["forms"])

@router.get("", response_model=List[schemas.FormListItem])
def list_forms(search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud.get_forms(db, search=search)

@router.post("", response_model=schemas.FormResponse, status_code=201)
def create_form(form_in: schemas.FormCreate, db: Session = Depends(get_db)):
    form = crud.create_form(db, form_in)
    return form

@router.get("/{form_id}", response_model=schemas.FormResponse)
def get_form(form_id: str, db: Session = Depends(get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    # attach responses_count
    resp = schemas.FormResponse.model_validate(form)
    resp.responses_count = len(form.responses)
    return resp

@router.patch("/{form_id}", response_model=schemas.FormResponse)
def update_form(form_id: str, form_in: schemas.FormUpdate, db: Session = Depends(get_db)):
    form = crud.update_form(db, form_id, form_in)
    resp = schemas.FormResponse.model_validate(form)
    resp.responses_count = len(form.responses)
    return resp

@router.post("/{form_id}/duplicate", response_model=schemas.FormResponse, status_code=201)
def duplicate_form(form_id: str, db: Session = Depends(get_db)):
    new_form = crud.duplicate_form(db, form_id)
    resp = schemas.FormResponse.model_validate(new_form)
    resp.responses_count = 0
    return resp

@router.delete("/{form_id}")
def delete_form(form_id: str, db: Session = Depends(get_db)):
    return crud.delete_form(db, form_id)
