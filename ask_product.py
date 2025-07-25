import os
import sys
import logging
import asyncio
from typing import Optional, List, Dict

# It's recommended to manage dependencies via requirements.txt or pyproject.toml
# For example, ensure google-generativeai and tenacity are listed there.
# import subprocess
# try:
#     import pipmaster as pm
# except ImportError:
#     subprocess.check_call([sys.executable, "-m", "pip", "install", "pipmaster"])
#     import pipmaster as pm

# for lib in ["google-generativeai", "tenacity"]:
#     if not pm.is_installed(lib):
#         pm.install(lib)

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Biến môi trường API Key - WARNING: Hardcoding API keys is a security risk.
# Consider using environment variables: os.getenv("GOOGLE_API_KEY")
GOOGLE_API_KEY = "AIzaSyCGHTKiHGUVg7RjDHOQAaw-m6j-bRz1fTA"

class InvalidResponseError(Exception):
    pass

def configure_gemini(api_key: Optional[str] = None):
    key_to_use = api_key if api_key else GOOGLE_API_KEY
    if not key_to_use:
        logger.error("Google API Key is not set.")
        raise ValueError("Google API Key must be provided either as an argument or as GOOGLE_API_KEY.")
    genai.configure(api_key=key_to_use)
    logger.info("✅ Gemini API configured.")

# Các lỗi có thể retry
RETRYABLE_GEMINI_EXCEPTIONS = (
    google_exceptions.ResourceExhausted,
    google_exceptions.DeadlineExceeded,
    google_exceptions.ServiceUnavailable,
    google_exceptions.InternalServerError,
    InvalidResponseError,
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(RETRYABLE_GEMINI_EXCEPTIONS),
)
async def ask_gemini_model(question: str, context: str) -> str: # Renamed to avoid conflict if 'ask' is too generic
    """
    Trả lời câu hỏi dựa trên ngữ cảnh bằng Gemini.
    """
    # Ensure Gemini is configured before making a call
    # configure_gemini() # Called at app startup instead

    model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite") # Updated model name as gemini-2.5-pro-preview-05-06 may not be standard

    prompt = (
        f"Bạn là trợ lý bán hàng chuyên nghiệp của LapVN. Hãy trả lời câu hỏi của khách hàng một cách thân thiện, chính xác và hữu ích.\n\n"
        f"Thông tin sản phẩm:\n{context.strip()}\n\n"
        f"Câu hỏi của khách hàng: {question.strip()}\n\n"
        f"QUAN TRỌNG - Quy tắc trả lời:\n"
        f"1. Trả lời bằng tiếng Việt\n"
        f"2. PHẢI phân tích câu hỏi và tìm sản phẩm phù hợp nhất từ danh sách\n"
        f"3. Khi đề cập đến sản phẩm cụ thể, PHẢI nói tên sản phẩm chính xác như trong thông tin\n"
        f"4. Sử dụng markdown để format text đẹp:\n"
        f"   - Dùng **text** để làm nổi bật tên sản phẩm\n"
        f"   - Dùng ## cho tiêu đề phần\n"
        f"   - Dùng + cho thông số kỹ thuật của sản phẩm\n"
        f"   - Dùng - cho danh sách có dấu đầu dòng\n"
        f"   - Xuống dòng rõ ràng giữa các phần\n"
        f"5. CHỈ gợi ý sản phẩm khi thực sự phù hợp với câu hỏi\n"
        f"6. Đưa ra lời khuyên phù hợp với nhu cầu của khách hàng\n\n"
        f"SIÊU QUAN TRỌNG - Quy tắc về ID sản phẩm:\n"
        f"- Khi đề cập đến BẤT KỲ sản phẩm cụ thể nào, PHẢI thêm ID sản phẩm ở cuối câu trả lời\n"
        f"- Format CHÍNH XÁC: [PRODUCT_ID: số_id] (không được thay đổi format này)\n"
        f"- Ví dụ: [PRODUCT_ID: 11], [PRODUCT_ID: 25], [PRODUCT_ID: 33]\n"
        f"- PHẢI có ít nhất 1 ID nếu gợi ý sản phẩm\n"
        f"- Nếu không gợi ý sản phẩm cụ thể thì không cần thêm ID\n"
        f"- ID phải lấy từ thông tin sản phẩm được cung cấp\n\n"
        f"Hướng dẫn phân tích câu hỏi:\n"
        f"- Xác định nhu cầu: gaming, văn phòng, học tập, đồ họa, lập trình, edit video\n"
        f"- Xác định ngân sách: rẻ, tầm trung, cao cấp\n"
        f"- Xác định thương hiệu: Dell, HP, Lenovo, Asus, Acer, MSI\n"
        f"- Xác định thông số quan trọng: CPU, RAM, GPU, storage\n"
        f"- Tìm sản phẩm có ID phù hợp từ danh sách\n\n"
        f"Ví dụ format CHÍNH XÁC:\n"
        f"## Gợi ý sản phẩm phù hợp\n\n"
        f"Dựa trên nhu cầu gaming của bạn, tôi gợi ý:\n\n"
        f"- **Dell G15**: Laptop gaming mạnh mẽ với card đồ họa RTX, giá 25.000.000 VNĐ\n"
        f"- **Lenovo Legion 5**: Hiệu năng cao, tản nhiệt tốt, phù hợp cho game nặng\n\n"
        f"## Thông số kỹ thuật\n\n"
        f"Các sản phẩm này đều có:\n\n"
        f"+ CPU: Intel Core i7 hoặc AMD Ryzen 7\n"
        f"+ RAM: 16GB DDR4\n"
        f"+ GPU: RTX 3060 hoặc RTX 4060\n"
        f"+ Storage: SSD 512GB\n\n"
        f"[PRODUCT_ID: 11]\n"
        f"[PRODUCT_ID: 25]\n\n"
        f"LƯU Ý QUAN TRỌNG:\n"
        f"- PHẢI thêm [PRODUCT_ID: số] ở cuối khi gợi ý sản phẩm cụ thể\n"
        f"- Không được bỏ qua bước này\n"
        f"- ID phải chính xác từ thông tin được cung cấp\n"
        f"- Format: [PRODUCT_ID: số] - không được thay đổi"
    )

    try:
        response = await model.generate_content_async(prompt, stream=False)

        if not hasattr(response, "text") or not response.text:
            reason_detail = "Unknown"
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                reason_detail = response.prompt_feedback.block_reason.name
            elif response.candidates and response.candidates[0].finish_reason:
                reason_detail = response.candidates[0].finish_reason.name

            logger.warning(f"Gemini response was empty or blocked. Reason: {reason_detail}")
            # Check if parts are available and non-empty
            if hasattr(response, 'parts') and response.parts:
                logger.info(f"Response parts: {response.parts}")
                # Attempt to reconstruct text from parts if text is missing
                full_text = "".join(part.text for part in response.parts if hasattr(part, 'text'))
                if full_text:
                    logger.info("Reconstructed text from parts.")
                    return full_text.strip()
            
            raise InvalidResponseError(f"Empty or blocked response. Reason: {reason_detail}")

        return response.text.strip()
    except Exception as e:
        logger.error(f"Error during Gemini API call: {e}")
        raise # Re-raise after logging to be caught by retry or endpoint handler

