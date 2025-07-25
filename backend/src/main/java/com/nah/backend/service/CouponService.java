package com.nah.backend.service;

import com.nah.backend.dto.coupon.CouponDTO;
import com.nah.backend.dto.coupon.request.CreateCouponRequest;
import com.nah.backend.dto.coupon.request.UpdateCouponRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {
    
    // Lấy tất cả coupon
    List<CouponDTO> getAllCoupons();
    
    // Lấy tất cả coupon có phân trang, tìm kiếm, lọc
    Page<CouponDTO> searchCoupons(String keyword, Boolean isActive, Pageable pageable);
    
    // Tìm coupon theo ID với phân trang
    Page<CouponDTO> findCouponById(Integer couponId, Pageable pageable);
    
    // Lấy tất cả coupon đang hoạt động
    List<CouponDTO> getActiveCoupons();
    
    // Lấy coupon theo ID
    CouponDTO getCouponById(Integer id);
    
    // Lấy coupon theo mã code
    CouponDTO getCouponByCode(String couponCode);
    
    // Tạo coupon mới
    CouponDTO createCoupon(CreateCouponRequest request);
    
    // Cập nhật coupon
    CouponDTO updateCoupon(Integer id, UpdateCouponRequest request);
    
    // Kích hoạt coupon
    void activateCoupon(Integer id);
    
    // Vô hiệu hóa coupon
    void deactivateCoupon(Integer id);
    
    // Xóa coupon
    void deleteCoupon(Integer id);
    
    // Kiểm tra coupon hợp lệ
    boolean isValidCoupon(String couponCode, BigDecimal orderAmount);
    
    // Áp dụng coupon vào đơn hàng và tính toán giá trị giảm giá
    BigDecimal applyCoupon(String couponCode, BigDecimal orderAmount);
    
    // Cập nhật số lần sử dụng của coupon
    void incrementCouponUsage(String couponCode);
} 