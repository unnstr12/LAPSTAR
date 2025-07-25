package com.nah.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductDTO {
    private Integer productId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer soldQuantity;
} 