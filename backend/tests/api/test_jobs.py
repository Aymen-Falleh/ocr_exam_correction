import pytest
import io
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_upload_job_unauthorized(client: AsyncClient):
    files = {"file": ("test.pdf", io.BytesIO(b"fake pdf"), "application/pdf")}
    data = {"language": "ar"}
    response = await client.post("/api/v1/jobs/upload", files=files, data=data)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_list_jobs_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/jobs/")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_job_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/jobs/1")
    assert response.status_code == 401
