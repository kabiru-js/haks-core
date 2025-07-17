# services/pdf_service.py

import io
import textwrap
from PIL import Image, ImageDraw, ImageFont
from fpdf import FPDF

# Constants
FONT_PATH = "static/fonts/PatrickHand-Regular.ttf"
FONT_SIZE = 40
IMAGE_WIDTH_PX = 1240 
MARGIN_PX = 60
LINE_SPACING = 1.2

def create_handwritten_pdf(text: str) -> bytes:
    """Renders text into a handwritten-style PDF."""
    try:
        font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    except IOError:
        raise FileNotFoundError(f"Font file not found at {FONT_PATH}")

    # --- 1. Render text to an image using Pillow ---
    avg_char_width = sum(font.getbbox(c)[2] for c in 'abcdefghijklmnopqrstuvwxyz') / 26
    max_chars_per_line = int((IMAGE_WIDTH_PX - 2 * MARGIN_PX) / avg_char_width)
    wrapped_text = "\n".join(textwrap.wrap(text, width=max_chars_per_line, replace_whitespace=False))
    
    lines = wrapped_text.split('\n')
    line_height = FONT_SIZE * LINE_SPACING
    img_height = int((len(lines) * line_height) + 2 * MARGIN_PX)

    image = Image.new("RGB", (IMAGE_WIDTH_PX, img_height), "white")
    draw = ImageDraw.Draw(image)
    y_text = MARGIN_PX
    for line in lines:
        draw.text((MARGIN_PX, y_text), line, font=font, fill="black")
        y_text += line_height

    # --- 2. Convert image to PDF using FPDF ---
    pdf = FPDF(orientation='P', unit='mm', format='A4')
    pdf.add_page()
    
    available_width = 190 
    
    with io.BytesIO() as img_buffer:
        image.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        pdf.image(img_buffer, x=10, y=10, w=available_width)

    # --- FIX IS HERE ---
    # Return the PDF data directly as a bytearray. Do not call .encode().
    return pdf.output()