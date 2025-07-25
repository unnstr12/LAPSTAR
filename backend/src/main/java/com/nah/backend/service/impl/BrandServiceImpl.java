package com.nah.backend.service.impl;

import com.nah.backend.dto.brand.BrandDTO;
import com.nah.backend.dto.brand.request.CreateBrandRequest;
import com.nah.backend.dto.brand.request.UpdateBrandRequest;
import com.nah.backend.model.Brand;
import com.nah.backend.repository.BrandRepository;
import com.nah.backend.repository.CategoryRepository;
import com.nah.backend.service.BrandService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDTO getBrandById(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thương hiệu với id: " + id));
        return convertToDTO(brand);
    }

    @Override
    @Transactional
    public BrandDTO createBrand(CreateBrandRequest request) {
        if (brandRepository.existsByBrandName(request.getBrandName())) {
            throw new IllegalArgumentException("Thương hiệu với tên này đã tồn tại");
        }

        Brand brand = new Brand();
        brand.setBrandName(request.getBrandName());
        brand.setDescription(request.getDescription());
        brand.setImage(request.getImage());

        Brand savedBrand = brandRepository.save(brand);
        return convertToDTO(savedBrand);
    }

    @Override
    @Transactional
    public BrandDTO updateBrand(Integer id, UpdateBrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thương hiệu với id: " + id));
        
        // Kiểm tra nếu tên thương hiệu mới đã tồn tại (trừ chính thương hiệu này)
        if (!brand.getBrandName().equals(request.getBrandName()) && 
                brandRepository.existsByBrandName(request.getBrandName())) {
            throw new IllegalArgumentException("Thương hiệu với tên này đã tồn tại");
        }

        brand.setBrandName(request.getBrandName());
        brand.setDescription(request.getDescription());
        brand.setImage(request.getImage());

        Brand updatedBrand = brandRepository.save(brand);
        return convertToDTO(updatedBrand);
    }

    @Override
    @Transactional
    public void deleteBrand(Integer id) {
        if (!brandRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy thương hiệu với id: " + id);
        }
        
        // Kiểm tra xem thương hiệu có đang được sử dụng không
        Brand brand = brandRepository.findById(id).get();
        if (brand.getProducts() != null && !brand.getProducts().isEmpty()) {
            throw new IllegalStateException("Không thể xóa thương hiệu vì đang có sản phẩm sử dụng");
        }
        
        brandRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String brandName) {
        return brandRepository.existsByBrandName(brandName);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BrandDTO> getBrandsByCategoryId(Integer categoryId) {
        // Kiểm tra xem danh mục có tồn tại không
        if (!categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Không tìm thấy danh mục với id: " + categoryId);
        }
        
        // Lấy danh sách các thương hiệu có sản phẩm thuộc danh mục gốc hoặc các danh mục con
        List<Brand> brands = brandRepository.findBrandsByRootCategoryId(categoryId);
        
        return brands.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private BrandDTO convertToDTO(Brand brand) {
        return new BrandDTO(
                brand.getBrandId(),
                brand.getBrandName(),
                brand.getDescription(),
                brand.getImage()
        );
    }
} 