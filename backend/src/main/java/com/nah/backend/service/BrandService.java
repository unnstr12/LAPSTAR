package com.nah.backend.service;

import com.nah.backend.dto.brand.BrandDTO;
import com.nah.backend.dto.brand.request.CreateBrandRequest;
import com.nah.backend.dto.brand.request.UpdateBrandRequest;

import java.util.List;

public interface BrandService {
    List<BrandDTO> getAllBrands();
    
    BrandDTO getBrandById(Integer id);
    
    BrandDTO createBrand(CreateBrandRequest request);
    
    BrandDTO updateBrand(Integer id, UpdateBrandRequest request);
    
    void deleteBrand(Integer id);
    
    boolean existsByName(String brandName);
    
    List<BrandDTO> getBrandsByCategoryId(Integer categoryId);
} 