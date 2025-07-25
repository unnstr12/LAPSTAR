package com.nah.backend.dto.brand.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBrandRequest {
    @NotBlank(message = "Tên thương hiệu không được để trống")
    private String brandName;
    
    private String description;

    private String image;
} 