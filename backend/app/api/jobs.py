from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import hashlib
import os

from app.api import deps
from app.db.models import User, Job, JobStatus
from app.db.session import get_db
from app.schemas.job import Job as JobSchema, JobCreate, JobUpdate
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[JobSchema])
async def read_jobs(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_user)],
    skip: int = 0,
    limit: int = 100,
    status: Optional[JobStatus] = None
):
    query = select(Job).offset(skip).limit(limit).order_by(desc(Job.created_at))
    if status:
        query = query.where(Job.status == status)
    
    result = await db.execute(query)
    jobs = result.scalars().all()
    return jobs

@router.post("/upload", response_model=JobSchema)
async def upload_exam(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_user)],
    file: UploadFile = File(...),
    language: str = Form("ar")
):
    # 1. Read file and generate hash for integrity/deduplication
    contents = await file.read()
    file_hash = hashlib.sha256(contents).hexdigest()
    
    # 2. Check if job already exists (idempotency)
    result = await db.execute(select(Job).where(Job.file_hash == file_hash))
    existing_job = result.scalar_one_or_none()
    if existing_job:
        return existing_job
    
    # 3. Save file to disk
    upload_dir = "/app/data/uploads" if os.path.exists("/app/data/uploads") else "data/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{file_hash}_{file.filename}")
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # 4. Create new Job entry
    job = Job(
        filename=file.filename,
        file_hash=file_hash,
        language=language,
        status=JobStatus.PENDING
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    # 5. Trigger Celery Task
    from app.worker.tasks import process_ocr_task
    process_ocr_task.delay(job.id, file_path)
    
    return job

@router.get("/{job_id}", response_model=JobSchema)
async def read_job(
    job_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(deps.get_current_user)]
):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
