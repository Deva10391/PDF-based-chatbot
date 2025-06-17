import os
import pytesseract
from PIL import Image
from io import BytesIO
from fastapi import UploadFile
from pdf2image import convert_from_path

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
poppler_path = r'C:\Users\devas\Downloads\Release-24.08.0-0\poppler-24.08.0\Library\bin'

def extract_text_from_image(img_path):
    try:
        image = Image.open(BytesIO(img_path.file.read()))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return f"Error: {e}"

def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path, dpi=300, poppler_path=poppler_path)
        text = ""
        for i, image in enumerate(images):
            page_text = pytesseract.image_to_string(image)
            text += f"\n--- Page {i+1} ---\n{page_text}"
        return text
    except Exception as e:
        return f"Error: {e}"

def file_processing(file_path: UploadFile, user_query, chat):
    n = file_path.filename
    ext = '.' + n.rsplit('.', 1)[-1] if '.' in n else ''
    if ext == '.pdf':
        temp_path = f"temp_{n}"
        with open(temp_path, "wb") as f_out:
            f_out.write(file_path.file.read())
        extracted_text = extract_text_from_pdf(temp_path)
    else:
        extracted_text = extract_text_from_image(file_path)

    if extracted_text == "":
        return {"response": ""}

    prompt = "Data I have: " + extracted_text + "\n\n" + "My doubt: " + user_query
    begin_from = len(prompt)

    response = prompt[begin_from:]
    response = chat(prompt, max_new_tokens=100)[0]["generated_text"][begin_from:]

    return {"response": response}