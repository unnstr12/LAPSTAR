package com.nah.backend.service;

import com.nah.backend.dto.category.CategoryDTO;
import com.nah.backend.dto.category.request.CreateCategoryRequest;
import com.nah.backend.dto.category.request.UpdateCategoryRequest;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    
    List<CategoryDTO> getRootCategories();
    
    List<CategoryDTO> getSubcategories(Integer parentId);
    
    CategoryDTO getCategoryById(Integer id);
    
    CategoryDTO createCategory(CreateCategoryRequest request);
    
    CategoryDTO updateCategory(Integer id, UpdateCategoryRequest request);
    
    void deleteCategory(Integer id);
    
    boolean existsByName(String categoryName);
} 