package com.nah.backend.service;

public interface EmailService {

    void sendHtmlEmail(String to, String subject, String htmlContent);
    
    void sendPasswordResetLink(String to, String resetLink);
} 