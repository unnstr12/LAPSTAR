package com.nah.backend.controller.user;

import com.nah.backend.config.JwtProvider;
import com.nah.backend.dto.auth.ForgotPasswordRequest;
import com.nah.backend.dto.auth.JwtResponse;
import com.nah.backend.dto.auth.LoginRequest;
import com.nah.backend.dto.auth.RegisterRequest;
import com.nah.backend.dto.auth.ResetPasswordRequest;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.user.UserDTO;
import com.nah.backend.dto.user.request.CreateUserRequest;
import com.nah.backend.model.Role;
import com.nah.backend.repository.RoleRepository;
import com.nah.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RoleRepository roleRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtProvider.generateToken(loginRequest.getEmail());
            
            UserDTO userDTO = userService.findByEmail(loginRequest.getEmail());
            
            return ResponseEntity.ok(
                    ApiResponse.success("Đăng nhập thành công", new JwtResponse(jwt, userDTO))
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Email hoặc mật khẩu không chính xác"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // Lấy token từ request
            String token = jwtProvider.resolveToken(request);
            logger.info("Đang xử lý logout với authorization header: {}", request.getHeader("Authorization"));
            
            if (token != null) {
                logger.info("Tìm thấy token: {} [phần đầu token]", token.substring(0, Math.min(10, token.length())));
                // Thêm token vào blacklist
                jwtProvider.blacklistToken(token);
                
                // Xóa authentication khỏi context
                SecurityContextHolder.clearContext();
                
                return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
            } else {
                logger.warn("Không tìm thấy token trong request");
                return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy token"));
            }
        } catch (Exception e) {
            logger.error("Lỗi khi đăng xuất", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Đăng xuất thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Lấy ROLE_USER mặc định khi người dùng đăng ký mới
            Role userRole = roleRepository.findByRoleName("USER")
                    .orElseThrow(() -> new RuntimeException("Role USER không tồn tại"));
            
            // Chuyển đổi từ RegisterRequest sang CreateUserRequest
            CreateUserRequest createUserRequest = new CreateUserRequest();
            createUserRequest.setEmail(registerRequest.getEmail());
            createUserRequest.setPassword(registerRequest.getPassword());
            createUserRequest.setFullName(registerRequest.getFullName());
            createUserRequest.setRoleId(userRole.getRoleId());
            createUserRequest.setAvatar("/uploads/images/user/default-avatar.jpg");
            
            UserDTO createdUser = userService.createUser(createUserRequest);
            
            // Tạo JWT token sau khi đăng ký thành công
            String jwt = jwtProvider.generateToken(registerRequest.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Đăng ký tài khoản thành công", new JwtResponse(jwt, createdUser)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Đăng ký tài khoản thất bại: " + e.getMessage()));
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            userService.processForgotPassword(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Hãy kiểm tra email của bạn!"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Không thể gửi link đặt lại mật khẩu: " + e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            UserDTO updatedUser = userService.resetPasswordWithToken(
                    request.getToken(), 
                    request.getNewPassword()
            );
            
            // Tạo JWT token sau khi đặt lại mật khẩu thành công
            String jwt = jwtProvider.generateToken(updatedUser.getEmail());
            
            return ResponseEntity.ok(
                    ApiResponse.success("Đặt lại mật khẩu thành công", new JwtResponse(jwt, updatedUser))
            );
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Không thể đặt lại mật khẩu: " + e.getMessage()));
        }
    }
} 