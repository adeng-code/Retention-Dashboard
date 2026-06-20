import json
from pathlib import Path
from typing import Optional

_DATA_DIR = Path(__file__).parent / "data"

_cohort: Optional[list] = None
_schools: Optional[list] = None


def get_cohort() -> list[dict]:
    global _cohort
    if _cohort is None:
        with open(_DATA_DIR / "cohort.json") as f:
            _cohort = json.load(f)
    return _cohort


def get_schools() -> list[dict]:
    global _schools
    if _schools is None:
        with open(_DATA_DIR / "schools.json") as f:
            _schools = json.load(f)
    return _schools
