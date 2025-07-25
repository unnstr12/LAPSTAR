package com.nah.backend.controller.admin;

import com.nah.backend.dto.banner.BannerDTO;
import com.nah.backend.dto.banner.request.CreateBannerRequest;
import com.nah.backend.dto.banner.request.UpdateBannerRequest;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.service.BannerService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminBannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BannerDTO>>> getAllBanners() {
        List<BannerDTO> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(ApiResponse.success(banners));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBannerById(@PathVariable Long id) {
        try {
            BannerDTO banner = bannerService.getBannerById(id);
            return ResponseEntity.ok(ApiResponse.success(banner));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBanner(
            @RequestParam("name") String name,
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "isActive", required = false, defaultValue = "true") Boolean isActive,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            CreateBannerRequest request = new CreateBannerRequest();
            request.setName(name);
            request.setUrl(url);
            request.setIsActive(isActive);

            BannerDTO createdBanner = bannerService.createBanner(request, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm banner thành công", createdBanner));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable Long id, @Valid @RequestBody UpdateBannerRequest request) {
        try {
            BannerDTO updatedBanner = bannerService.updateBanner(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật banner thành công", updatedBanner));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBannerImage(@PathVariable Long id, @RequestParam("image") MultipartFile imageFile) {
        try {
            BannerDTO updatedBanner = bannerService.updateBannerImage(id, imageFile);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật ảnh banner thành công", updatedBanner));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        try {
            bannerService.deleteBanner(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa banner thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleBannerStatus(@PathVariable Long id) {
        try {
            BannerDTO updatedBanner = bannerService.toggleBannerStatus(id);
            String message = updatedBanner.getIsActive() 
                    ? "Banner đã được kích hoạt" 
                    : "Banner đã được vô hiệu hóa";
            return ResponseEntity.ok(ApiResponse.success(message, updatedBanner));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 