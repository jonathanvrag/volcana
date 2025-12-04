import os
from uuid import uuid4
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = "/app/media"


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.content_type.startswith(("image/", "video/")):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten archivos de imagen o video",
        )

    _name, ext = os.path.splitext(file.filename)
    if not ext:
        ext = ".bin"
    filename = f"{uuid4().hex}{ext}"

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    save_path = os.path.join(UPLOAD_DIR, filename)

    contents = await file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    public_url = f"/media/{filename}"
    return {"file_url": public_url}
