package com.nah.backend.controller.admin;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.product.ProductAttributeValueDTO;
import com.nah.backend.dto.product.request.BatchProductAttributeValueRequest;
import com.nah.backend.service.ProductAttributeValueService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/product-attributes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminProductAttributeValueController {

    private final ProductAttributeValueService productAttributeValueService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Set<ProductAttributeValueDTO>>> getAttributeValuesByProductId(@PathVariable Integer productId) {
        Set<ProductAttributeValueDTO> attributeValues = productAttributeValueService.getAttributeValuesByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(attributeValues));
    }

    @PostMapping("/batch")
    public ResponseEntity<?> addOrUpdateBatchAttributeValues(@Valid @RequestBody BatchProductAttributeValueRequest request) {
        try {
            List<ProductAttributeValueDTO> processedValues = productAttributeValueService.addOrUpdateBatchAttributeValues(request);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success("Cập nhật thuộc tính sản phẩm thành công", processedValues));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductAttributeValue(@PathVariable Integer id) {
        try {
            productAttributeValueService.deleteProductAttributeValue(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa thuộc tính sản phẩm thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 