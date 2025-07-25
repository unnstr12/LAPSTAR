package com.nah.backend.service;

import com.nah.backend.dto.common.PageResponse;
import com.nah.backend.dto.user.UserDTO;
import com.nah.backend.dto.user.request.CreateUserRequest;
import com.nah.backend.dto.user.request.UpdateUserRequest;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService extends UserDetailsService {
    List<UserDTO> getAllUsers();
    PageResponse<UserDTO> getAllUsersPaged(int pageNo, int pageSize, String sortBy, String sortDir, String searchKeyword, Integer roleId);
    UserDTO getUserById(Integer id);
    UserDTO createUser(CreateUserRequest request);
    UserDTO updateUser(Integer id, UpdateUserRequest request);
    void deleteUser(Integer id);
    void deleteSelfAccount(String email);
    UserDTO findByEmail(String email);
    List<UserDTO> getUsersByRole(Integer roleId);
    UserDTO uploadAvatar(Integer userId, MultipartFile file) throws IOException;
    UserDTO removeAvatar(Integer userId);
    UserDTO changePassword(Integer userId, String currentPassword, String newPassword);
    boolean processForgotPassword(String email);
    UserDTO resetPasswordWithToken(String token, String newPassword);
    UserDTO enableUser(Integer id);
    UserDTO changeUserRole(Integer userId, Integer roleId, String currentUserEmail);
} 