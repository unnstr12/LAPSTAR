package com.nah.backend.repository;

import com.nah.backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    Optional<Brand> findByBrandName(String brandName);
    boolean existsByBrandName(String brandName);
    
    @Query("SELECT DISTINCT b FROM Brand b JOIN b.products p JOIN p.category c WHERE c.categoryId = :rootCategoryId OR c.parent.categoryId = :rootCategoryId")
    List<Brand> findBrandsByRootCategoryId(@Param("rootCategoryId") Integer rootCategoryId);
} 