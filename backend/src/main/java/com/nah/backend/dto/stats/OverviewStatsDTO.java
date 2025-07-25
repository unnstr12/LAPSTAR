package com.nah.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverviewStatsDTO {
    private Double totalRevenue;
    private Integer totalOrders;
    private Integer totalSoldProducts;
    private Integer newUsers;
}