package com.nah.backend.controller.user;

import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.request.CreateGuestOrderRequest;
import com.nah.backend.service.InvoiceService;
import com.nah.backend.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/guest-orders")
@RequiredArgsConstructor
public class GuestOrderController {

    private final OrderService orderService;
    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<?> createGuestOrder(@Valid @RequestBody CreateGuestOrderRequest request) {
        try {
            OrderDTO order = orderService.createGuestOrder(request);
            return ResponseEntity.ok(ApiResponse.success("Đặt hàng thành công", order));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể tạo đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/invoice")
    public ResponseEntity<?> downloadGuestInvoice(
            @PathVariable Integer orderId,
            @RequestParam String email,
            @RequestParam String phoneNumber
    ) {
        try {
            OrderDTO order = orderService.getOrderById(orderId);

            if (order.getUserId() != null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng này không phải là đơn của hàng khách"));
            }
            if (order.getUserEmail() == null || !order.getUserEmail().equalsIgnoreCase(email)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Email không khớp"));
            }
            if (order.getPhoneNumber() == null || !order.getPhoneNumber().equals(phoneNumber)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Số điện thoại không khớp"));
            }

            Path invoicePath = invoiceService.generateInvoicePdf(order);
            return buildInvoiceResponse(invoicePath, "invoice-" + orderId + ".pdf");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể tải hóa đơn: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> buildInvoiceResponse(Path invoicePath, String fileName) throws IOException {
        InputStreamResource resource = new InputStreamResource(Files.newInputStream(invoicePath));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(Files.size(invoicePath))
                .body(resource);
    }
}
