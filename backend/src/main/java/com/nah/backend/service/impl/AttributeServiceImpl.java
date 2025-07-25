package com.nah.backend.service.impl;

import com.nah.backend.dto.product.AttributeDTO;
import com.nah.backend.model.Attribute;
import com.nah.backend.repository.AttributeRepository;
import com.nah.backend.service.AttributeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttributeServiceImpl implements AttributeService {

    private final AttributeRepository attributeRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<AttributeDTO> getAllAttributes() {
        return attributeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public AttributeDTO getAttributeById(Integer id) {
        Attribute attribute = attributeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thuộc tính với id: " + id));
        return convertToDTO(attribute);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AttributeDTO> getAttributesByCategoryId(Integer categoryId) {
        return attributeRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private AttributeDTO convertToDTO(Attribute attribute) {
        return new AttributeDTO(
                attribute.getAttributeId(),
                attribute.getAttributeName(),
                attribute.getAttributeUnit()
        );
    }
} 