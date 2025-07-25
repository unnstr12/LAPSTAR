package com.nah.backend.dto.banner.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBannerRequest {
    @NotBlank(message = "Tên banner không được để trống")
    private String name;
    
    private String imageUrl;
    
    private String url;
    
    private Boolean isActive;
} 