package com.nah.backend.service;

public interface PasswordResetTokenService {
    String generateToken(String email);
    boolean validateToken(String token);
    String getEmailFromToken(String token);
    void setTokenUsed(String token);
} 