from pydantic import BaseModel
from typing import Optional, List


class SignalWeight(BaseModel):
    label: str
    value: float
    pct: int
    color: str
    note: Optional[str] = None


class School(BaseModel):
    id: str
    name: str
    tag: str
    description: str
    weights: List[SignalWeight]
