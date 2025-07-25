package com.nah.backend.service.impl;

import com.nah.backend.model.PasswordResetToken;
import com.nah.backend.repository.PasswordResetTokenRepository;
import com.nah.backend.service.PasswordResetTokenService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Value("${app.password-reset.token-expiration-minutes:30}")
    private int tokenExpirationMinutes;

    @Override
    @Transactional
    public String generateToken(String email) {
        // Kiểm tra và vô hiệu hóa token cũ nếu có
        passwordResetTokenRepository.findByEmailAndUsedFalse(email)
                .ifPresent(token -> {
                    token.setUsed(true);
                    passwordResetTokenRepository.save(token);
                });
        
        // Tạo token mới
        PasswordResetToken passwordResetToken = new PasswordResetToken(email, tokenExpirationMinutes);
        passwordResetTokenRepository.save(passwordResetToken);
        
        return passwordResetToken.getToken();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(passwordResetToken -> !passwordResetToken.isUsed() && !passwordResetToken.isExpired())
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public String getEmailFromToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(PasswordResetToken::getEmail)
                .orElseThrow(() -> new EntityNotFoundException("Token không hợp lệ"));
    }

    @Override
    @Transactional
    public void setTokenUsed(String token) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Token không hợp lệ"));
        
        passwordResetToken.setUsed(true);
        passwordResetTokenRepository.save(passwordResetToken);
    }
} 