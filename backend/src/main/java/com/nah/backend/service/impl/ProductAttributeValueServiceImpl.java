package com.nah.backend.service.impl;

import com.nah.backend.dto.product.ProductAttributeValueDTO;
import com.nah.backend.dto.product.request.BatchProductAttributeValueRequest;
import com.nah.backend.dto.product.request.CreateProductAttributeValueRequest;
import com.nah.backend.model.Attribute;
import com.nah.backend.model.Product;
import com.nah.backend.model.ProductAttributeValue;
import com.nah.backend.repository.AttributeRepository;
import com.nah.backend.repository.ProductAttributeValueRepository;
import com.nah.backend.repository.ProductRepository;
import com.nah.backend.service.ProductAttributeValueService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductAttributeValueServiceImpl implements ProductAttributeValueService {

    private final ProductAttributeValueRepository productAttributeValueRepository;
    private final ProductRepository productRepository;
    private final AttributeRepository attributeRepository;

    @Override
    @Transactional(readOnly = true)
    public Set<ProductAttributeValueDTO> getAttributeValuesByProductId(Integer productId) {
        List<ProductAttributeValue> attributeValues = productAttributeValueRepository.findByProductId(productId);
        return attributeValues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public ProductAttributeValueDTO addProductAttributeValue(CreateProductAttributeValueRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));

        Attribute attribute = attributeRepository.findById(request.getAttributeId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thuộc tính với id: " + request.getAttributeId()));

        // Kiểm tra xem đã tồn tại thuộc tính này cho sản phẩm chưa
        if (productAttributeValueRepository.existsByProductAndAttribute(product, attribute)) {
            throw new IllegalArgumentException("Sản phẩm này đã có thuộc tính này rồi");
        }

        ProductAttributeValue productAttributeValue = new ProductAttributeValue();
        productAttributeValue.setProduct(product);
        productAttributeValue.setAttribute(attribute);
        productAttributeValue.setValue(request.getValue());

        ProductAttributeValue savedValue = productAttributeValueRepository.save(productAttributeValue);
        return convertToDTO(savedValue);
    }

    @Override
    @Transactional
    public ProductAttributeValueDTO updateProductAttributeValue(Integer id, String value) {
        ProductAttributeValue productAttributeValue = productAttributeValueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giá trị thuộc tính với id: " + id));

        productAttributeValue.setValue(value);
        ProductAttributeValue updatedValue = productAttributeValueRepository.save(productAttributeValue);
        return convertToDTO(updatedValue);
    }

    @Override
    @Transactional
    public void deleteProductAttributeValue(Integer id) {
        ProductAttributeValue productAttributeValue = productAttributeValueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giá trị thuộc tính với id: " + id));

        productAttributeValueRepository.delete(productAttributeValue);
    }

    @Override
    @Transactional
    public List<ProductAttributeValueDTO> addOrUpdateBatchAttributeValues(BatchProductAttributeValueRequest request) {
        // Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));
        
        List<ProductAttributeValue> processedValues = new ArrayList<>();
        
        for (BatchProductAttributeValueRequest.AttributeValueItem item : request.getAttributeValues()) {
            // Nếu có ID của ProductAttributeValue, thực hiện cập nhật
            if (item.getProductAttributeValueId() != null) {
                ProductAttributeValue existingValue = productAttributeValueRepository.findById(item.getProductAttributeValueId())
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giá trị thuộc tính với id: " + item.getProductAttributeValueId()));
                
                // Kiểm tra xem thuộc tính này có thuộc về sản phẩm không
                if (!existingValue.getProduct().getProductId().equals(request.getProductId())) {
                    throw new IllegalArgumentException("Giá trị thuộc tính với id " + item.getProductAttributeValueId() + " không thuộc về sản phẩm này");
                }
                
                // Cập nhật giá trị
                existingValue.setValue(item.getValue());
                processedValues.add(existingValue);
            } else {
                // Trường hợp thêm mới
                Attribute attribute = attributeRepository.findById(item.getAttributeId())
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thuộc tính với id: " + item.getAttributeId()));
                
                // Kiểm tra xem đã tồn tại thuộc tính này cho sản phẩm chưa
                Optional<ProductAttributeValue> existingAttributeValue = 
                        productAttributeValueRepository.findByProductIdAndAttributeId(product.getProductId(), attribute.getAttributeId());
                
                if (existingAttributeValue.isPresent()) {
                    // Nếu đã tồn tại, cập nhật giá trị
                    ProductAttributeValue existingValue = existingAttributeValue.get();
                    existingValue.setValue(item.getValue());
                    processedValues.add(existingValue);
                } else {
                    // Nếu chưa tồn tại, tạo mới
                    ProductAttributeValue newValue = new ProductAttributeValue();
                    newValue.setProduct(product);
                    newValue.setAttribute(attribute);
                    newValue.setValue(item.getValue());
                    processedValues.add(newValue);
                }
            }
        }
        
        // Lưu tất cả các giá trị đã xử lý
        List<ProductAttributeValue> savedValues = productAttributeValueRepository.saveAll(processedValues);
        
        // Chuyển đổi sang DTO và trả về
        return savedValues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductAttributeValueDTO convertToDTO(ProductAttributeValue productAttributeValue) {
        ProductAttributeValueDTO dto = new ProductAttributeValueDTO();
        dto.setProductAttributeValueId(productAttributeValue.getProductAttributeValueId());
        if (productAttributeValue.getAttribute() != null) {
            dto.setAttributeName(productAttributeValue.getAttribute().getAttributeName());
            dto.setAttributeUnit(productAttributeValue.getAttribute().getAttributeUnit());
        }
        dto.setValue(productAttributeValue.getValue());
        return dto;
    }
} 