package com.nah.backend.dto.product.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String productName;
    
    @NotBlank(message = "Mã SKU không được để trống")
    private String sku;
    
    @NotNull(message = "Danh mục sản phẩm không được để trống")
    private Integer categoryId;
    
    @NotNull(message = "Thương hiệu sản phẩm không được để trống")
    private Integer brandId;
    
    @NotNull(message = "Giá sản phẩm không được để trống")
    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal price;
    
    @PositiveOrZero(message = "Giá khuyến mãi phải lớn hơn hoặc bằng 0")
    private BigDecimal discountPrice;
    
    private String description;
    
    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer stockQuantity;
} 