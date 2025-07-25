package com.nah.backend.dto.banner.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBannerRequest {
    @NotBlank(message = "Tên banner không được để trống")
    private String name;
    
    private String url;
    
    private Boolean isActive = true;
} 