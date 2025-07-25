package com.nah.backend.controller.admin;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.coupon.CouponDTO;
import com.nah.backend.dto.coupon.request.CreateCouponRequest;
import com.nah.backend.dto.coupon.request.UpdateCouponRequest;
import com.nah.backend.service.CouponService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    public ResponseEntity<?> getAllCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            // Tạo đối tượng Sort dựa trên tham số sortBy và sortDir
            Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            
            Page<CouponDTO> coupons;
            
            // Xử lý trường hợp tìm kiếm theo ID coupon
            if (keyword != null && keyword.trim().matches("\\d+")) {
                try {
                    Integer couponId = Integer.parseInt(keyword.trim());
                    coupons = couponService.findCouponById(couponId, pageRequest);
                    if (coupons.getTotalElements() > 0) {
                        return ResponseEntity.ok(ApiResponse.success(coupons));
                    }
                } catch (NumberFormatException e) {
                    // Nếu không phải số hợp lệ, tiếp tục với tìm kiếm thông thường
                }
            }
            
            // Tìm kiếm với bộ lọc
            coupons = couponService.searchCoupons(keyword, isActive, pageRequest);
            return ResponseEntity.ok(ApiResponse.success(coupons));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể lấy danh sách coupon: " + e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CouponDTO>>> getActiveCoupons() {
        List<CouponDTO> coupons = couponService.getActiveCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCouponById(@PathVariable Integer id) {
        try {
            CouponDTO coupon = couponService.getCouponById(id);
            return ResponseEntity.ok(ApiResponse.success(coupon));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCoupon(@Valid @RequestBody CreateCouponRequest request) {
        try {
            CouponDTO createdCoupon = couponService.createCoupon(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo coupon thành công", createdCoupon));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable Integer id, @Valid @RequestBody UpdateCouponRequest request) {
        try {
            CouponDTO updatedCoupon = couponService.updateCoupon(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật coupon thành công", updatedCoupon));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateCoupon(@PathVariable Integer id) {
        try {
            couponService.activateCoupon(id);
            return ResponseEntity.ok(ApiResponse.success("Kích hoạt coupon thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateCoupon(@PathVariable Integer id) {
        try {
            couponService.deactivateCoupon(id);
            return ResponseEntity.ok(ApiResponse.success("Vô hiệu hóa coupon thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCoupon(@PathVariable Integer id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa coupon thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 