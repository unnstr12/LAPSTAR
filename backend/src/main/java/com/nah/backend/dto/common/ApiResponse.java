package com.nah.backend.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Thành công", data);
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    public static ApiResponse<?> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
    
    public static ApiResponse<?> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
} 