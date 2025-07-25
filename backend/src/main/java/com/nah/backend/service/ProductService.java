package com.nah.backend.service;

import com.nah.backend.dto.common.PageResponse;
import com.nah.backend.dto.product.ProductDTO;
import com.nah.backend.dto.product.request.CreateProductRequest;
import com.nah.backend.dto.product.request.UpdateProductRequest;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    
    PageResponse<ProductDTO> getAllProductsPaged(int pageNo, int pageSize, String sortBy, String sortDir, String searchKeyword);
    
    List<ProductDTO> getProductsByCategory(Integer categoryId);
    
    PageResponse<ProductDTO> getProductsByRootCategory(Integer rootCategoryId, int pageNo, int pageSize, 
                                                      String sortBy, String sortDir, String searchKeyword,
                                                      List<Integer> brandIds, List<Integer> categoryIds, 
                                                      BigDecimal minPrice, BigDecimal maxPrice);
    
    List<ProductDTO> getProductsByBrand(Integer brandId);
    
    ProductDTO getProductById(Integer id);
    
    ProductDTO createProduct(CreateProductRequest request);
    
    ProductDTO updateProduct(Integer id, UpdateProductRequest request);
        
    void enableProduct(Integer id);
    
    void disableProduct(Integer id);
    
    List<ProductDTO> getLatestProducts();
    
    ProductDTO updateStockQuantity(Integer productId, Integer quantity);
    
    List<ProductDTO> getProductsWithSameName(Integer productId);
    
    List<ProductDTO> getRelatedProductsByCategoryAndPrice(Integer productId);
} 