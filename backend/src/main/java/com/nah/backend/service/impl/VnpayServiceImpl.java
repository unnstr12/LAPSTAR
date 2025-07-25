package com.nah.backend.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nah.backend.config.VNPAYConfig;
import com.nah.backend.dto.order.request.UpdatePaymentStatusRequest;
import com.nah.backend.dto.payment.request.VnpayRequest;
import com.nah.backend.model.Order;
import com.nah.backend.repository.OrderRepository;
import com.nah.backend.service.OrderService;
import com.nah.backend.service.VnpayService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VnpayServiceImpl implements VnpayService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Override
    public String createPayment(VnpayRequest paymentRequest) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        
        Integer orderId = paymentRequest.getOrderId();
        if (orderId == null) {
            throw new IllegalArgumentException("Mã đơn hàng không hợp lệ");
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        
        if (order.getPaymentMethod() != Order.PaymentMethod.VN_PAY) {
            throw new IllegalArgumentException("Đơn hàng này không sử dụng phương thức thanh toán VN_PAY");
        }
        
        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            throw new IllegalArgumentException("Đơn hàng này đã được thanh toán");
        }
        
        long amount = 0;
        try {
            amount = Math.round(order.getTotalAmount() * 100);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Số tiền không hợp lệ");
        }

        String bankCode = "NCB";
        String vnp_TxnRef = orderId + "_" + VNPAYConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + orderId);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNPAYConfig.vnp_ReturnUrl + "?orderId=" + orderId);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append('&');
                hashData.append('&');
            }
        }

        if (query.length() > 0)
            query.setLength(query.length() - 1);
        if (hashData.length() > 0)
            hashData.setLength(hashData.length() - 1);

        String vnp_SecureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        
        log.info("Tạo URL thanh toán VNPAY cho đơn hàng {}: {}", orderId, VNPAYConfig.vnp_PayUrl + "?" + query);
        return VNPAYConfig.vnp_PayUrl + "?" + query;
    }

    @Override
    @Transactional
    public ResponseEntity<String> handlePaymentReturn(String responseCode, Integer orderId) {
        log.info("Xử lý kết quả thanh toán VNPAY cho đơn hàng {}, mã phản hồi: {}", orderId, responseCode);
        
        if (orderId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không tìm thấy thông tin đơn hàng!");
        }
        
        try {
            if ("00".equals(responseCode)) {
                // Cập nhật trạng thái thanh toán thành công
                UpdatePaymentStatusRequest updateRequest = new UpdatePaymentStatusRequest();
                updateRequest.setPaymentStatus(Order.PaymentStatus.PAID);
                orderService.updatePaymentStatus(orderId, updateRequest);
                
                log.info("Thanh toán thành công cho đơn hàng {}", orderId);
                return ResponseEntity.ok("Thanh toán thành công!");
            } else {
                log.warn("Thanh toán thất bại cho đơn hàng {}, mã lỗi: {}", orderId, responseCode);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thanh toán thất bại! Mã lỗi: " + responseCode);
            }
        } catch (EntityNotFoundException e) {
            log.error("Không tìm thấy đơn hàng khi xử lý kết quả thanh toán: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi khi xử lý kết quả thanh toán: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xử lý thanh toán!");
        }
    }
} 