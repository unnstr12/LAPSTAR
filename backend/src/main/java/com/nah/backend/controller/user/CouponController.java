package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.coupon.CouponDTO;
import com.nah.backend.service.CouponService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getCouponByCode(@PathVariable String code) {
        try {
            CouponDTO coupon = couponService.getCouponByCode(code);
            return ResponseEntity.ok(ApiResponse.success(coupon));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {
        try {
            boolean isValid = couponService.isValidCoupon(code, orderAmount);
            if (isValid) {
                // Tính và trả về số tiền giảm giá
                BigDecimal discountAmount = couponService.applyCoupon(code, orderAmount);
                return ResponseEntity.ok(ApiResponse.success("Mã giảm giá hợp lệ", discountAmount));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Mã giảm giá không hợp lệ hoặc không áp dụng được cho đơn hàng này"));
            }
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 