package com.nah.backend.service.impl;

import com.nah.backend.dto.stats.*;
import com.nah.backend.model.Order;
import com.nah.backend.repository.StatsRepository;
import com.nah.backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.time.temporal.ChronoUnit;

@Service
public class StatsServiceImpl implements StatsService {

    @Autowired
    private StatsRepository statsRepository;

    @Override
    public OverviewStatsDTO getOverviewStats(StatsRequestDTO request) {
        // Lấy khoảng thời gian
        LocalDateTime[] dateRange = getDateRange(request);
        // Lấy số liệu từ repository
        Double totalRevenue = statsRepository.getTotalRevenue(dateRange[0], dateRange[1]);
        Integer totalOrders = statsRepository.getTotalOrders(dateRange[0], dateRange[1]);
        Integer totalSoldProducts = statsRepository.getTotalSoldProducts(dateRange[0], dateRange[1]);
        Integer newUsers = statsRepository.getNewUserCount(dateRange[0], dateRange[1]);
        // Xử lý null
        if (totalRevenue == null) totalRevenue = 0.0;
        if (totalOrders == null) totalOrders = 0;
        if (totalSoldProducts == null) totalSoldProducts = 0;
        if (newUsers == null) newUsers = 0;
        return new OverviewStatsDTO(totalRevenue, totalOrders, totalSoldProducts, newUsers);
    }

