from fastapi import FastAPI, UploadFile, File, Form
from app.services.ocr_service import OCRService
from app.services.llm_service import LLMService
from pydantic import BaseModel
from typing import List

app = FastAPI(title="AI OCR Service")

ocr_service = OCRService()
llm_service = LLMService()

class ExtractionResult(BaseModel):
    question: str
    answer: str
    confidence: float
    bbox: List[int]

class ProcessResponse(BaseModel):
    extractions: List[ExtractionResult]

@app.post("/process", response_model=ProcessResponse)
async def process_document(
    file: UploadFile = File(...),
    language: str = Form("ar")
):
    # 1. OCR + Layout Analysis
    raw_results = await ocr_service.extract_text(file, language)
    
    # 2. LLM Structuring (Preserving exact wording)
    structured_results = await llm_service.structure_data(raw_results, language)
    
    return {"extractions": structured_results}

@app.get("/health")
async def health():
    return {"status": "ok"}
