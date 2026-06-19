from fastapi import APIRouter
from pydantic import BaseModel
from data_store import get_cohort

router = APIRouter(prefix="/api/cohort", tags=["cohort"])


class CohortSummary(BaseModel):
    total: int
    high: int
    watch: int
    on_track: int
    poor_outcomes: int
    flagged_correctly: int
    missed: int
    recall_pct: int


@router.get("/summary", response_model=CohortSummary)
def cohort_summary():
    cohort = get_cohort()
    high = sum(1 for s in cohort if s["risk_tier"] == "high")
    watch = sum(1 for s in cohort if s["risk_tier"] == "watch")
    on_track = sum(1 for s in cohort if s["risk_tier"] == "on_track")
    poor_outcomes = sum(1 for s in cohort if s["actual_poor_outcome"])
    flagged_correctly = sum(
        1 for s in cohort if s["actual_poor_outcome"] and s["risk_tier"] != "on_track"
    )
    missed = poor_outcomes - flagged_correctly
    recall_pct = round(flagged_correctly / poor_outcomes * 100) if poor_outcomes else 0
    return {
        "total": len(cohort),
        "high": high,
        "watch": watch,
        "on_track": on_track,
        "poor_outcomes": poor_outcomes,
        "flagged_correctly": flagged_correctly,
        "missed": missed,
        "recall_pct": recall_pct,
    }
