package com.nah.backend.dto.order.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnOrderRequest {
    @NotBlank(message = "Lý do trả hàng không được để trống")
    private String reason;
} 