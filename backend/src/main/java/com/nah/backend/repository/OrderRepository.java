package com.nah.backend.repository;

import com.nah.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Tìm tất cả đơn hàng của một người dùng
    List<Order> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
    
    // Tìm tất cả đơn hàng của một người dùng với phân trang
    Page<Order> findByUserUserId(Integer userId, Pageable pageable);
    
    // Tìm đơn hàng theo trạng thái
    List<Order> findByStatus(Order.OrderStatus status);
    
    // Tìm đơn hàng theo trạng thái với phân trang
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    
    // Tìm đơn hàng theo trạng thái và thời gian giao hàng trước thời điểm chỉ định
    List<Order> findByStatusAndDeliveredAtBefore(Order.OrderStatus status, LocalDateTime dateTime);
    
    // Tìm đơn hàng của một người dùng theo trạng thái
    List<Order> findByUserUserIdAndStatus(Integer userId, Order.OrderStatus status);
    
    // Tìm kiếm đơn hàng với nhiều tiêu chí lọc
    @Query("SELECT o FROM Order o WHERE " +
           "(:keyword IS NULL OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR o.createdAt <= :endDate) AND " +
           "(:userEmail IS NULL OR LOWER(o.userEmail) LIKE LOWER(CONCAT('%', :userEmail, '%')))")
    Page<Order> findWithFilters(
            @Param("keyword") String keyword,
            @Param("status") Order.OrderStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("userEmail") String userEmail,
            Pageable pageable);
            
    // Tìm kiếm đơn hàng theo ID
    @Query("SELECT o FROM Order o WHERE o.orderId = :orderId")
    Page<Order> findByOrderId(@Param("orderId") Integer orderId, Pageable pageable);
} 