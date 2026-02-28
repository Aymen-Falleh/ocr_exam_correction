import httpx
import asyncio
import os
from app.worker.celery_app import celery_app
from app.db.session import AsyncSessionLocal
from app.db.models import Job, JobStatus, Extraction
from app.core.config import settings
from sqlalchemy import select, update
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

AI_SERVICE_URL = "http://ai-service:8001/process"

@celery_app.task(name="process_ocr_task")
def process_ocr_task(job_id: int, file_path: str):
    return asyncio.run(async_process_ocr(job_id, file_path))

async def async_process_ocr(job_id: int, file_path: str):
    async with AsyncSessionLocal() as db:
        try:
            # 1. Update status to PROCESSING
            await db.execute(
                update(Job).where(Job.id == job_id).values(status=JobStatus.PROCESSING)
            )
            await db.commit()
            
            # 2. Get Job details
            result = await db.execute(select(Job).where(Job.id == job_id))
            job = result.scalar_one()
            
            # 3. Call AI Service with actual file
            if not os.path.exists(file_path):
                raise Exception(f"File not found: {file_path}")

            async with httpx.AsyncClient(timeout=60.0) as client:
                with open(file_path, "rb") as f:
                    files = {'file': (job.filename, f, 'application/octet-stream')}
                    data = {'language': job.language}
                    
                    response = await client.post(AI_SERVICE_URL, files=files, data=data)
                
                if response.status_code != 200:
                    raise Exception(f"AI Service failed: {response.text}")
                
                results = response.json().get("extractions", [])
            
            # 4. Save Extractions
            total_conf = 0
            for item in results:
                extraction = Extraction(
                    job_id=job.id,
                    question_text=item["question"],
                    answer_text=item["answer"],
                    confidence=item["confidence"],
                    bounding_box=item["bbox"]
                )
                db.add(extraction)
                total_conf += item["confidence"]
            
            # 5. Update Job as COMPLETED
            avg_conf = total_conf / len(results) if results else 0
            await db.execute(
                update(Job).where(Job.id == job.id).values(
                    status=JobStatus.COMPLETED,
                    avg_confidence=avg_conf,
                    completed_at=datetime.utcnow()
                )
            )
            await db.commit()
            
        except Exception as e:
            logger.error(f"Error processing job {job_id}: {str(e)}")
            await db.execute(
                update(Job).where(Job.id == job_id).values(status=JobStatus.FAILED)
            )
            await db.commit()
            raise e
