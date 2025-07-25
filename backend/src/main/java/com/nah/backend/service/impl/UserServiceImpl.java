package com.nah.backend.service.impl;

import com.nah.backend.dto.common.PageResponse;
import com.nah.backend.dto.user.UserDTO;
import com.nah.backend.dto.user.request.CreateUserRequest;
import com.nah.backend.dto.user.request.UpdateUserRequest;
import com.nah.backend.model.Role;
import com.nah.backend.model.User;
import com.nah.backend.repository.RoleRepository;
import com.nah.backend.repository.UserRepository;
import com.nah.backend.service.EmailService;
import com.nah.backend.service.PasswordResetTokenService;
import com.nah.backend.service.UserService;
import com.nah.backend.util.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileUploadUtil fileUploadUtil;
    private final EmailService emailService;
    private final PasswordResetTokenService passwordResetTokenService;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    private static final String USER_UPLOAD_DIR = "images/user";

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        if (user.getIsDeleted()) {
            throw new UsernameNotFoundException("Tài khoản người dùng đã bị vô hiệu hóa: " + email);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName()))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserDTO> getAllUsersPaged(int pageNo, int pageSize, String sortBy, String sortDir, String searchKeyword, Integer roleId) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        PageRequest pageable = PageRequest.of(pageNo, pageSize, sort);
        
        Page<User> userPage;
        
        if (roleId != null) {
            if (searchKeyword != null && !searchKeyword.isEmpty()) {
                userPage = userRepository.searchByRoleIdAndEmailOrName(roleId, searchKeyword, pageable);
            } else {
                userPage = userRepository.findByRoleIdPaged(roleId, pageable);
            }
        } else {
            if (searchKeyword != null && !searchKeyword.isEmpty()) {
                userPage = userRepository.searchByEmailOrName(searchKeyword, pageable);
            } else {
                userPage = userRepository.findAll(pageable);
            }
        }
        
        Page<UserDTO> userDTOPage = userPage.map(this::convertToDTO);
        return PageResponse.fromPage(userDTOPage);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + id));
        return convertToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò với id: " + request.getRoleId()));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setAvatar(request.getAvatar());
        user.setRole(role);
        user.setIsDeleted(false); // Mặc định khi tạo

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Integer id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + id));

        if (!user.getEmail().equals(request.getEmail())) {
            throw new IllegalArgumentException("Email không được phép cập nhật");
        }

        // Cập nhật thông tin cơ bản
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        
        // Cập nhật avatar nếu có
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        
        // Cập nhật vai trò nếu được cung cấp
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò với id: " + request.getRoleId()));
        user.setRole(role);
        
        // Chỉ cập nhật mật khẩu nếu nó được cung cấp
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
             user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        
        // Cập nhật trạng thái isDeleted nếu được cung cấp
        if (request.getIsDeleted() != null) {
             user.setIsDeleted(request.getIsDeleted());
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Integer id) { // Soft delete
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + id));
        
        if (user.getRole() != null && user.getRole().getRoleName().equals("ADMIN")) {
            throw new IllegalArgumentException("Không thể vô hiệu hóa tài khoản Admin");
        }
        
        user.setIsDeleted(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteSelfAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        // Kiểm tra nếu người dùng có vai trò là admin (roleId = 3)
        if (user.getRole() != null && user.getRole().getRoleId() == 3) {
            // Đếm số lượng admin còn hoạt động (không bị xóa mềm)
            long activeAdminCount = userRepository.countByRoleIdAndIsDeletedFalse(3);
            
            // Nếu chỉ còn 1 admin duy nhất (chính là người dùng này), không cho phép xóa
            if (activeAdminCount <= 1) {
                throw new IllegalArgumentException("Không thể xóa tài khoản vì đây là Admin duy nhất còn hoạt động trong hệ thống");
            }
        }
        
        user.setIsDeleted(true);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO findByEmail(String email) {
         User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với email: " + email));
         return convertToDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByRole(Integer roleId) {
        if (!roleRepository.existsById(roleId)) {
             throw new EntityNotFoundException("Không tìm thấy vai trò với id: " + roleId);
        }
        return userRepository.findByRoleId(roleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public UserDTO uploadAvatar(Integer userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Không thể upload file trống");
        }
        
        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));
        
        // Xóa avatar cũ nếu có
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            fileUploadUtil.deleteFile(user.getAvatar());
        }
        
        // Lưu file mới vào thư mục con user và lấy đường dẫn
        String avatarUrl = fileUploadUtil.saveFile(file, "avatar_" + userId, USER_UPLOAD_DIR);
        
        // Cập nhật avatar cho user
        user.setAvatar(avatarUrl);
        user.setUpdatedAt(LocalDateTime.now());
        
        // Lưu thay đổi
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    @Override
    @Transactional
    public UserDTO removeAvatar(Integer userId) {
        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));
        
        // Xóa avatar cũ nếu có
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            fileUploadUtil.deleteFile(user.getAvatar());
        }
        
        // Cập nhật avatar thành null
        user.setAvatar(null);
        user.setUpdatedAt(LocalDateTime.now());
        
        // Lưu thay đổi
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserDTO changePassword(Integer userId, String currentPassword, String newPassword) {
        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));
        
        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác");
        }
        
        // Cập nhật mật khẩu mới
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        
        // Lưu thay đổi
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    @Transactional
    public boolean processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        if (user.getIsDeleted()) {
            throw new IllegalArgumentException("Tài khoản đã bị vô hiệu hóa");
        }
        
        // Tạo token reset password
        String token = passwordResetTokenService.generateToken(email);
        
        // Tạo đường link reset password
        String resetPasswordLink = frontendUrl + "/reset-password?token=" + token;
        
        // Gửi email chứa link reset password
        emailService.sendPasswordResetLink(email, resetPasswordLink);
        
        return true;
    }
    
    @Override
    @Transactional
    public UserDTO resetPasswordWithToken(String token, String newPassword) {
        if (!passwordResetTokenService.validateToken(token)) {
            throw new IllegalArgumentException("Token không hợp lệ hoặc đã hết hạn");
        }
        
        String email = passwordResetTokenService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        // Cập nhật mật khẩu mới
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        
        // Đánh dấu token đã sử dụng
        passwordResetTokenService.setTokenUsed(token);
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserDTO enableUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + id));
        
        if (!user.getIsDeleted()) {
            throw new IllegalArgumentException("Người dùng đã được kích hoạt rồi");
        }
        
        user.setIsDeleted(false);
        User enabledUser = userRepository.save(user);
        return convertToDTO(enabledUser);
    }

    @Override
    @Transactional
    public UserDTO changeUserRole(Integer userId, Integer roleId, String currentUserEmail) {
        // Tìm user cần thay đổi role
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));
        
        // Kiểm tra xem người dùng có đang thay đổi quyền của chính mình không
        if (user.getEmail().equals(currentUserEmail)) {
            throw new IllegalArgumentException("Không thể thay đổi quyền của chính mình");
        }
        
        // Tìm role mới
        Role newRole = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò với id: " + roleId));
        
        // Cập nhật role
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        
        return convertToDTO(updatedUser);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getAvatar(),
                user.getRole() != null ? user.getRole().getRoleName() : null, // Lấy tên vai trò
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getIsDeleted()
        );
    }
} 