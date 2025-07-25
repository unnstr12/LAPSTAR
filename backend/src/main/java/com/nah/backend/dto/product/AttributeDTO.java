package com.nah.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttributeDTO {
    private Integer attributeId;
    private String attributeName;
    private String attributeUnit;
} 