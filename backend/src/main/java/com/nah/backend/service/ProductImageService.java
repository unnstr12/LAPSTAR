package com.nah.backend.service;

import com.nah.backend.dto.product.ProductImageDTO;
import com.nah.backend.dto.product.request.BatchProductImageRequest;
import com.nah.backend.dto.product.request.CreateProductImageRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductImageService {
    List<ProductImageDTO> getImagesByProductId(Integer productId);
    
    ProductImageDTO addProductImage(CreateProductImageRequest request);
    
    void deleteProductImage(Integer imageId);
    
    List<ProductImageDTO> processBatchProductImages(BatchProductImageRequest request);
    
    List<ProductImageDTO> uploadProductImages(Integer productId, List<MultipartFile> files);
} 