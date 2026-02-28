import cv2
import numpy as np
from paddleocr import PaddleOCR
from fastapi import UploadFile
from PIL import Image
import io

class OCRService:
    def __init__(self):
        # Initialize PaddleOCR for Arabic, English, and French
        # PaddleOCR uses 'ar' for Arabic, which supports mixed text well
        self.ocr = PaddleOCR(use_angle_cls=True, lang='ar')

    async def extract_text(self, file: UploadFile, language: str):
        # Read file into memory
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        img_array = np.array(image)
        
        # Run OCR
        # result is a list of [box, (text, confidence)]
        result = self.ocr.ocr(img_array, cls=True)
        
        extracted_items = []
        if result and result[0]:
            for line in result[0]:
                box = line[0] # [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
                text = line[1][0]
                confidence = line[1][1]
                
                # Convert box to [x, y, w, h] or similar simple format
                x_coords = [p[0] for p in box]
                y_coords = [p[1] for p in box]
                bbox = [int(min(x_coords)), int(min(y_coords)), int(max(x_coords)), int(max(y_coords))]
                
                extracted_items.append({
                    "text": text,
                    "confidence": float(confidence),
                    "bbox": bbox
                })
        
        return extracted_items
