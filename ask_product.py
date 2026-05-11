import os
import sys
import logging
import asyncio
from typing import Optional

from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
print("DEBUG KEY:", os.getenv("GROQ_API_KEY"))
# API KEY Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("Chưa set GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)

# Retry
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
)
async def ask_ai_model(question: str, context: str) -> str:
    prompt = (
        f"Bạn là trợ lý bán hàng chuyên nghiệp của LapStar. Hãy trả lời câu hỏi của khách hàng một cách thân thiện, chính xác và hữu ích.\n\n"
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
        f"- Format CHÍNH XÁC: [PRODUCT_ID: số_id]\n"
        f"- PHẢI có ít nhất 1 ID nếu gợi ý sản phẩm\n\n"
    )

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Bạn là trợ lý bán hàng chuyên nghiệp."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Lỗi Groq API: {e}")
        raise


# --- FastAPI App ---
app = FastAPI(
    title="Groq Question Answering API",
    description="API dùng Groq thay Gemini",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev cho dễ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response
class QuestionRequest(BaseModel):
    question: str
    context: str
    conversationHistory: Optional[str] = None

class AskResponse(BaseModel):
    answer: str


@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        conversation_context = ""
        if request.conversationHistory:
            conversation_context = f"\nLỊCH SỬ CUỘC TRÒ CHUYỆN:\n{request.conversationHistory}\n"

        full_context = f"{conversation_context}\n{request.context}"

        response = await ask_ai_model(request.question, full_context)

        if not response:
            raise HTTPException(status_code=500, detail="Không nhận được phản hồi từ AI")

        return {"answer": response}

    except Exception as e:
        logger.error(f"Lỗi AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {"message": "Groq API đang chạy 🚀"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)