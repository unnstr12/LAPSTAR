package com.nah.backend.dto.user.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeUserRoleRequest {
    @NotNull(message = "ID vai trò không được để trống")
    private Integer roleId;
} 