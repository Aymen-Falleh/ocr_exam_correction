from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional
import os

class StructuredExtraction(BaseModel):
    question: str = Field(description="The question text identified from the document")
    answer: str = Field(description="The EXACT student answer text, preserved without any modification or correction")
    confidence: float = Field(description="The OCR confidence score for this extraction")
    bbox: List[int] = Field(description="The bounding box [x1, y1, x2, y2] for this extraction")

class LLMService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        self.parser = JsonOutputParser(pydantic_object=StructuredExtraction)

    async def structure_data(self, ocr_results: List[dict], language: str):
        # Enforce exact preservation through the system prompt
        system_prompt = """
        You are an expert academic data extractor specializing in handwritten exams.
        Your goal is to organize raw OCR text into structured Question-Answer pairs.
        
        CRITICAL RULES:
        1. PRESERVE EXACT WORDING: You must NEVER correct spelling, grammar, or rephrase student answers.
        2. If a student wrote "the skie is blu", you MUST output "the skie is blu".
        3. Match the raw OCR lines to the corresponding questions based on spatial proximity and sequential flow.
        4. Preserve original scripts (Arabic, French, or English).
        
        OUTPUT FORMAT:
        Return a JSON list of objects matching the schema provided.
        """
        
        user_prompt = f"""
        Process the following OCR extraction results for an exam in {language}:
        {ocr_results}
        
        Output the structured data maintaining the exact text of the answers.
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        chain = prompt | self.llm | self.parser
        
        # In a real environment, we would call the chain. 
        # For this implementation, we return the logic.
        try:
            response = await chain.ainvoke({
                "ocr_results": ocr_results,
                "language": language
            })
            return response
        except Exception as e:
            # Fallback logic if LLM fails
            print(f"LLM Error: {str(e)}")
            return []