    @Override
    public List<TimeSeriesDataDTO> getRevenueStats(StatsRequestDTO request) {
        LocalDateTime start = getDateRange(request)[0];
        LocalDateTime end = getDateRange(request)[1];
        long days = ChronoUnit.DAYS.between(start.toLocalDate(), end.toLocalDate()) + 1;
        List<Map<String, Object>> stats;
        if (days <= 1) {
            // Trong ngày: chia theo giờ
            stats = statsRepository.getRevenueByHour(start, end);
        } else if (days > 60) {
            // Khoảng thời gian lớn hơn 60 ngày: chia theo tháng
            stats = statsRepository.getRevenueByMonth(start, end);
        } else {
            // Khoảng thời gian từ 2 đến 60 ngày: chia theo ngày (thống nhất cho DAILY, WEEKLY, MONTHLY)
            stats = statsRepository.getRevenueByDay(start, end);
        }
        return stats.stream()
                .map(m -> new TimeSeriesDataDTO(
                        m.get("name").toString(),
                        ((Number) m.get("value")).doubleValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeSeriesDataDTO> getSoldProductsStats(StatsRequestDTO request) {
        LocalDateTime start = getDateRange(request)[0];
        LocalDateTime end = getDateRange(request)[1];
        long days = ChronoUnit.DAYS.between(start.toLocalDate(), end.toLocalDate()) + 1;
        List<Map<String, Object>> stats;
        if (days <= 1) {
            // Trong ngày: chia theo giờ
            stats = statsRepository.getSoldProductsByHour(start, end);
        } else if (days > 60) {
            // Khoảng thời gian lớn hơn 60 ngày: chia theo tháng
            stats = statsRepository.getSoldProductsByMonth(start, end);
        } else {
            // Khoảng thời gian từ 2 đến 60 ngày: chia theo ngày (thống nhất cho DAILY, WEEKLY, MONTHLY)
            stats = statsRepository.getSoldProductsByDay(start, end);
        }
        return stats.stream()
                .map(m -> new TimeSeriesDataDTO(
                        m.get("name").toString(),
                        ((Number) m.get("value")).doubleValue()
                ))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderStatusStatsDTO> getOrdersByStatus(StatsRequestDTO request) {
        // Lấy khoảng thời gian
        LocalDateTime[] dateRange = getDateRange(request);
        
        // Danh sách trạng thái và màu tương ứng
        Map<Order.OrderStatus, String> statusColorMap = new LinkedHashMap<>();
        statusColorMap.put(Order.OrderStatus.PENDING, "#FFBB28");     // Vàng
        statusColorMap.put(Order.OrderStatus.CONFIRMED, "#00C49F");   // Xanh lá
        statusColorMap.put(Order.OrderStatus.SHIPPING, "#0088FE");    // Xanh dương
        statusColorMap.put(Order.OrderStatus.DELIVERED, "#82ca9d");   // Xanh nhạt
        statusColorMap.put(Order.OrderStatus.COMPLETED, "#8884d8");   // Tím
        statusColorMap.put(Order.OrderStatus.CANCELLED, "#FF8042");   // Cam
        
        // Tên hiển thị của từng trạng thái
        Map<Order.OrderStatus, String> statusDisplayNames = new LinkedHashMap<>();
        statusDisplayNames.put(Order.OrderStatus.PENDING, "Đang chờ xử lý");
        statusDisplayNames.put(Order.OrderStatus.CONFIRMED, "Đã xác nhận");
        statusDisplayNames.put(Order.OrderStatus.SHIPPING, "Đang giao hàng");
        statusDisplayNames.put(Order.OrderStatus.DELIVERED, "Đã giao hàng");
        statusDisplayNames.put(Order.OrderStatus.COMPLETED, "Hoàn thành");
        statusDisplayNames.put(Order.OrderStatus.CANCELLED, "Đã hủy");

        // Lấy dữ liệu từ repository
        List<OrderStatusStatsDTO> result = new ArrayList<>();
        for (Map.Entry<Order.OrderStatus, String> entry : statusColorMap.entrySet()) {
            Order.OrderStatus status = entry.getKey();
            String fill = entry.getValue();
            String name = statusDisplayNames.get(status);
            
            Integer count = statsRepository.getOrderCountByStatus(status, dateRange[0], dateRange[1]);
            if (count == null) count = 0;
            
            result.add(new OrderStatusStatsDTO(name, count, fill));
        }
        
        return result;
    }

    @Override
    public List<RecentOrderDTO> getRecentOrders(StatsRequestDTO request, int limit) {
        // Lấy khoảng thời gian
        LocalDateTime[] dateRange = getDateRange(request);
        
        // Lấy đơn hàng gần đây nhất
        List<Order> recentOrders = statsRepository.getRecentOrders(
                dateRange[0], dateRange[1], PageRequest.of(0, limit));
        
        // Chuyển đổi sang DTO
        return recentOrders.stream()
                .map(order -> new RecentOrderDTO(
                        order.getOrderId(),
                        order.getUser() != null ? order.getUser().getFullName() : order.getUserEmail(), 
                        order.getTotalAmount(),
                        order.getStatus().toString(),
                        order.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TopProductDTO> getTopProducts(StatsRequestDTO request, int limit) {
        // Lấy khoảng thời gian
        LocalDateTime[] dateRange = getDateRange(request);
        
        // Lấy sản phẩm bán chạy
        List<Map<String, Object>> topProducts = statsRepository.getTopProducts(
                dateRange[0], dateRange[1], PageRequest.of(0, limit));
        
        // Chuyển đổi sang DTO
        return topProducts.stream()
                .map(product -> new TopProductDTO(
                        ((Number) product.get("productId")).intValue(),
                        (String) product.get("productName"),
                        (String) product.get("productImage"),
                        ((Number) product.get("price")).doubleValue(),
                        ((Number) product.get("soldQuantity")).intValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryStatsDTO> getProductsByCategory(StatsRequestDTO request) {
        // Lấy khoảng thời gian
        LocalDateTime[] dateRange = getDateRange(request);
        
        // Lấy sản phẩm theo danh mục
        List<Map<String, Object>> categoriesData = statsRepository.getSoldProductsByRootCategory(
                dateRange[0], dateRange[1]);
        
        // Màu sắc cho từng danh mục
        String[] colors = {"#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#a4de6c", "#d0ed57"};
        
        // Chuyển đổi sang DTO
        List<CategoryStatsDTO> result = new ArrayList<>();
        int colorIndex = 0;
        
        for (Map<String, Object> category : categoriesData) {
            result.add(new CategoryStatsDTO(
                    (String) category.get("name"),
                    ((Number) category.get("value")).intValue(),
                    colors[colorIndex % colors.length]
            ));
            colorIndex++;
        }
        
        return result;
    }
    
    @Override
    public ProductStatsDTO getProductStats(Integer productId, Integer days) {
        // Mặc định là 30 ngày nếu không chỉ định
        if (days == null) days = 30;
        
        // Tính khoảng thời gian (days ngày gần nhất)
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days - 1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        
        // Lấy dữ liệu từ repository
        List<Map<String, Object>> revenueData = statsRepository.getProductRevenueByDay(
                productId, startDate, endDate);
        List<Map<String, Object>> salesData = statsRepository.getProductSalesByDay(
                productId, startDate, endDate);
        
        // Chuyển đổi dữ liệu
        List<TimeSeriesDataDTO> revenue = revenueData.stream()
                .map(m -> new TimeSeriesDataDTO(
                        m.get("name").toString(),
                        ((Number) m.get("value")).doubleValue()
                ))
                .collect(Collectors.toList());
        
        List<TimeSeriesDataDTO> sales = salesData.stream()
                .map(m -> new TimeSeriesDataDTO(
                        m.get("name").toString(),
                        ((Number) m.get("value")).doubleValue()
                ))
                .collect(Collectors.toList());
        
        // Tạo và trả về DTO
        return new ProductStatsDTO(productId, revenue, sales);
    }
    
    @Override
    public List<TopRevenueProductDTO> getTopRevenueProducts(StatsRequestDTO request, int limit) {
        // Lấy khoảng thời gian
        LocalDateTime[] dateRange = getDateRange(request);
        
        // Lấy sản phẩm có doanh thu cao nhất
        List<Map<String, Object>> topProducts = statsRepository.getTopRevenueProducts(
                dateRange[0], dateRange[1], PageRequest.of(0, limit));
        
        // Chuyển đổi sang DTO
        return topProducts.stream()
                .map(product -> new TopRevenueProductDTO(
                        ((Number) product.get("productId")).intValue(),
                        (String) product.get("productName"),
                        (String) product.get("productImage"),
                        ((Number) product.get("price")).doubleValue(),
                        ((Number) product.get("revenue")).doubleValue(),
                        ((Number) product.get("soldQuantity")).intValue()
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * Phương thức hỗ trợ để lấy khoảng thời gian dựa trên request
     */
    private LocalDateTime[] getDateRange(StatsRequestDTO request) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();
        
        if (request.getTimeRange() != null) {
            LocalDate today = LocalDate.now();
            
            switch (request.getTimeRange()) {
                case DAILY:
                    // Ngày hiện tại
                    startDate = today.atStartOfDay();
                    break;
                case WEEKLY:
                    // 7 ngày gần đây
                    startDate = today.minusDays(6).atStartOfDay();
                    break;
                case MONTHLY:
                    // 30 ngày gần đây
                    startDate = today.minusDays(29).atStartOfDay();
                    break;
                case YEARLY:
                    // 12 tháng gần đây
                    startDate = today.minusDays(364).atStartOfDay();
                    break;
                default:
                    // Mặc định 30 ngày
                    startDate = today.minusDays(29).atStartOfDay();
            }
        } else if (request.getStartDate() != null && request.getEndDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            
            startDate = LocalDate.parse(request.getStartDate(), formatter).atStartOfDay();
            endDate = LocalDate.parse(request.getEndDate(), formatter).atTime(LocalTime.MAX);
        } else {
            // Mặc định 30 ngày gần đây
            startDate = LocalDate.now().minusDays(29).atStartOfDay();
        }
        
        return new LocalDateTime[]{startDate, endDate};
    }
} 