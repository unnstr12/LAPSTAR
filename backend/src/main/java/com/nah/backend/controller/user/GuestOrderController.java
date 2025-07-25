package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.request.CreateGuestOrderRequest;
import com.nah.backend.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guest-orders")
@RequiredArgsConstructor
public class GuestOrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createGuestOrder(@Valid @RequestBody CreateGuestOrderRequest request) {
        try {
            OrderDTO order = orderService.createGuestOrder(request);
            return ResponseEntity.ok(ApiResponse.success("Đặt hàng thành công", order));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể tạo đơn hàng: " + e.getMessage()));
        }
    }
} 