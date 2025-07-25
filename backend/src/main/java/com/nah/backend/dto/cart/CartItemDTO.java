package com.nah.backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Integer cartItemId;
    private Integer productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Double price;
    private Double subTotal;
} 