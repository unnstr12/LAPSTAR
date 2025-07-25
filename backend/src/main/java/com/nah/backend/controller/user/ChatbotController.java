package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    
    private final ChatbotService chatbotService;

    /**
     * API endpoint để botchat hỏi về sản phẩm
     * @param request Câu hỏi của người dùng và các câu hỏi trước đó
     * @return Câu trả lời từ AI kèm theo link sản phẩm nếu có
     */
    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, Object> request) {
        try {
            String question = (String) request.get("question");
            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Câu hỏi không được để trống"));
            }

            // Lấy danh sách câu hỏi trước đó (có thể null)
            @SuppressWarnings("unchecked")
            List<String> previousQuestions = (List<String>) request.get("previousQuestions");
            
            logger.info("Nhận câu hỏi: '{}' với {} câu hỏi trước đó", 
                       question, previousQuestions != null ? previousQuestions.size() : 0);

            // Sử dụng service để xử lý câu hỏi với context
            Map<String, Object> chatbotResponse = chatbotService.processQuestion(question, previousQuestions);
            return ResponseEntity.ok(ApiResponse.success(chatbotResponse));
            
        } catch (Exception e) {
            logger.error("Lỗi khi xử lý câu hỏi chatbot: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Không thể xử lý câu hỏi. Vui lòng thử lại sau."));
        }
    }
} 