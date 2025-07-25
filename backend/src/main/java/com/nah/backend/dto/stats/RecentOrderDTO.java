package com.nah.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrderDTO {
    private Integer orderId;
    private String fullName;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}