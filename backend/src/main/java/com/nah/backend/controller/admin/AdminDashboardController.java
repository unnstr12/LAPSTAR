package com.nah.backend.controller.admin;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.stats.CategoryStatsDTO;
import com.nah.backend.dto.stats.OrderStatusStatsDTO;
import com.nah.backend.dto.stats.RecentOrderDTO;
import com.nah.backend.dto.stats.StatsRequestDTO;
import com.nah.backend.dto.stats.TimeSeriesDataDTO;
import com.nah.backend.dto.stats.TopProductDTO;
import com.nah.backend.dto.stats.TopRevenueProductDTO;
import com.nah.backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<?>> getOverviewStats(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // Chuyển đổi timeRange từ String sang enum
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(statsService.getOverviewStats(request)));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<?>> getRevenueStats(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<TimeSeriesDataDTO> result = statsService.getRevenueStats(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/sold-products")
    public ResponseEntity<ApiResponse<?>> getSoldProductsStats(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<TimeSeriesDataDTO> result = statsService.getSoldProductsStats(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    @GetMapping("/orders-by-status")
    public ResponseEntity<ApiResponse<?>> getOrdersByStatus(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<OrderStatusStatsDTO> result = statsService.getOrdersByStatus(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    @GetMapping("/recent-orders")
    public ResponseEntity<ApiResponse<?>> getRecentOrders(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<RecentOrderDTO> result = statsService.getRecentOrders(request, 10);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    @GetMapping("/top-products")
    public ResponseEntity<ApiResponse<?>> getTopProducts(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<TopProductDTO> result = statsService.getTopProducts(request, 5);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    

    @GetMapping("/top-revenue-products")
    public ResponseEntity<ApiResponse<?>> getTopRevenueProducts(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<TopRevenueProductDTO> result = statsService.getTopRevenueProducts(request, 5);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    @GetMapping("/products-by-category")
    public ResponseEntity<ApiResponse<?>> getProductsByCategory(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        StatsRequestDTO.TimeRange tr = StatsRequestDTO.TimeRange.from(timeRange);
        StatsRequestDTO request = new StatsRequestDTO(tr, startDate, endDate);
        List<CategoryStatsDTO> result = statsService.getProductsByCategory(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    @GetMapping("/product-stats")
    public ResponseEntity<ApiResponse<?>> getProductStats(
            @RequestParam Integer productId,
            @RequestParam(required = false) Integer days) {
        return ResponseEntity.ok(ApiResponse.success(statsService.getProductStats(productId, days)));
    }
} 