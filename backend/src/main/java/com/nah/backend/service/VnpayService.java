package com.nah.backend.service;

import java.io.UnsupportedEncodingException;
import org.springframework.http.ResponseEntity;
import com.nah.backend.dto.payment.request.VnpayRequest;

public interface VnpayService {
    String createPayment(VnpayRequest paymentRequest) throws UnsupportedEncodingException;
    ResponseEntity<String> handlePaymentReturn(String responseCode, Integer orderId) throws UnsupportedEncodingException;
}
