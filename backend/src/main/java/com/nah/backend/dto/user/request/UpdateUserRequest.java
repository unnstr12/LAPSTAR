package com.nah.backend.dto.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự nếu được cung cấp")
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @Pattern(regexp = "^(0|\\+84)(\\d{9}|\\d{10})$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    private String address;

    private String avatar;

    private Integer roleId;
    
    private Boolean isDeleted;
} 