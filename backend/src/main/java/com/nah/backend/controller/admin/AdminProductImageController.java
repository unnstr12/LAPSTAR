package com.nah.backend.controller.admin;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.product.ProductImageDTO;
import com.nah.backend.dto.product.request.BatchProductImageRequest;
import com.nah.backend.dto.product.request.CreateProductImageRequest;
import com.nah.backend.service.ProductImageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/product-images")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminProductImageController {

    private final ProductImageService productImageService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductImageDTO>>> getImagesByProductId(@PathVariable Integer productId) {
        List<ProductImageDTO> images = productImageService.getImagesByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(images));
    }

    @PostMapping
    public ResponseEntity<?> addProductImage(@Valid @RequestBody CreateProductImageRequest request) {
        try {
            ProductImageDTO addedImage = productImageService.addProductImage(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm hình ảnh sản phẩm thành công", addedImage));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<?> processBatchProductImages(@Valid @RequestBody BatchProductImageRequest request) {
        try {
            List<ProductImageDTO> updatedImages = productImageService.processBatchProductImages(request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật hình ảnh sản phẩm thành công", updatedImages));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/upload/{productId}")
    public ResponseEntity<?> uploadProductImages(
            @PathVariable Integer productId,
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<ProductImageDTO> uploadedImages = productImageService.uploadProductImages(productId, files);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Upload hình ảnh sản phẩm thành công", uploadedImages));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Integer id) {
        try {
            productImageService.deleteProductImage(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa hình ảnh sản phẩm thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 