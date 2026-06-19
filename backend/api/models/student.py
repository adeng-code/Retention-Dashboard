from pydantic import BaseModel
from typing import Optional


class Student(BaseModel):
    student_id: str
    name: str
    major: str
    year: str
    first_generation: bool
    credits_this_term: int
    gpa: float
    midterm_gpa: float
    lms_engagement_pct: int
    gateway_course: str
    failed_gateway: bool
    course_drops: int
    late_submissions: int
    major_switches: int
    attendance_flags: int
    credits_behind: int
    risk_score: float
    risk_tier: str
    risk_drivers: str
    suggested_intervention: str
    actual_poor_outcome: bool


class StudentSummary(BaseModel):
    student_id: str
    name: str
    major: str
    year: str
    gpa: float
    risk_score: float
    risk_tier: str
    risk_drivers: str
