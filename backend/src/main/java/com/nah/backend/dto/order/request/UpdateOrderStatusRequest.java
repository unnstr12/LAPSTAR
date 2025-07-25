package com.nah.backend.dto.order.request;

import com.nah.backend.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private Order.OrderStatus status;
} 