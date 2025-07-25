package com.nah.backend.scheduler;

import com.nah.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderScheduler {

    private final OrderService orderService;

    @Scheduled(cron = "0 0 * * * ?") // Chạy vào đầu mỗi giờ, mỗi ngày
    public void completeDeliveredOrders() {
        log.info("Bắt đầu xử lý tự động hoàn thành đơn hàng sau 3 ngày giao hàng (chạy mỗi giờ)");
        orderService.processCompletedOrders();
        log.info("Hoàn thành xử lý tự động cập nhật trạng thái đơn hàng (chạy mỗi giờ)");
    }
} 