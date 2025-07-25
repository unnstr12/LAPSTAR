package com.nah.backend.controller.admin;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.request.UpdateOrderStatusRequest;
import com.nah.backend.model.Order;
import com.nah.backend.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String userEmail,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            // Chuyển đổi từ LocalDate sang LocalDateTime
            LocalDateTime startDateTime = startDate != null 
                ? LocalDateTime.of(startDate, LocalTime.MIN) 
                : null;
            LocalDateTime endDateTime = endDate != null 
                ? LocalDateTime.of(endDate, LocalTime.MAX) 
                : null;
            
            // Tạo đối tượng Sort dựa trên tham số sortBy và sortDir
            Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            
            PageRequest pageRequest = PageRequest.of(page, size, sort);
            
            Page<OrderDTO> orders;
            
            // Xử lý trường hợp tìm kiếm theo ID đơn hàng
            if (keyword != null && keyword.trim().matches("\\d+")) {
                try {
                    Integer orderId = Integer.parseInt(keyword.trim());
                    orders = orderService.findOrderById(orderId, pageRequest);
                    if (orders.getTotalElements() > 0) {
                        return ResponseEntity.ok(ApiResponse.success(orders));
                    }
                } catch (NumberFormatException e) {
                    // Nếu không phải số hợp lệ, tiếp tục với tìm kiếm thông thường
                }
            }
            orderService.processCompletedOrders();
            // Tìm kiếm với bộ lọc
            orders = orderService.searchOrders(keyword, status, startDateTime, endDateTime, userEmail, pageRequest);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể lấy danh sách đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        try {
            OrderDTO order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể lấy thông tin đơn hàng: " + e.getMessage()));
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", updatedOrder));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể cập nhật trạng thái đơn hàng: " + e.getMessage()));
        }
    }
} 