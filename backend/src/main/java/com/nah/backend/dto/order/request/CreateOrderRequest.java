package com.nah.backend.dto.order.request;

import com.nah.backend.model.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    // Có thể null khi tạo đơn hàng trực tiếp từ danh sách sản phẩm
    private Integer cartId;
    
    // Danh sách sản phẩm (dùng khi cartId là null)
    private List<CartItem> cartItems;
    
    @NotBlank(message = "Tên người nhận không được để trống")
    private String fullName;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)(\\d{9}|\\d{10})$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;
    
    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String province;
    
    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;
    
    @NotBlank(message = "Phường/Xã không được để trống")
    private String ward;
    
    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String addressDetail;
    
    private String note;
    
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private Order.PaymentMethod paymentMethod = Order.PaymentMethod.CASH;
    
    private String couponCode;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItem {
        private Integer productId;
        private Integer quantity;
    }
} 