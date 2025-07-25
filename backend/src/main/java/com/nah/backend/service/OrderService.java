package com.nah.backend.service;

import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.request.CreateGuestOrderRequest;
import com.nah.backend.dto.order.request.CreateOrderRequest;
import com.nah.backend.dto.order.request.UpdateOrderStatusRequest;
import com.nah.backend.dto.order.request.UpdatePaymentStatusRequest;
import com.nah.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    // Tạo đơn hàng mới từ giỏ hàng
    OrderDTO createOrder(Integer userId, CreateOrderRequest request);
    
    // Tạo đơn hàng mới cho khách vãng lai
    OrderDTO createGuestOrder(CreateGuestOrderRequest request);
    
    // Lấy đơn hàng theo ID
    OrderDTO getOrderById(Integer orderId);
    
    // Lấy danh sách đơn hàng của người dùng
    List<OrderDTO> getUserOrders(Integer userId);
    
    // Lấy danh sách đơn hàng của người dùng với phân trang
    Page<OrderDTO> getUserOrders(Integer userId, Pageable pageable);
    
    // Lấy danh sách đơn hàng của người dùng theo trạng thái
    List<OrderDTO> getUserOrdersByStatus(Integer userId, Order.OrderStatus status);
    
    // Cập nhật trạng thái đơn hàng (dành cho admin)
    OrderDTO updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request);
    
    // Cập nhật trạng thái thanh toán đơn hàng (dành cho admin và hệ thống thanh toán)
    OrderDTO updatePaymentStatus(Integer orderId, UpdatePaymentStatusRequest request);
    
    // Hủy đơn hàng (dành cho user)
    OrderDTO cancelOrder(Integer userId, Integer orderId);
    
    // Yêu cầu trả hàng (dành cho user)
    OrderDTO requestReturn(Integer userId, Integer orderId, String reason);
    
    // Lấy tất cả đơn hàng (dành cho admin)
    List<OrderDTO> getAllOrders();
    
    // Lấy tất cả đơn hàng với phân trang (dành cho admin)
    Page<OrderDTO> getAllOrders(Pageable pageable);
    
    // Lấy đơn hàng theo trạng thái (dành cho admin)
    List<OrderDTO> getOrdersByStatus(Order.OrderStatus status);
    
    // Lấy đơn hàng theo trạng thái với phân trang (dành cho admin)
    Page<OrderDTO> getOrdersByStatus(Order.OrderStatus status, Pageable pageable);
    
    // Tìm kiếm và lọc đơn hàng
    Page<OrderDTO> searchOrders(String keyword, Order.OrderStatus status, 
                                LocalDateTime startDate, LocalDateTime endDate, 
                                String userEmail,
                                Pageable pageable);
    
    // Tìm đơn hàng theo ID với phân trang
    Page<OrderDTO> findOrderById(Integer orderId, Pageable pageable);
    
    // Xử lý tự động chuyển trạng thái đơn hàng sang COMPLETED sau 3 ngày kể từ khi DELIVERED
    void processCompletedOrders();
} 