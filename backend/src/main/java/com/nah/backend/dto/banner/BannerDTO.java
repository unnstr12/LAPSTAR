package com.nah.backend.dto.banner;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private String url;
    private Boolean isActive;
    private LocalDateTime createdAt;
} 