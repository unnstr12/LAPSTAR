package com.nah.backend.service;

import java.util.List;
import java.util.Map;

public interface ChatbotService {
    Map<String, Object> processQuestion(String question);
    Map<String, Object> processQuestion(String question, List<String> previousQuestions);
    String getProductContext();
} 