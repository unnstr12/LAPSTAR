package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.common.PageResponse;
import com.nah.backend.dto.product.ProductDTO;
import com.nah.backend.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }
    
    @GetMapping("/paged")
    public ResponseEntity<?> getAllProductsPaged(
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "productId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String searchKeyword) {
        
        try {
            PageResponse<ProductDTO> response = productService.getAllProductsPaged(
                    pageNo, pageSize, sortBy, sortDir, searchKeyword);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByCategory(@PathVariable Integer categoryId) {
        List<ProductDTO> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/root-category/{rootCategoryId}")
    public ResponseEntity<?> getProductsByRootCategory(
            @PathVariable Integer rootCategoryId,
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "productId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) List<Integer> brandIds,
            @RequestParam(required = false) List<Integer> categoryIds,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        try {
            PageResponse<ProductDTO> response = productService.getProductsByRootCategory(
                    rootCategoryId, pageNo, pageSize, sortBy, sortDir, searchKeyword,
                    brandIds, categoryIds, minPrice, maxPrice);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByBrand(@PathVariable Integer brandId) {
        List<ProductDTO> products = productService.getProductsByBrand(brandId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLatestProducts() {
        List<ProductDTO> latestProducts = productService.getLatestProducts();
        return ResponseEntity.ok(ApiResponse.success(latestProducts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success(product));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<?> getProductsWithSameName(@PathVariable Integer id) {
        try {
            List<ProductDTO> similarProducts = productService.getProductsWithSameName(id);
            
            if (similarProducts.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Không tìm thấy sản phẩm tương tự", similarProducts));
            }
            
            return ResponseEntity.ok(ApiResponse.success(similarProducts));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi tìm sản phẩm tương tự: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<?> getRelatedProducts(@PathVariable Integer id) {
        try {
            List<ProductDTO> relatedProducts = productService.getRelatedProductsByCategoryAndPrice(id);
            
            if (relatedProducts.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Không tìm thấy sản phẩm liên quan", relatedProducts));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Tìm thấy " + relatedProducts.size() + " sản phẩm liên quan", relatedProducts));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi tìm sản phẩm liên quan: " + e.getMessage()));
        }
    }

} 