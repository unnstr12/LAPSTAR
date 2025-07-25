package com.nah.backend.repository;

import com.nah.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    // Tìm tất cả các mục trong một đơn hàng
    List<OrderItem> findByOrderOrderId(Integer orderId);
    
    // Đếm số lượng sản phẩm đã bán
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.productId = :productId AND oi.order.status <> 'CANCELLED'")
    Integer countSoldProducts(Integer productId);
} 