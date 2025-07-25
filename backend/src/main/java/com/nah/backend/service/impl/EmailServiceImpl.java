package com.nah.backend.service.impl;

import com.nah.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    
    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage());
        }
    }
    
    @Override
    public void sendPasswordResetLink(String to, String resetLink) {
        String subject = "[LapVN] Đặt lại mật khẩu tài khoản";
        
        String htmlContent = 
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                "<h2 style='color:rgb(28, 47, 170);'>Đặt lại mật khẩu LapVN</h2>" +
                "<p>Chào bạn,</p>" +
                "<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. " +
                "Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:</p>" +
                "<div style='margin: 25px 0;'>" +
                "<a href='" + resetLink + "' style='background-color: rgb(28, 47, 170); color: white; padding: 12px 24px; " +
                "text-decoration: none; border-radius: 4px; display: inline-block;'>Đặt lại mật khẩu</a>" +
                "</div>" +
                "<p>Hoặc bạn có thể sao chép và dán liên kết này vào trình duyệt:</p>" +
                "<p style='word-break: break-all; color: rgb(28, 47, 170);'>" + resetLink + "</p>" +
                "<p>Liên kết này sẽ hết hạn sau 30 phút.</p>" +
                "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>" +
                "<p>Trân trọng,<br>Đội ngũ LapVN</p>" +
                "</div>";
                
        sendHtmlEmail(to, subject, htmlContent);
        
        System.out.println("Đã gửi link đặt lại mật khẩu cho " + to + ": " + resetLink);
    }
} 