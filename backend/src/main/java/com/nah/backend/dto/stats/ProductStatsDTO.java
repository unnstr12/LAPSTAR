package com.nah.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStatsDTO {
    private Integer productId;
    private List<TimeSeriesDataDTO> revenue;
    private List<TimeSeriesDataDTO> sales;
} 