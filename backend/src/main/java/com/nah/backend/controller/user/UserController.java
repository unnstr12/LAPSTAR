package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.user.UserDTO;
import com.nah.backend.dto.user.request.ChangePasswordRequest;
import com.nah.backend.dto.user.request.UpdateUserRequest;
import com.nah.backend.model.Role;
import com.nah.backend.service.RoleService;
import com.nah.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    private final RoleService roleService;
    
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        try {
            UserDTO user = userService.findByEmail(email);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateUserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        try {
            UserDTO currentUser = userService.findByEmail(email);
            
            // Không cho phép thay đổi email
            request.setEmail(email);
            
            // Người dùng không được phép thay đổi vai trò của họ
            Role currentRole = roleService.getRoleByName(currentUser.getRoleName());
            request.setRoleId(currentRole.getRoleId());
            
            // Người dùng không được phép xóa tài khoản của họ qua API này
            request.setIsDeleted(false);
            
            UserDTO updatedUser = userService.updateUser(currentUser.getUserId(), request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin cá nhân thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteSelfAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        try {
            userService.deleteSelfAccount(email);
            return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        try {
            // Lấy thông tin người dùng hiện tại
            UserDTO currentUser = userService.findByEmail(email);
            
            // Sử dụng phương thức changePassword từ service
            UserDTO updatedUser = userService.changePassword(
                currentUser.getUserId(), 
                request.getCurrentPassword(), 
                request.getNewPassword()
            );
            
            return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn file để upload"));
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        try {
            // Lấy thông tin người dùng hiện tại
            UserDTO currentUser = userService.findByEmail(email);
            
            // Sử dụng phương thức uploadAvatar từ service
            UserDTO updatedUser = userService.uploadAvatar(currentUser.getUserId(), file);
            
            return ResponseEntity.ok(ApiResponse.success("Upload avatar thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi khi upload avatar: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeAvatar() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        try {
            // Lấy thông tin người dùng hiện tại
            UserDTO currentUser = userService.findByEmail(email);
            
            // Sử dụng phương thức removeAvatar từ service
            UserDTO updatedUser = userService.removeAvatar(currentUser.getUserId());
            
            return ResponseEntity.ok(ApiResponse.success("Xóa avatar thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
} 