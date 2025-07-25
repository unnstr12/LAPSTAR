package com.nah.backend.dto.product.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductImageRequest {
    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer productId;
    
    @NotBlank(message = "URL hình ảnh không được để trống")
    private String imageUrl;
} 