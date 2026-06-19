from fastapi import APIRouter, HTTPException
from typing import List
from api.models.school import School
from data_store import get_schools

router = APIRouter(prefix="/api/schools", tags=["schools"])


@router.get("", response_model=List[School])
def list_schools():
    return get_schools()


@router.get("/{school_id}", response_model=School)
def get_school(school_id: str):
    schools = get_schools()
    school = next((s for s in schools if s["id"] == school_id), None)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school
