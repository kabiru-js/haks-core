# services/file_service.py

import io
from fastapi import UploadFile, HTTPException, status
from PIL import Image
import pytesseract
import docx
import fitz  # PyMuPDF
from pdf2image import convert_from_bytes

# For image-based PDFs, a fallback using OCR
def ocr_pdf(file_contents: bytes) -> str:
    try:
        images = convert_from_bytes(file_contents)
        full_text = ""
        for image in images:
            full_text += pytesseract.image_to_string(image) + "\n"
        return full_text
    except Exception as e:
        # This can happen if poppler is not installed
        print(f"PDF to image conversion failed: {e}. OCR on PDF is not possible without poppler.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not process image-based PDF. The 'poppler' utility might be missing on the server."
        )

async def extract_text_from_file(file: UploadFile) -> str:
    """Extracts text from an uploaded file (PDF, DOCX, or Image)."""
    contents = await file.read()
    file_type = file.content_type

    text = ""
    try:
        if file_type == "application/pdf":
            # First, try reading text directly with PyMuPDF
            with fitz.open(stream=contents, filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text()
            
            # If no text was extracted, it might be an image-based PDF
            if not text.strip():
                print("PDF contains no text layers. Attempting OCR...")
                text = ocr_pdf(contents)

        elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = docx.Document(io.BytesIO(contents))
            text = "\n".join([para.text for para in doc.paragraphs])
        
        elif file_type in ["image/png", "image/jpeg", "image/gif", "image/bmp", "image/tiff"]:
            image = Image.open(io.BytesIO(contents))
            text = pytesseract.image_to_string(image)
        
        else:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported file type: {file_type}. Please upload a PDF, DOCX, or image file.",
            )
            
    except HTTPException as e:
        raise e  # Re-raise HTTP exceptions
    except Exception as e:
        print(f"Error processing file {file.filename}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process the file. Error: {str(e)}"
        )

    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any text from the uploaded file."
        )
        
    return text