from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response as FastAPIResponse
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/forms/{form_id}", tags=["analytics"])

@router.get("/responses", response_model=List[schemas.ResponseDetail])
def list_responses(form_id: str, db: Session = Depends(get_db)):
    return crud.get_responses_for_form(db, form_id)

@router.get("/responses/{response_id}", response_model=schemas.ResponseDetail)
def get_single_response(form_id: str, response_id: str, db: Session = Depends(get_db)):
    return crud.get_response_by_id(db, response_id)

@router.get("/analytics", response_model=schemas.FormAnalyticsResponse)
def get_analytics(form_id: str, db: Session = Depends(get_db)):
    return crud.get_form_analytics(db, form_id)

@router.get("/export/csv")
def export_csv(form_id: str, db: Session = Depends(get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    csv_data = crud.generate_csv_export(db, form_id)
    filename = f"{form.slug}_responses.csv"
    
    return FastAPIResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
