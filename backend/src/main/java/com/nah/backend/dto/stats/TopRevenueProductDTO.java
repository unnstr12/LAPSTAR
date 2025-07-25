package com.nah.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopRevenueProductDTO {
    private Integer productId;
    private String productName;
    private String productImage;
    private Double price;
    private Double revenue;
    private Integer soldQuantity;
} 