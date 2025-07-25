package com.nah.backend.dto.coupon;

import com.nah.backend.model.Coupon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO {
    private Integer couponId;
    private String couponCode;
    private Coupon.CouponDiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 