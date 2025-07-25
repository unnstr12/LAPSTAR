package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.product.AttributeDTO;
import com.nah.backend.service.AttributeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attributes")
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttributeDTO>>> getAllAttributes() {
        List<AttributeDTO> attributes = attributeService.getAllAttributes();
        return ResponseEntity.ok(ApiResponse.success(attributes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttributeById(@PathVariable Integer id) {
        try {
            AttributeDTO attribute = attributeService.getAttributeById(id);
            return ResponseEntity.ok(ApiResponse.success(attribute));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<AttributeDTO>>> getAttributesByCategoryId(@PathVariable Integer categoryId) {
        List<AttributeDTO> attributes = attributeService.getAttributesByCategoryId(categoryId);
        return ResponseEntity.ok(ApiResponse.success(attributes));
    }
} 