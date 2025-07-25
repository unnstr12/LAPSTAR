package com.nah.backend.repository;

import com.nah.backend.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductProductId(Integer productId);
    
    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.productId IN ?1")
    List<ProductImage> findByProduct_ProductIdIn(List<Integer> productIds);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM ProductImage pi WHERE pi.product.productId = ?1")
    void deleteByProductId(Integer productId);
} 