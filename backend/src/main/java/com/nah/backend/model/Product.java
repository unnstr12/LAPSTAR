package com.nah.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(nullable = false)
    private String productName;

    @Column(unique = true)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(nullable = false)
    private BigDecimal price;
    
    @PositiveOrZero(message = "Giá khuyến mãi phải lớn hơn hoặc bằng 0")
    private BigDecimal discountPrice;
    
    @PositiveOrZero(message = "Phần trăm giảm giá phải lớn hơn hoặc bằng 0")
    private Integer discountPercent;

    @Column(columnDefinition = "TEXT")
    private String description;

    @PositiveOrZero(message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer stockQuantity;

    @Column(nullable = false)
    private Boolean isEnabled;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private Set<ProductAttributeValue> attributeValues;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        // Cập nhật discountPercent nếu discountPrice thay đổi
        updateDiscountPercent();
    }
    
    private void updateDiscountPercent() {
        if (discountPrice == null) {
            this.discountPercent = null;
        } else if (price != null && price.compareTo(BigDecimal.ZERO) > 0) {
            // Đảm bảo discountPrice < price
            if (discountPrice.compareTo(price) >= 0) {
                throw new IllegalArgumentException("Giá khuyến mãi phải nhỏ hơn giá gốc");
            }
            
            // Tính discountPercent là phần nguyên của (discountPrice / price * 100)
            BigDecimal percent = BigDecimal.ONE.subtract(discountPrice.divide(price, 2, java.math.RoundingMode.HALF_UP))
                    .multiply(BigDecimal.valueOf(100));
            this.discountPercent = percent.intValue();
        }
    }
    
    // Lấy giá cuối cùng (có tính đến giảm giá nếu có)
    public BigDecimal getFinalPrice() {
        if (discountPrice != null) {
            return discountPrice;
        }
        return price;
    }
}