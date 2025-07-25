package com.nah.backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Integer cartId;
    private Integer userId;
    private List<CartItemDTO> items;
    private Double totalAmount;
    private LocalDateTime updatedAt;
    private Integer totalItems; // Tổng số mặt hàng
} 