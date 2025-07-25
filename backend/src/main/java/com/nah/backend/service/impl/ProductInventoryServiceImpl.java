package com.nah.backend.service.impl;

import com.nah.backend.model.OrderItem;
import com.nah.backend.model.Product;
import com.nah.backend.repository.ProductRepository;
import com.nah.backend.service.ProductInventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductInventoryServiceImpl implements ProductInventoryService {

    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void decreaseStock(List<OrderItem> orderItems) {
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            int quantity = orderItem.getQuantity();
            
            if (!hasEnoughStock(product, quantity)) {
                throw new IllegalStateException(
                    "Không đủ hàng trong kho cho sản phẩm " + product.getProductName() +
                    ". Chỉ còn " + product.getStockQuantity() + " sản phẩm."
                );
            }
            
            // Giảm số lượng tồn kho và lưu lại
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);
            
            log.info("Đã giảm số lượng tồn kho của sản phẩm {} từ {} xuống {}", 
                product.getProductId(), 
                product.getStockQuantity() + quantity, 
                product.getStockQuantity());
        }
    }

    @Override
    @Transactional
    public void increaseStock(List<OrderItem> orderItems) {
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            int quantity = orderItem.getQuantity();
            
            // Tăng số lượng tồn kho và lưu lại
            product.setStockQuantity(product.getStockQuantity() + quantity);
            productRepository.save(product);
            
            log.info("Đã tăng số lượng tồn kho của sản phẩm {} từ {} lên {}", 
                product.getProductId(), 
                product.getStockQuantity() - quantity, 
                product.getStockQuantity());
        }
    }

    @Override
    public boolean hasEnoughStock(Product product, int quantity) {
        // Nếu sản phẩm không tồn tại hoặc bị vô hiệu hóa
        if (product == null || !product.getIsEnabled()) {
            return false;
        }
        
        // Kiểm tra số lượng tồn kho
        return product.getStockQuantity() >= quantity;
    }
} 