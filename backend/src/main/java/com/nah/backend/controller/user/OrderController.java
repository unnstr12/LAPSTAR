package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.request.CreateOrderRequest;
import com.nah.backend.dto.order.request.ReturnOrderRequest;
import com.nah.backend.model.Order;
import com.nah.backend.service.OrderService;
import com.nah.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            Integer userId = getCurrentUserId();
            OrderDTO order = orderService.createOrder(userId, request);
            return ResponseEntity.ok(ApiResponse.success("Đặt hàng thành công", order));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể tạo đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Integer userId = getCurrentUserId();
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<OrderDTO> orders = orderService.getUserOrders(userId, pageRequest);
            
            if (orders.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Bạn chưa có đơn hàng nào", orders));
            }
            
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể lấy danh sách đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        try {
            Integer userId = getCurrentUserId();
            OrderDTO order = orderService.getOrderById(orderId);
            
            // Kiểm tra xem đơn hàng có thuộc về người dùng không
            if (!order.getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Bạn không có quyền xem đơn hàng này"));
            }
            
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể lấy thông tin đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        try {
            Integer userId = getCurrentUserId();
            List<OrderDTO> orders = orderService.getUserOrdersByStatus(userId, status);
            
            if (orders.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Không có đơn hàng nào ở trạng thái " + status, orders));
            }
            
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể lấy danh sách đơn hàng: " + e.getMessage()));
        }
    }


    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer orderId) {
        try {
            Integer userId = getCurrentUserId();
            OrderDTO cancelledOrder = orderService.cancelOrder(userId, orderId);
            return ResponseEntity.ok(ApiResponse.success("Đã hủy đơn hàng thành công", cancelledOrder));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể hủy đơn hàng: " + e.getMessage()));
        }
    }


    @PostMapping("/{orderId}/return")
    public ResponseEntity<?> requestReturn(@PathVariable Integer orderId, @Valid @RequestBody ReturnOrderRequest request) {
        try {
            Integer userId = getCurrentUserId();
            OrderDTO returnedOrder = orderService.requestReturn(userId, orderId, request.getReason());
            return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu trả hàng thành công", returnedOrder));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể yêu cầu trả hàng: " + e.getMessage()));
        }
    }

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).getUserId();
    }
} 