package com.nah.backend.repository;

import com.nah.backend.model.Attribute;
import com.nah.backend.model.Product;
import com.nah.backend.model.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductAttributeValueRepository extends JpaRepository<ProductAttributeValue, Integer> {
    
    // Tìm tất cả attribute values của một product
    @Query("SELECT pav FROM ProductAttributeValue pav WHERE pav.product.productId = :productId")
    List<ProductAttributeValue> findByProductId(@Param("productId") Integer productId);
    
    // Tìm attribute value cụ thể của product và attribute
    @Query("SELECT pav FROM ProductAttributeValue pav WHERE pav.product.productId = :productId AND pav.attribute.attributeId = :attributeId")
    Optional<ProductAttributeValue> findByProductIdAndAttributeId(@Param("productId") Integer productId, @Param("attributeId") Integer attributeId);
    
    // Tìm tất cả giá trị distinct của một attribute
    @Query("SELECT DISTINCT pav.value FROM ProductAttributeValue pav WHERE pav.attribute.attributeId = :attributeId")
    List<String> findDistinctValuesByAttributeId(@Param("attributeId") Integer attributeId);
    
    // Xóa tất cả attribute values của một product
    @Modifying
    @Transactional
    @Query("DELETE FROM ProductAttributeValue pav WHERE pav.product.productId = :productId")
    void deleteByProductId(@Param("productId") Integer productId);

    // Kiểm tra xem product có attribute này không
    boolean existsByProductAndAttribute(Product product, Attribute attribute);
    
    // Tìm attribute values của nhiều products
    @Query("SELECT pav FROM ProductAttributeValue pav WHERE pav.product.productId IN :productIds")
    List<ProductAttributeValue> findByProductIdIn(@Param("productIds") List<Integer> productIds);
    
    // Tìm tất cả attribute values theo attribute ID
    List<ProductAttributeValue> findByAttributeAttributeId(Integer attributeId);
    
    // Tìm attribute values theo product và attribute (sử dụng Spring Data JPA naming)
    Optional<ProductAttributeValue> findByProductAndAttribute(Product product, Attribute attribute);
    
    // Xóa attribute values theo attribute ID
    @Modifying
    @Transactional
    @Query("DELETE FROM ProductAttributeValue pav WHERE pav.attribute.attributeId = :attributeId")
    void deleteByAttributeId(@Param("attributeId") Integer attributeId);
    
    // Đếm số lượng products có attribute cụ thể
    @Query("SELECT COUNT(DISTINCT pav.product.productId) FROM ProductAttributeValue pav WHERE pav.attribute.attributeId = :attributeId")
    Long countProductsByAttributeId(@Param("attributeId") Integer attributeId);
} 