# --- FastAPI App Setup ---
app = FastAPI(
    title="Gemini Question Answering API",
    description="API to answer questions based on provided context using Gemini.",
)

# Configure Gemini API at startup
try:
    configure_gemini()
except ValueError as e:
    logger.critical(f"Failed to configure Gemini API at startup: {e}")
    # Depending on desired behavior, you might exit or let it fail on first request
    # For now, log critical and it will fail if endpoint is hit without API key

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8082"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    context: str
    conversationHistory: Optional[str] = None

class AskResponse(BaseModel):
    answer: str

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        # Xây dựng prompt với lịch sử hội thoại
        conversation_context = ""
        if request.conversationHistory:
            conversation_context = f"\nLỊCH SỬ CUỘC TRÒ CHUYỆN:\n{request.conversationHistory}\n"
        
        # Sử dụng hàm ask_gemini_model đã có với context đầy đủ
        full_context = f"{conversation_context}\n{request.context}"
        
        response = await ask_gemini_model(request.question, full_context)
        
        if not response:
            raise HTTPException(status_code=500, detail="Không nhận được phản hồi từ AI")
        
        return {"answer": response}
        
    except Exception as e:
        logger.error(f"Lỗi khi gọi Gemini API: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi AI service: {str(e)}")

@app.get("/")
async def root():
    return {"message": "FastAPI Gemini Service đang chạy"}

# To run this FastAPI app, save it as e.g., ask_product_api.py and run:
# uvicorn ask_product_api:app --reload --port 8001
# Ensure GOOGLE_API_KEY is set if not hardcoding.

if __name__ == "__main__":
    # This allows running the FastAPI app directly using 'python ask_product.py'
    # You might want to use a different port if your main app uses 8000
    uvicorn.run(app, host="0.0.0.0", port=8001)