package com.nah.backend.controller.user;

import com.nah.backend.dto.banner.BannerDTO;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    /**
     * Lấy tất cả banner đang hoạt động
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BannerDTO>>> getActiveBanners() {
        List<BannerDTO> banners = bannerService.getAllActiveBanners();
        return ResponseEntity.ok(ApiResponse.success(banners));
    }

    /**
     * Lấy banner theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBannerById(@PathVariable Long id) {
        try {
            BannerDTO banner = bannerService.getBannerById(id);
            // Chỉ trả về banner nếu đang active
            if (banner.getIsActive()) {
                return ResponseEntity.ok(ApiResponse.success(banner));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 