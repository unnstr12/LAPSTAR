package com.nah.backend.repository;

import com.nah.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByParentIsNull();
    
    @Query("SELECT c FROM Category c WHERE c.parent.categoryId = ?1")
    List<Category> findByParentId(Integer parentId);
    
    boolean existsByCategoryName(String categoryName);
    
    @Query("SELECT c.categoryId FROM Category c WHERE c.parent.categoryId = :rootCategoryId")
    List<Integer> findSubCategoryIds(Integer rootCategoryId);
} 