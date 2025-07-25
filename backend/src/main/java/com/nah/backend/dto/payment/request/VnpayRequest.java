package com.nah.backend.dto.payment.request;

import lombok.Data;

@Data
public class VnpayRequest {
    private String amount;
    private Integer orderId;
}