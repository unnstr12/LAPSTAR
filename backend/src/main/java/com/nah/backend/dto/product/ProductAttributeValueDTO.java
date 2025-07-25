package com.nah.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributeValueDTO {
    private Integer productAttributeValueId;
    private String attributeName;
    private String attributeUnit;
    private String value;
} 