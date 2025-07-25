package com.nah.backend.service.impl;

import com.nah.backend.dto.coupon.CouponDTO;
import com.nah.backend.dto.coupon.request.CreateCouponRequest;
import com.nah.backend.dto.coupon.request.UpdateCouponRequest;
import com.nah.backend.model.Coupon;
import com.nah.backend.repository.CouponRepository;
import com.nah.backend.service.CouponService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CouponDTO> getAllCoupons() {
        List<Coupon> coupons = couponRepository.findAll();
        return coupons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<CouponDTO> searchCoupons(String keyword, Boolean isActive, Pageable pageable) {
        Page<Coupon> couponPage = couponRepository.searchCoupons(keyword, isActive, pageable);
        
        // Chuyển đổi Page<Coupon> sang Page<CouponDTO>
        List<CouponDTO> couponDTOs = couponPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
                
        return new PageImpl<>(couponDTOs, pageable, couponPage.getTotalElements());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<CouponDTO> findCouponById(Integer couponId, Pageable pageable) {
        Page<Coupon> couponPage = couponRepository.findCouponById(couponId, pageable);
        
        // Chuyển đổi Page<Coupon> sang Page<CouponDTO>
        List<CouponDTO> couponDTOs = couponPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
                
        return new PageImpl<>(couponDTOs, pageable, couponPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponDTO> getActiveCoupons() {
        List<Coupon> coupons = couponRepository.findByIsActiveTrue();
        return coupons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CouponDTO getCouponById(Integer id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với id: " + id));
        return convertToDTO(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponDTO getCouponByCode(String couponCode) {
        Coupon coupon = couponRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với mã: " + couponCode));
        return convertToDTO(coupon);
    }

    @Override
    @Transactional
    public CouponDTO createCoupon(CreateCouponRequest request) {
        // Kiểm tra xem coupon code đã tồn tại chưa
        if (couponRepository.findByCouponCode(request.getCouponCode()).isPresent()) {
            throw new IllegalArgumentException("Mã coupon '" + request.getCouponCode() + "' đã tồn tại");
        }
        
        // Kiểm tra giá trị discount dựa theo loại
        validateDiscountValue(request.getDiscountType(), request.getDiscountValue());
        
        Coupon coupon = new Coupon();
        coupon.setCouponCode(request.getCouponCode());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.isActive());
        coupon.setUsedCount(0);
        
        Coupon savedCoupon = couponRepository.save(coupon);
        return convertToDTO(savedCoupon);
    }

    @Override
    @Transactional
    public CouponDTO updateCoupon(Integer id, UpdateCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với id: " + id));
        
        // Kiểm tra xem coupon code đã tồn tại ở coupon khác chưa
        couponRepository.findByCouponCode(request.getCouponCode())
                .ifPresent(existingCoupon -> {
                    if (!existingCoupon.getCouponId().equals(id)) {
                        throw new IllegalArgumentException("Mã coupon '" + request.getCouponCode() + "' đã tồn tại");
                    }
                });
        
        // Kiểm tra giá trị discount dựa theo loại
        validateDiscountValue(request.getDiscountType(), request.getDiscountValue());
        
        coupon.setCouponCode(request.getCouponCode());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.getIsActive());
        
        Coupon updatedCoupon = couponRepository.save(coupon);
        return convertToDTO(updatedCoupon);
    }

    @Override
    @Transactional
    public void activateCoupon(Integer id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với id: " + id));
        coupon.setActive(true);
        couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void deactivateCoupon(Integer id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với id: " + id));
        coupon.setActive(false);
        couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void deleteCoupon(Integer id) {
        if (!couponRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy coupon với id: " + id);
        }
        couponRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isValidCoupon(String couponCode, BigDecimal orderAmount) {
        return couponRepository.findByCouponCode(couponCode)
                .map(coupon -> {
                    // Kiểm tra coupon có hoạt động không
                    if (!coupon.isActive()) {
                        return false;
                    }
                    
                    // Kiểm tra số lần sử dụng
                    if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
                        return false;
                    }
                    
                    // Kiểm tra đơn hàng tối thiểu
                    if (coupon.getMinimumOrderAmount() != null && orderAmount.compareTo(coupon.getMinimumOrderAmount()) < 0) {
                        return false;
                    }
                    
                    return true;
                })
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal applyCoupon(String couponCode, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với mã: " + couponCode));
        
        if (!isValidCoupon(couponCode, orderAmount)) {
            throw new IllegalArgumentException("Coupon không hợp lệ hoặc không áp dụng được cho đơn hàng này");
        }
        
        BigDecimal discountAmount;
        if (coupon.getDiscountType() == Coupon.CouponDiscountType.PERCENT) {
            // Nếu là phần trăm, tính toán số tiền giảm dựa trên tổng đơn hàng
            discountAmount = orderAmount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        } else {
            // Nếu là số tiền cố định
            discountAmount = coupon.getDiscountValue();
            // Không cho phép giảm giá vượt quá tổng đơn hàng
            if (discountAmount.compareTo(orderAmount) > 0) {
                discountAmount = orderAmount;
            }
        }
        
        return discountAmount;
    }

    @Override
    @Transactional
    public void incrementCouponUsage(String couponCode) {
        Coupon coupon = couponRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy coupon với mã: " + couponCode));
        
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
    }

    private void validateDiscountValue(Coupon.CouponDiscountType discountType, BigDecimal discountValue) {
        if (discountType == Coupon.CouponDiscountType.PERCENT) {
            // Nếu là phần trăm, giá trị phải từ 0 đến 100
            if (discountValue.compareTo(BigDecimal.ZERO) <= 0 || discountValue.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException("Giá trị phần trăm giảm giá phải nằm trong khoảng từ 0 đến 100");
            }
        } else {
            // Nếu là số tiền cố định, giá trị phải lớn hơn 0
            if (discountValue.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Giá trị giảm giá phải lớn hơn 0");
            }
        }
    }

    private CouponDTO convertToDTO(Coupon coupon) {
        CouponDTO dto = new CouponDTO();
        dto.setCouponId(coupon.getCouponId());
        dto.setCouponCode(coupon.getCouponCode());
        dto.setDiscountType(coupon.getDiscountType());
        dto.setDiscountValue(coupon.getDiscountValue());
        dto.setMinimumOrderAmount(coupon.getMinimumOrderAmount());
        dto.setUsageLimit(coupon.getUsageLimit());
        dto.setUsedCount(coupon.getUsedCount());
        dto.setActive(coupon.isActive());
        dto.setCreatedAt(coupon.getCreatedAt());
        dto.setUpdatedAt(coupon.getUpdatedAt());
        return dto;
    }
} 