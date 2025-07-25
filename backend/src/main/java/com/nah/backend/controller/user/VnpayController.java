package com.nah.backend.controller.user;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

// import com.nah.backend.config.VNPAYConfig;
import com.nah.backend.dto.payment.request.VnpayRequest;
import com.nah.backend.service.VnpayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/vnpay")
@AllArgsConstructor

public class VnpayController {

    private final VnpayService vnpayService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createPayment(@RequestBody VnpayRequest paymentRequest) {
        try {
            String paymentUrl = vnpayService.createPayment(paymentRequest);
            return ResponseEntity.ok(paymentUrl);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo thanh toán!");
        }
    }
    
    @GetMapping("/callback")
    public ResponseEntity<String> paymentCallback(
            @RequestParam(value = "vnp_ResponseCode", required = false) String responseCode,
            @RequestParam(value = "orderId", required = false) Integer orderId) {
        try {
            return vnpayService.handlePaymentReturn(responseCode, orderId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi xử lý kết quả thanh toán: " + e.getMessage());
        }
    }
    
    @GetMapping("/ipn")
    public RedirectView ipnURL(HttpServletRequest request) {
        try {
            // Thu thập tất cả tham số từ request
            Map<String, String> fields = new HashMap<>();
            Enumeration<String> params = request.getParameterNames();
            
            while (params.hasMoreElements()) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    fields.put(fieldName, fieldValue);
                }
            }
            
            // Lấy secure hash từ request
            // String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            
            // Xóa các trường không cần thiết cho việc tính toán hash
            if (fields.containsKey("vnp_SecureHashType")) {
                fields.remove("vnp_SecureHashType");
            }
            if (fields.containsKey("vnp_SecureHash")) {
                fields.remove("vnp_SecureHash");
            }
            
            // Tính toán hash để xác thực
            // String signValue = VNPAYConfig.hashAllFields(fields);
            
            // Lấy mã đơn hàng từ vnp_TxnRef (format: orderId_random)
            String txnRef = fields.get("vnp_TxnRef");
            Integer orderId = null;
            if (txnRef != null && txnRef.contains("_")) {
                orderId = Integer.valueOf(txnRef.split("_")[0]);
            }
            
            // Kiểm tra hash và mã phản hồi
                String vnp_ResponseCode = fields.get("vnp_ResponseCode");                
                // Cập nhật trạng thái thanh toán
                if ("00".equals(vnp_ResponseCode) && orderId != null) {
                    vnpayService.handlePaymentReturn(vnp_ResponseCode, orderId);
                    return new RedirectView("http://localhost:3000/order-status?vnp_ResponseCode=" + vnp_ResponseCode + "&orderId=" + orderId);
                } else {
                    return new RedirectView("http://localhost:3000/order-status?vnp_ResponseCode=" + vnp_ResponseCode + "&orderId=" + orderId + "&error=payment_failed");
                }

        } catch (Exception e) {
            return new RedirectView("http://localhost:3000/order-status?error=internal_error");
        }
    }
}