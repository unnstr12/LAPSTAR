package com.nah.backend.service;

import com.nah.backend.dto.product.ProductAttributeValueDTO;
import com.nah.backend.dto.product.request.BatchProductAttributeValueRequest;
import com.nah.backend.dto.product.request.CreateProductAttributeValueRequest;

import java.util.List;
import java.util.Set;

public interface ProductAttributeValueService {
    Set<ProductAttributeValueDTO> getAttributeValuesByProductId(Integer productId);
    
    ProductAttributeValueDTO addProductAttributeValue(CreateProductAttributeValueRequest request);
    
    ProductAttributeValueDTO updateProductAttributeValue(Integer id, String value);
    
    void deleteProductAttributeValue(Integer id);
    
    List<ProductAttributeValueDTO> addOrUpdateBatchAttributeValues(BatchProductAttributeValueRequest request);
} 