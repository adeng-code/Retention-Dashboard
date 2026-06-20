from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from api.models.student import Student, StudentSummary
from data_store import get_cohort

router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("", response_model=List[StudentSummary])
def list_students(
    tier: Optional[str] = Query(None, description="Filter by risk tier: high, watch, on_track"),
    year: Optional[str] = Query(None, description="Filter by year: Freshman, Sophomore, Junior, Senior"),
    major: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search by name or student_id"),
):
    cohort = get_cohort()
    if tier:
        cohort = [s for s in cohort if s["risk_tier"] == tier]
    if year:
        cohort = [s for s in cohort if s["year"] == year]
    if major:
        cohort = [s for s in cohort if s["major"] == major]
    if search:
        q = search.lower()
        cohort = [s for s in cohort if q in s["name"].lower() or q in s["student_id"].lower()]
    return cohort


@router.get("/majors", response_model=List[str])
def list_majors():
    return sorted({s["major"] for s in get_cohort()})


@router.get("/{student_id}", response_model=Student)
def get_student(student_id: str):
    cohort = get_cohort()
    student = next((s for s in cohort if s["student_id"] == student_id), None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
