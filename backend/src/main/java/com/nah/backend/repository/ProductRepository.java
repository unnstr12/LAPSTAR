package com.nah.backend.repository;

import com.nah.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryCategoryId(Integer categoryId);
    
    List<Product> findByBrandBrandId(Integer brandId);
    
    List<Product> findByIsEnabled(Boolean isEnabled);
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = ?1")
    Page<Product> findByCategoryId(Integer categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :rootCategoryId OR p.category.parent.categoryId = :rootCategoryId")
    Page<Product> findByRootCategoryId(Integer rootCategoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE (p.category.categoryId = :rootCategoryId OR p.category.parent.categoryId = :rootCategoryId) AND p.productName LIKE %:keyword%")
    Page<Product> searchByNameAndRootCategory(Integer rootCategoryId, String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.brand.brandId = ?1")
    Page<Product> findByBrandId(Integer brandId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.productName LIKE %?1%")
    Page<Product> searchByName(String keyword, Pageable pageable);
    
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity > 0")
    Page<Product> findInStock(Pageable pageable);
    
    List<Product> findTop8ByIsEnabledTrueOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isEnabled = true ORDER BY p.createdAt DESC")
    List<Product> findLatestProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.productName = :productName AND p.productId <> :productId AND p.isEnabled = true")
    List<Product> findByProductNameAndIdNot(String productName, Integer productId);

    @Query(value = "SELECT p.* FROM products p " +
           "WHERE p.category_id = :categoryId " +
           "AND p.product_id <> :excludeProductId " +
           "AND p.is_enabled = true " +
           "ORDER BY ABS(p.price - :targetPrice) ASC " +
           "LIMIT 4", nativeQuery = true)
    List<Product> findRelatedProductsByCategoryAndPrice(
            @Param("categoryId") Integer categoryId,
            @Param("excludeProductId") Integer excludeProductId,
            @Param("targetPrice") BigDecimal targetPrice);

    Optional<Product> findBySku(String sku);
    
    boolean existsBySkuAndProductIdNot(String sku, Integer productId);
    
    boolean existsBySku(String sku);

    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryIds IS NULL OR p.category.categoryId IN :categoryIds) AND " +
           "(:brandIds IS NULL OR p.brand.brandId IN :brandIds) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findFilteredProducts(
            @Param("categoryIds") List<Integer> categoryIds,
            @Param("brandIds") List<Integer> brandIds,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryIds IS NULL OR p.category.categoryId IN :categoryIds) AND " +
           "(:brandIds IS NULL OR p.brand.brandId IN :brandIds) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "p.productName LIKE %:keyword%")
    Page<Product> findFilteredProducts(
            @Param("categoryIds") List<Integer> categoryIds,
            @Param("brandIds") List<Integer> brandIds,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable);
} 