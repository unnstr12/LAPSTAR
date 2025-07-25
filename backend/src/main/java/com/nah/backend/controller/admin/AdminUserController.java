package com.nah.backend.controller.admin;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.common.PageResponse;
import com.nah.backend.dto.user.UserDTO;
import com.nah.backend.dto.user.request.CreateUserRequest;
import com.nah.backend.dto.user.request.UpdateUserRequest;
import com.nah.backend.dto.user.request.ChangeUserRoleRequest;
import com.nah.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
    
    @GetMapping("/paged")
    public ResponseEntity<?> getAllUsersPaged(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "userId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) Integer roleId) {
        
        try {
            PageResponse<UserDTO> response = userService.getAllUsersPaged(
                    pageNo, pageSize, sortBy, sortDir, searchKeyword, roleId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserDTO createdUser = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm người dùng thành công", createdUser));
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UpdateUserRequest request) {
        try {
            UserDTO updatedUser = userService.updateUser(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật người dùng thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa người dùng thành công (xóa mềm)"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/enable")
    public ResponseEntity<?> enableUser(@PathVariable Integer id) {
        try {
            UserDTO enabledUser = userService.enableUser(id);
            return ResponseEntity.ok(ApiResponse.success("Kích hoạt tài khoản thành công", enabledUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<?> getUsersByRole(@PathVariable Integer roleId) {
         try {
            List<UserDTO> users = userService.getUsersByRole(roleId);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/avatar")
    public ResponseEntity<?> uploadUserAvatar(@PathVariable Integer id, 
                                           @RequestParam("file") MultipartFile file) {
        try {
            UserDTO updatedUser = userService.uploadAvatar(id, file);
            return ResponseEntity.ok(ApiResponse.success("Upload avatar thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi upload avatar: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}/avatar")
    public ResponseEntity<?> removeUserAvatar(@PathVariable Integer id) {
        try {
            UserDTO updatedUser = userService.removeAvatar(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa avatar thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Integer id, 
            @Valid @RequestBody ChangeUserRoleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String currentUserEmail = userDetails.getUsername(); // Spring Security lưu email trong username
            UserDTO updatedUser = userService.changeUserRole(id, request.getRoleId(), currentUserEmail);
            return ResponseEntity.ok(ApiResponse.success("Thay đổi vai trò người dùng thành công", updatedUser));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 