package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.brand.BrandDTO;
import com.nah.backend.service.BrandService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDTO>>> getAllBrands() {
        List<BrandDTO> brands = brandService.getAllBrands();
        return ResponseEntity.ok(ApiResponse.success(brands));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable Integer id) {
        try {
            BrandDTO brand = brandService.getBrandById(id);
            return ResponseEntity.ok(ApiResponse.success(brand));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<?> getBrandsByCategoryId(@PathVariable Integer categoryId) {
        try {
            List<BrandDTO> brands = brandService.getBrandsByCategoryId(categoryId);
            
            if (brands.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Không tìm thấy thương hiệu nào thuộc danh mục này", brands));
            }
            
            return ResponseEntity.ok(ApiResponse.success(brands));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi tìm thương hiệu theo danh mục: " + e.getMessage()));
        }
    }
} 