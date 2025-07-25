package com.nah.backend.service;

import com.nah.backend.model.OrderItem;
import com.nah.backend.model.Product;

import java.util.List;

public interface ProductInventoryService {
    /**
     * Giảm số lượng tồn kho của sản phẩm khi đơn hàng được tạo
     * @param orderItems danh sách các mục trong đơn hàng
     * @throws IllegalStateException nếu số lượng tồn kho không đủ
     */
    void decreaseStock(List<OrderItem> orderItems);
    
    /**
     * Tăng số lượng tồn kho của sản phẩm khi đơn hàng bị hủy hoặc trả lại
     * @param orderItems danh sách các mục trong đơn hàng
     */
    void increaseStock(List<OrderItem> orderItems);
    
    /**
     * Kiểm tra xem số lượng tồn kho có đủ cho đơn hàng không
     * @param product sản phẩm cần kiểm tra
     * @param quantity số lượng cần kiểm tra
     * @return true nếu đủ hàng, false nếu không đủ
     */
    boolean hasEnoughStock(Product product, int quantity);
} 