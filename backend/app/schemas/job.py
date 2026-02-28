from pydantic import BaseModel
from typing import Any, List, Optional
from datetime import datetime
from app.db.models import JobStatus

class ExtractionBase(BaseModel):
    question_text: str
    answer_text: str
    confidence: float
    bounding_box: Optional[Any] = None

class Extraction(ExtractionBase):
    id: int
    job_id: int

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    language: str

class JobCreate(JobBase):
    filename: str
    file_hash: str

class JobUpdate(BaseModel):
    status: Optional[JobStatus] = None
    avg_confidence: Optional[float] = None
    completed_at: Optional[datetime] = None

class Job(JobBase):
    id: int
    filename: str
    status: JobStatus
    avg_confidence: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    extractions: List[Extraction] = []

    class Config:
        from_attributes = True
