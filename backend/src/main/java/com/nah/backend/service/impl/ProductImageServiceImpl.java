package com.nah.backend.service.impl;

import com.nah.backend.dto.product.ProductImageDTO;
import com.nah.backend.dto.product.request.BatchProductImageRequest;
import com.nah.backend.dto.product.request.CreateProductImageRequest;
import com.nah.backend.model.Product;
import com.nah.backend.model.ProductImage;
import com.nah.backend.repository.ProductImageRepository;
import com.nah.backend.repository.ProductRepository;
import com.nah.backend.service.ProductImageService;
import com.nah.backend.util.FileUploadUtil;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final FileUploadUtil fileUploadUtil;
    
    private static final String PRODUCT_IMAGE_UPLOAD_DIR = "images/product";

    @Override
    public List<ProductImageDTO> getImagesByProductId(Integer productId) {
        return productImageRepository.findByProductProductId(productId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductImageDTO addProductImage(CreateProductImageRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));

        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setImageUrl(request.getImageUrl());

        ProductImage savedImage = productImageRepository.save(productImage);
        return convertToDTO(savedImage);
    }

    @Override
    @Transactional
    public void deleteProductImage(Integer imageId) {
        ProductImage productImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hình ảnh sản phẩm với id: " + imageId));

        // Xóa file vật lý
        String imageUrl = productImage.getImageUrl();
        boolean fileDeleted = fileUploadUtil.deleteFile(imageUrl);

        productImageRepository.delete(productImage);

        if (!fileDeleted) {
            System.out.println("Cảnh báo: Không thể xóa file " + imageUrl);
        }
    }

    @Override
    @Transactional
    public List<ProductImageDTO> processBatchProductImages(BatchProductImageRequest request) {
        // Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));
        
        // Lấy danh sách ảnh hiện tại của sản phẩm
        List<ProductImage> currentImages = productImageRepository.findByProductProductId(request.getProductId());
        
        // Tạo tập hợp các ID ảnh hiện có
        Set<Integer> existingImageIds = currentImages.stream()
                .map(ProductImage::getProductImageId)
                .collect(Collectors.toSet());
        
        // Tập hợp chứa ID của các ảnh sẽ được giữ lại
        Set<Integer> retainedImageIds = new HashSet<>();
        
        // Danh sách ảnh sẽ được lưu (cả thêm mới và cập nhật)
        List<ProductImage> imagesToSave = new ArrayList<>();
        
        // Danh sách ID ảnh cần xóa
        List<Integer> imageIdsToDelete = new ArrayList<>();
        
        // Xử lý từng mục trong request
        for (BatchProductImageRequest.ProductImageItem item : request.getImages()) {
            if (item.getProductImageId() != null) {
                // Trường hợp ảnh đã tồn tại
                if (existingImageIds.contains(item.getProductImageId())) {
                    if (Boolean.TRUE.equals(item.getToDelete())) {
                        // Đánh dấu để xóa ảnh này
                        imageIdsToDelete.add(item.getProductImageId());
                    } else {
                        // Cập nhật ảnh
                        ProductImage existingImage = currentImages.stream()
                                .filter(img -> img.getProductImageId().equals(item.getProductImageId()))
                                .findFirst()
                                .orElseThrow(); // Không cần xử lý exception vì đã kiểm tra tồn tại ở trên
                        
                        existingImage.setImageUrl(item.getImageUrl());
                        imagesToSave.add(existingImage);
                        retainedImageIds.add(item.getProductImageId());
                    }
                } else {
                    throw new EntityNotFoundException("Không tìm thấy ảnh với id: " + item.getProductImageId());
                }
            } else {
                // Trường hợp thêm ảnh mới
                ProductImage newImage = new ProductImage();
                newImage.setProduct(product);
                newImage.setImageUrl(item.getImageUrl());
                imagesToSave.add(newImage);
            }
        }
        
        // Nếu có yêu cầu xóa các ảnh không có trong danh sách
        if (Boolean.TRUE.equals(request.getDeleteOthers())) {
            for (ProductImage image : currentImages) {
                if (!retainedImageIds.contains(image.getProductImageId()) && 
                    !imageIdsToDelete.contains(image.getProductImageId())) {
                    imageIdsToDelete.add(image.getProductImageId());
                }
            }
        }
        
        // Xóa các ảnh đã đánh dấu
        for (Integer idToDelete : imageIdsToDelete) {
            productImageRepository.deleteById(idToDelete);
        }
        
        // Lưu các ảnh mới và cập nhật
        productImageRepository.saveAll(imagesToSave);
        
        // Trả về danh sách ảnh hiện tại của sản phẩm
        return productImageRepository.findByProductProductId(request.getProductId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ProductImageDTO> uploadProductImages(Integer productId, List<MultipartFile> files) {
        // Kiểm tra sản phẩm tồn tại
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + productId));
        
        List<ProductImage> imagesToSave = new ArrayList<>();
        
        try {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // Lưu file và lấy đường dẫn tương đối
                    String fileUrl = fileUploadUtil.saveFile(file, "product_" + productId, PRODUCT_IMAGE_UPLOAD_DIR);
                    
                    // Tạo đối tượng ProductImage mới
                    ProductImage newImage = new ProductImage();
                    newImage.setProduct(product);
                    newImage.setImageUrl(fileUrl);
                    imagesToSave.add(newImage);
                }
            }
            
            // Lưu tất cả các ảnh vào database
            List<ProductImage> savedImages = productImageRepository.saveAll(imagesToSave);
            
            // Chuyển đổi và trả về danh sách DTO
            return savedImages.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file: " + e.getMessage(), e);
        }
    }

    private ProductImageDTO convertToDTO(ProductImage productImage) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setProductImageId(productImage.getProductImageId());
        dto.setImageUrl(productImage.getImageUrl());
        return dto;
    }
} 