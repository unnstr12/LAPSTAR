package com.nah.backend.dto.product;

import com.nah.backend.dto.brand.BrandDTO;
import com.nah.backend.dto.category.CategoryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Integer productId;
    private String productName;
    private String sku;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer discountPercent;
    private String description;
    private Integer stockQuantity;
    private Boolean isEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Thông tin liên quan
    private BrandDTO brand;
    private CategoryDTO category;
    private List<ProductImageDTO> images;
    private List<ProductAttributeValueDTO> attributeValues;
} 