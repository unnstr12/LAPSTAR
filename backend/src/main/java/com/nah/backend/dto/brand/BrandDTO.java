package com.nah.backend.dto.brand;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandDTO {
    private Integer brandId;
    private String brandName;
    private String description;
    private String image;
} 