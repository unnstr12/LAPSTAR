package com.nah.backend.dto.product.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductAttributeValueRequest {
    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer productId;
    
    @NotNull(message = "ID thuộc tính không được để trống")
    private Integer attributeId;
    
    private String value;
} 