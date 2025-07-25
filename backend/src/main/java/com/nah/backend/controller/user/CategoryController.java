package com.nah.backend.controller.user;

import com.nah.backend.dto.category.CategoryDTO;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/root")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getRootCategories() {
        List<CategoryDTO> rootCategories = categoryService.getRootCategories();
        return ResponseEntity.ok(ApiResponse.success(rootCategories));
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getSubcategories(@PathVariable Integer id) {
        List<CategoryDTO> subcategories = categoryService.getSubcategories(id);
        return ResponseEntity.ok(ApiResponse.success(subcategories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        try {
            CategoryDTO category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(ApiResponse.success(category));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 