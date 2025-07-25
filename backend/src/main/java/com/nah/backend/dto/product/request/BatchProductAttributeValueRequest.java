package com.nah.backend.dto.product.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchProductAttributeValueRequest {
    
    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer productId;
    
    @Valid
    private List<AttributeValueItem> attributeValues;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttributeValueItem {
        private Integer attributeId;
        
        private String value;
        
        private Integer productAttributeValueId;
    }
} 