package com.nah.backend.repository;

import com.nah.backend.model.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    
    Optional<Coupon> findByCouponCode(String couponCode);
    
    List<Coupon> findByIsActiveTrue();
    
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND (c.usageLimit IS NULL OR c.usedCount < c.usageLimit)")
    List<Coupon> findActiveAndValidCoupons();
    
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND (c.usageLimit IS NULL OR c.usedCount < c.usageLimit) " +
           "AND (c.minimumOrderAmount IS NULL OR c.minimumOrderAmount <= :orderAmount)")
    List<Coupon> findValidCouponsForOrderAmount(BigDecimal orderAmount);
    
    // Phương thức tìm kiếm và phân trang
    @Query("SELECT c FROM Coupon c WHERE " +
           "(:keyword IS NULL OR LOWER(c.couponCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive)")
    Page<Coupon> searchCoupons(
            @Param("keyword") String keyword,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
            
    // Tìm kiếm coupon theo ID
    @Query("SELECT c FROM Coupon c WHERE c.couponId = :couponId")
    Page<Coupon> findCouponById(@Param("couponId") Integer couponId, Pageable pageable);
} 