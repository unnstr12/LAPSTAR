package com.nah.backend.service;

import com.nah.backend.dto.product.AttributeDTO;
import java.util.List;

public interface AttributeService {
    List<AttributeDTO> getAllAttributes();
    
    AttributeDTO getAttributeById(Integer id);
    
    List<AttributeDTO> getAttributesByCategoryId(Integer categoryId);
} 