package com.nah.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    // Phương thức tiện ích để tính tổng tiền của item dựa trên giá cuối cùng của sản phẩm
    public Double getSubTotal() {
        if (product != null && product.getFinalPrice() != null) {
            return product.getFinalPrice().multiply(BigDecimal.valueOf(quantity)).doubleValue();
        }
        return 0.0;
    }
} 