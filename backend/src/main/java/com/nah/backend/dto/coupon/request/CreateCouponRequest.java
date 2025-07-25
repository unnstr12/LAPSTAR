package com.nah.backend.dto.coupon.request;

import com.nah.backend.model.Coupon;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCouponRequest {
    
    @NotBlank(message = "Mã coupon không được để trống")
    private String couponCode;
    
    @NotNull(message = "Loại giảm giá không được để trống")
    private Coupon.CouponDiscountType discountType;
    
    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Positive(message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;
    
    @PositiveOrZero(message = "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
    private BigDecimal minimumOrderAmount;
    
    @PositiveOrZero(message = "Số lần sử dụng tối đa phải lớn hơn hoặc bằng 0")
    private Integer usageLimit;
    
    private boolean isActive = true;
} 