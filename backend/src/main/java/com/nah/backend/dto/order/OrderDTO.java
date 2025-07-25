package com.nah.backend.dto.order;

import com.nah.backend.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Integer orderId;
    private Integer userId;
    private String userEmail;
    private String fullName;
    private String phoneNumber;
    private String province;
    private String district;
    private String ward;
    private String addressDetail;
    private Order.OrderStatus status;
    private Order.PaymentMethod paymentMethod;
    private Order.PaymentStatus paymentStatus;
    private Integer couponId;
    private String couponCode;
    private Double subtotalAmount;
    private Double discountAmount;
    private Double totalAmount; 
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pendingAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime shippingAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime returnedAt;
    private LocalDateTime paidAt;
    private List<OrderItemDTO> items = new ArrayList<>();
} 