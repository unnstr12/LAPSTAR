package com.nah.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Integer orderItemId;
    private Integer productId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer quantity;
    private Double subTotal;
} 