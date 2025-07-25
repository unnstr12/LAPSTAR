package com.nah.backend.dto.order.request;

import com.nah.backend.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentStatusRequest {
    
    @NotNull(message = "Trạng thái thanh toán không được để trống")
    private Order.PaymentStatus paymentStatus;
} 