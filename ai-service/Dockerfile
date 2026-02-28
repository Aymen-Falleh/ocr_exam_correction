FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install CPU-only PyTorch first (much smaller than CUDA version)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install remaining requirements (easyocr will use the already-installed torch)
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download EasyOCR models for Arabic, English, French
RUN python3 -c "import easyocr; easyocr.Reader(['ar','en'], gpu=False); easyocr.Reader(['fr','en'], gpu=False)"

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
