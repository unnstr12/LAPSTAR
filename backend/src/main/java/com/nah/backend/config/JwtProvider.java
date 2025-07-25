package com.nah.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtProvider {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${jwt.secret:defaultSecretKeyThatShouldBeReplacedInProduction}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 giờ mặc định
    private long jwtExpiration;
    
    private final UserDetailsService userDetailsService;
    
    private SecretKey secretKey;
    
    // Thêm set để lưu trữ các token đã bị vô hiệu hóa (blacklist)
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    public JwtProvider(@Lazy UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }
    
    @PostConstruct
    protected void init() {
        // Mã hóa Base64 của chuỗi secret để tạo khóa an toàn
        String encodedSecret = Base64.getEncoder().encodeToString(jwtSecret.getBytes());
        secretKey = Keys.hmacShaKeyFor(encodedSecret.getBytes());
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }
    
    // Thêm token vào blacklist
    public void blacklistToken(String token) {
        logger.info("Thêm token vào blacklist: {} [phần đầu token]", token.substring(0, Math.min(10, token.length())));
        blacklistedTokens.add(token);
    }
    
    // Kiểm tra nếu token đã nằm trong blacklist
    public boolean isTokenBlacklisted(String token) {
        boolean isBlacklisted = blacklistedTokens.contains(token);
        logger.debug("Token {} có trong blacklist: {}", 
                token.substring(0, Math.min(10, token.length())), 
                isBlacklisted);
        return isBlacklisted;
    }

    public boolean validateToken(String token) {
        try {
            // Kiểm tra nếu token đã bị blacklist
            if (isTokenBlacklisted(token)) {
                logger.info("Token đã bị blacklist, không hợp lệ");
                return false;
            }
            
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("Token không hợp lệ: {}", e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUsernameFromToken(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        logger.info("Authorization header: {}", bearerToken);
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            logger.info("Đã tìm thấy token: {} [phần đầu token]", token.substring(0, Math.min(10, token.length())));
            return token;
        }
        
        logger.warn("Không tìm thấy token hoặc token không đúng định dạng Bearer");
        return null;
    }
} 