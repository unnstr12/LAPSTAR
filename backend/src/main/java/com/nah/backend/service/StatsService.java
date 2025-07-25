package com.nah.backend.service;

import com.nah.backend.dto.stats.OverviewStatsDTO;
import com.nah.backend.dto.stats.StatsRequestDTO;
import com.nah.backend.dto.stats.TimeSeriesDataDTO;
import com.nah.backend.dto.stats.OrderStatusStatsDTO;
import com.nah.backend.dto.stats.RecentOrderDTO;
import com.nah.backend.dto.stats.TopProductDTO;
import com.nah.backend.dto.stats.CategoryStatsDTO;
import com.nah.backend.dto.stats.ProductStatsDTO;
import com.nah.backend.dto.stats.TopRevenueProductDTO;

import java.util.List;

public interface StatsService {
    
    /**
     * Lấy thống kê tổng quan dựa trên khoảng thời gian
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @return DTO chứa các thông số thống kê tổng quan
     */
    OverviewStatsDTO getOverviewStats(StatsRequestDTO request);
    
    /**
     * Lấy dữ liệu doanh thu theo thời gian
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @return Danh sách dữ liệu doanh thu theo thời gian
     */
    List<TimeSeriesDataDTO> getRevenueStats(StatsRequestDTO request);
    
    /**
     * Lấy dữ liệu số lượng sản phẩm bán ra theo thời gian
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @return Danh sách dữ liệu số lượng sản phẩm bán ra theo thời gian
     */
    List<TimeSeriesDataDTO> getSoldProductsStats(StatsRequestDTO request);
    
    /**
     * Lấy thống kê đơn hàng theo trạng thái
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @return Danh sách dữ liệu thống kê đơn hàng theo trạng thái
     */
    List<OrderStatusStatsDTO> getOrdersByStatus(StatsRequestDTO request);
    
    /**
     * Lấy danh sách đơn hàng gần đây
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @param limit Số lượng đơn hàng tối đa cần lấy
     * @return Danh sách các đơn hàng gần đây
     */
    List<RecentOrderDTO> getRecentOrders(StatsRequestDTO request, int limit);
    
    /**
     * Lấy danh sách sản phẩm bán chạy
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @param limit Số lượng sản phẩm tối đa cần lấy
     * @return Danh sách sản phẩm bán chạy
     */
    List<TopProductDTO> getTopProducts(StatsRequestDTO request, int limit);
    
    /**
     * Lấy thống kê sản phẩm theo danh mục
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @return Danh sách dữ liệu thống kê sản phẩm theo danh mục
     */
    List<CategoryStatsDTO> getProductsByCategory(StatsRequestDTO request);
    
    /**
     * Lấy thống kê doanh thu và số lượng bán ra của một sản phẩm cụ thể
     * @param productId ID của sản phẩm cần thống kê
     * @param days Số ngày cần thống kê (mặc định 30 ngày)
     * @return Đối tượng ProductStatsDTO chứa thông tin thống kê
     */
    ProductStatsDTO getProductStats(Integer productId, Integer days);
    
    /**
     * Lấy danh sách sản phẩm có doanh thu cao nhất
     * @param request Yêu cầu thống kê (timeRange hoặc startDate và endDate)
     * @param limit Số lượng sản phẩm tối đa cần lấy
     * @return Danh sách sản phẩm có doanh thu cao nhất
     */
    List<TopRevenueProductDTO> getTopRevenueProducts(StatsRequestDTO request, int limit);
} 