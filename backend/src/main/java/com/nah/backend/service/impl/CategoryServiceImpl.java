package com.nah.backend.service.impl;

import com.nah.backend.dto.category.CategoryDTO;
import com.nah.backend.dto.category.request.CreateCategoryRequest;
import com.nah.backend.dto.category.request.UpdateCategoryRequest;
import com.nah.backend.model.Category;
import com.nah.backend.repository.CategoryRepository;
import com.nah.backend.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDTO> getRootCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(this::convertToDTOWithChildren)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDTO> getSubcategories(Integer parentId) {
        return categoryRepository.findByParentId(parentId).stream()
                .map(this::convertToDTOWithChildren)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với id: " + id));
        return convertToDTOWithChildren(category);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new IllegalArgumentException("Danh mục với tên này đã tồn tại");
        }

        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với id: " + request.getParentId()));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Integer id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với id: " + id));
        
        // Kiểm tra nếu tên danh mục mới đã tồn tại (trừ chính danh mục này)
        if (!category.getCategoryName().equals(request.getCategoryName()) && 
                categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new IllegalArgumentException("Danh mục với tên này đã tồn tại");
        }

        category.setCategoryName(request.getCategoryName());
        
        // Cập nhật danh mục cha
        if (request.getParentId() != null) {
            // Kiểm tra xem danh mục cha có phải là chính nó không
            if (request.getParentId().equals(id)) {
                throw new IllegalArgumentException("Danh mục không thể là cha của chính nó");
            }
            
            // Kiểm tra xem danh mục cha có phải là con của nó không (để tránh tạo chu trình)
            if (isChildOf(request.getParentId(), id)) {
                throw new IllegalArgumentException("Không thể chọn danh mục con làm danh mục cha");
            }
            
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với id: " + request.getParentId()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        Category updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với id: " + id));
        
        // Kiểm tra xem danh mục có chứa danh mục con không
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            throw new IllegalStateException("Không thể xóa danh mục vì chứa danh mục con");
        }
        
        // Kiểm tra xem danh mục có chứa sản phẩm không
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new IllegalStateException("Không thể xóa danh mục vì đang có sản phẩm thuộc danh mục này");
        }
        
        categoryRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }
    
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getCategoryId());
        }
        
        return dto;
    }
    
    private CategoryDTO convertToDTOWithChildren(Category category) {
        CategoryDTO dto = convertToDTO(category);
        
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            List<CategoryDTO> childrenDTO = category.getChildren().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            dto.setChildren(childrenDTO);
        } else {
            dto.setChildren(new ArrayList<>());
        }
        
        return dto;
    }
    
    // Kiểm tra xem potentialChild có phải là con (hoặc cháu, chắt,...) của parentId không
    private boolean isChildOf(Integer potentialChild, Integer parentId) {
        if (potentialChild == null) {
            return false;
        }
        
        Category category = categoryRepository.findById(potentialChild).orElse(null);
        if (category == null || category.getParent() == null) {
            return false;
        }
        
        Integer currentParentId = category.getParent().getCategoryId();
        
        if (currentParentId.equals(parentId)) {
            return true;
        }
        
        return isChildOf(currentParentId, parentId);
    }
} 