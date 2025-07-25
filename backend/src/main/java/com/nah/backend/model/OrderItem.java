package com.nah.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String productName;
    
    private String productImage;
    
    private Double price;
    
    @Column(nullable = false)
    private Integer quantity;
    
    // Phương thức tính tổng tiền của mỗi mục
    public Double getSubTotal() {
        return price * quantity;
    }
} 