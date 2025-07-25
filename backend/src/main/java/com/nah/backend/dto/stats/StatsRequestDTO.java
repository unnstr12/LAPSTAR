package com.nah.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsRequestDTO {
    private TimeRange timeRange;
    private String startDate;
    private String endDate;
    
    public enum TimeRange {
        DAILY, WEEKLY, MONTHLY, YEARLY;
        
        public static TimeRange from(String value) {
            if (value == null) return null;
            try {
                return TimeRange.valueOf(value.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
    }
}