# routes/assignment_routes.py

import io
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import StreamingResponse

from models.assignment import AssignmentResponse
from models.handwriting import HandwritingRequest
from services import ai_service, file_service, pdf_service

router = APIRouter()

@router.post("/solve-assignment", response_model=AssignmentResponse)
async def solve_assignment(
    text: str = Form(None), 
    file: UploadFile = File(None)
):
    """
    Accepts assignment questions via JSON text or file upload (PDF, DOCX, image),
    solves it with AI, paraphrases the result, and returns both versions.
    
    NOW POWERED BY A LOCAL OLLAMA MODEL.
    """
    if not text and not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Please provide either 'text' in the form data or upload a 'file'."
        )
    if text and file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either 'text' or a 'file', not both."
        )

    assignment_content = ""
    try:
        if file:
            assignment_content = await file_service.extract_text_from_file(file)
        elif text:
            assignment_content = text
        
        # --- SWITCH TO OLLAMA FUNCTIONS ---
        # Call the new functions that end with '_ollama'
        original_answer = await ai_service.get_solution_ollama(assignment_content)
        paraphrased_answer = await ai_service.paraphrase_solution_ollama(original_answer)

        return AssignmentResponse(
            original_answer=original_answer,
            paraphrased_answer=paraphrased_answer
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"An unexpected error occurred in solve_assignment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An internal server error occurred: {str(e)}"
        )


@router.post("/generate-handwritten-pdf")
async def generate_handwritten_pdf(request: HandwritingRequest):
    """
    Accepts text and returns a downloadable PDF styled like handwriting.
    """
    try:
        pdf_bytes = pdf_service.create_handwritten_pdf(request.text)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=handwritten_solution.pdf"}
        )
    except FileNotFoundError as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server configuration error: {str(e)}"
        )
    except Exception as e:
        print(f"An unexpected error occurred during PDF generation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF: {str(e)}"
        )