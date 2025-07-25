package com.nah.backend.repository;

import com.nah.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface StatsRepository extends JpaRepository<Order, Integer> {
    
    // Tổng doanh thu trong khoảng thời gian
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :startDate AND :endDate")
    Double getTotalRevenue(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Tổng số đơn hàng trong khoảng thời gian
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    Integer getTotalOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Tổng số sản phẩm bán ra trong khoảng thời gian
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi JOIN oi.order o WHERE o.createdAt BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'")
    Integer getTotalSoldProducts(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Số lượng đơn hàng theo trạng thái
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.createdAt BETWEEN :startDate AND :endDate")
    Integer getOrderCountByStatus(@Param("status") Order.OrderStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Số lượng người dùng mới đăng ký trong khoảng thời gian
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    Integer getNewUserCount(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Doanh thu theo giờ (cho trong ngày)
    @Query(value = "SELECT DATE_FORMAT(created_at, '%H:00') as name, SUM(total_amount) as value " +
            "FROM orders " +
            "WHERE payment_status = 'PAID' AND status = 'COMPLETED' AND created_at BETWEEN :startDate AND :endDate AND status = 'COMPLETED'" +
            "GROUP BY DATE_FORMAT(created_at, '%H:00') " +
            "ORDER BY MIN(created_at)",
            nativeQuery = true)
    List<Map<String, Object>> getRevenueByHour(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Doanh thu theo ngày
    @Query(value = "SELECT DATE_FORMAT(created_at, '%d/%m') as name, SUM(total_amount) as value " +
            "FROM orders " +
            "WHERE payment_status = 'PAID' AND status = 'COMPLETED' AND created_at BETWEEN :startDate AND :endDate AND status = 'COMPLETED'" +
            "GROUP BY DATE_FORMAT(created_at, '%d/%m') " +
            "ORDER BY MIN(created_at)",
            nativeQuery = true)
    List<Map<String, Object>> getRevenueByDay(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Doanh thu theo tuần
    @Query(value = "SELECT CONCAT('Tuần ', t.week - b.baseweek + 1) as name, t.value as value " +
            "FROM (SELECT WEEK(created_at) as week, SUM(total_amount) as value " +
            "      FROM orders " +
            "      WHERE payment_status = 'PAID' AND status = 'COMPLETED' AND created_at BETWEEN :startDate AND :endDate AND status = 'COMPLETED'" +
            "      GROUP BY WEEK(created_at)) t " +
            "CROSS JOIN (SELECT WEEK(DATE_FORMAT(:startDate, '%Y-%m-01')) as baseweek) b " +
            "ORDER BY t.week", nativeQuery = true)
    List<Map<String, Object>> getRevenueByWeek(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Doanh thu theo tháng
    @Query(value = "SELECT DATE_FORMAT(created_at, '%m/%Y') as name, SUM(total_amount) as value " +
            "FROM orders " +
            "WHERE payment_status = 'PAID' AND status = 'COMPLETED' AND created_at BETWEEN :startDate AND :endDate AND status = 'COMPLETED'" +
            "GROUP BY DATE_FORMAT(created_at, '%m/%Y') " +
            "ORDER BY MIN(created_at)",
            nativeQuery = true)
    List<Map<String, Object>> getRevenueByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Số lượng sản phẩm bán ra theo giờ (cho trong ngày)
    @Query(value = "SELECT DATE_FORMAT(o.created_at, '%H:00') as name, SUM(oi.quantity) as value " +
            "FROM orders o JOIN order_items oi ON o.order_id = oi.order_id " +
            "WHERE o.created_at BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
            "GROUP BY DATE_FORMAT(o.created_at, '%H:00') " +
            "ORDER BY MIN(o.created_at)",
            nativeQuery = true)
    List<Map<String, Object>> getSoldProductsByHour(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Số lượng sản phẩm bán ra theo ngày
    @Query(value = "SELECT DATE_FORMAT(o.created_at, '%d/%m') as name, SUM(oi.quantity) as value " +
            "FROM orders o JOIN order_items oi ON o.order_id = oi.order_id " +
            "WHERE o.created_at BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
            "GROUP BY DATE_FORMAT(o.created_at, '%d/%m') " +
            "ORDER BY MIN(o.created_at)",
            nativeQuery = true)
    List<Map<String, Object>> getSoldProductsByDay(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Số lượng sản phẩm bán ra theo tuần
    @Query(value = "SELECT CONCAT('Tuần ', t.week - b.baseweek + 1) as name, t.value as value " +
            "FROM (SELECT WEEK(o.created_at) as week, SUM(oi.quantity) as value " +
            "      FROM orders o JOIN order_items oi ON o.order_id = oi.order_id " +
            "      WHERE o.created_at BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
            "      GROUP BY WEEK(o.created_at)) t " +
            "CROSS JOIN (SELECT WEEK(DATE_FORMAT(:startDate, '%Y-%m-01')) as baseweek) b " +
            "ORDER BY t.week", nativeQuery = true)
    List<Map<String, Object>> getSoldProductsByWeek(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Số lượng sản phẩm bán ra theo tháng
    @Query(value = "SELECT DATE_FORMAT(o.created_at, '%m/%Y') as name, SUM(oi.quantity) as value " +
            "FROM orders o JOIN order_items oi ON o.order_id = oi.order_id " +
            "WHERE o.created_at BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
            "GROUP BY DATE_FORMAT(o.created_at, '%m/%Y') " +
            "ORDER BY MIN(o.created_at)",
            nativeQuery = true)
    List<Map<String, Object>> getSoldProductsByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
        
    // Danh sách đơn hàng gần đây
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> getRecentOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, org.springframework.data.domain.Pageable pageable);
    
    // Thống kê sản phẩm bán chạy
    @Query("SELECT p.productId as productId, p.productName as productName, MIN(pi.imageUrl) as productImage, " +
           "p.price as price, SUM(oi.quantity) as soldQuantity " +
           "FROM OrderItem oi JOIN oi.product p LEFT JOIN p.images pi JOIN oi.order o " +
           "WHERE o.createdAt BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
           "GROUP BY p.productId, p.productName, p.price " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Map<String, Object>> getTopProducts(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, org.springframework.data.domain.Pageable pageable);
        
    // Thống kê số lượng sản phẩm bán ra theo root category
    @Query(value = "SELECT " +
           "root_category.category_name as name, " +
           "SUM(oi.quantity) as value " +
           "FROM order_items oi " +
           "JOIN orders o ON oi.order_id = o.order_id " +
           "JOIN products p ON oi.product_id = p.product_id " +
           "JOIN categories c ON p.category_id = c.category_id " +
           "LEFT JOIN categories root_category ON " +
           "  CASE " +
           "    WHEN c.parent_id IS NULL THEN c.category_id " +
           "    ELSE c.parent_id " +
           "  END = root_category.category_id " +
           "WHERE o.created_at BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
           "GROUP BY root_category.category_id, root_category.category_name " +
           "ORDER BY SUM(oi.quantity) DESC", 
           nativeQuery = true)
    List<Map<String, Object>> getSoldProductsByRootCategory(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Thống kê doanh thu theo sản phẩm theo ngày
    @Query(value = "SELECT DATE_FORMAT(o.created_at, '%d/%m') as name, SUM(oi.price * oi.quantity) as value " +
           "FROM orders o JOIN order_items oi ON o.order_id = oi.order_id " +
           "WHERE oi.product_id = :productId AND o.payment_status = 'PAID' AND o.status = 'COMPLETED' AND o.created_at BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE_FORMAT(o.created_at, '%d/%m') " +
           "ORDER BY MIN(o.created_at)",
           nativeQuery = true)
    List<Map<String, Object>> getProductRevenueByDay(@Param("productId") Integer productId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Thống kê số lượng bán ra theo sản phẩm theo ngày
    @Query(value = "SELECT DATE_FORMAT(o.created_at, '%d/%m') as name, SUM(oi.quantity) as value " +
           "FROM orders o JOIN order_items oi ON o.order_id = oi.order_id " +
           "WHERE oi.product_id = :productId AND o.created_at BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'" +
           "GROUP BY DATE_FORMAT(o.created_at, '%d/%m') " +
           "ORDER BY MIN(o.created_at)",
           nativeQuery = true)
    List<Map<String, Object>> getProductSalesByDay(@Param("productId") Integer productId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Thống kê sản phẩm có doanh thu cao nhất
    @Query("SELECT p.productId as productId, p.productName as productName, MIN(pi.imageUrl) as productImage, " +
           "p.price as price, SUM(oi.price * oi.quantity) as revenue, SUM(oi.quantity) as soldQuantity " +
           "FROM OrderItem oi JOIN oi.product p LEFT JOIN p.images pi JOIN oi.order o " +
           "WHERE o.paymentStatus = 'PAID' AND o.status = 'COMPLETED' AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY p.productId, p.productName, p.price " +
           "ORDER BY SUM(oi.price * oi.quantity) DESC")
    List<Map<String, Object>> getTopRevenueProducts(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, org.springframework.data.domain.Pageable pageable);
} 