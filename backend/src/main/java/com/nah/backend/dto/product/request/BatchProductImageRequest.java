package com.nah.backend.dto.product.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchProductImageRequest {
    
    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer productId;
    
    @NotEmpty(message = "Danh sách hình ảnh không được để trống")
    @Valid
    private List<ProductImageItem> images;
    
    // Cho biết có xóa các ảnh hiện có không nằm trong danh sách gửi lên hay không
    private Boolean deleteOthers = false;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImageItem {
        // ID của productImage, null nếu thêm mới
        private Integer productImageId;
        
        @NotNull(message = "URL hình ảnh không được để trống")
        private String imageUrl;
        
        // Nếu là true, ảnh sẽ bị xóa. Chỉ áp dụng khi productImageId không null
        private Boolean toDelete = false;
    }
} 