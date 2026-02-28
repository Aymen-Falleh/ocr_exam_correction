import cv2
import numpy as np
import easyocr
from fastapi import UploadFile
from PIL import Image
import io

# Language mapping for EasyOCR
LANG_MAP = {
    'ar': ['ar', 'en'],      # Arabic + English (EasyOCR supports mixed)
    'en': ['en'],
    'fr': ['fr', 'en'],      # French + English
    'ar-en': ['ar', 'en'],
    'fr-en': ['fr', 'en'],
}

class OCRService:
    def __init__(self):
        # Initialize EasyOCR readers for each language combo (lazy loaded)
        self._readers: dict = {}
    
    def _get_reader(self, language: str) -> easyocr.Reader:
        langs = LANG_MAP.get(language, ['ar', 'en'])
        key = tuple(sorted(langs))
        if key not in self._readers:
            self._readers[key] = easyocr.Reader(list(langs), gpu=False)
        return self._readers[key]

    async def extract_text(self, file: UploadFile, language: str):
        # Read file into memory
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        img_array = np.array(image)
        
        # Get the appropriate reader
        reader = self._get_reader(language)
        
        # Run OCR
        # result is a list of (bbox, text, confidence)
        result = reader.readtext(img_array)
        
        extracted_items = []
        for detection in result:
            box = detection[0]   # [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
            text = detection[1]
            confidence = detection[2]
            
            # Convert box to [x_min, y_min, x_max, y_max]
            x_coords = [p[0] for p in box]
            y_coords = [p[1] for p in box]
            bbox = [int(min(x_coords)), int(min(y_coords)), int(max(x_coords)), int(max(y_coords))]
            
            extracted_items.append({
                "text": text,
                "confidence": float(confidence),
                "bbox": bbox
            })
        
        return extracted_items
