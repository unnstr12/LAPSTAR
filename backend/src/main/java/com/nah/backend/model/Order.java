package com.nah.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
    @Email(message = "Email không hợp lệ")
    @NotNull(message = "Email không được để trống")
    private String userEmail;

    // Thông tin địa chỉ giao hàng
    private String fullName;
    private String phoneNumber;
    private String province;
    private String district;
    private String ward;
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    
    // Phương thức thanh toán
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod = PaymentMethod.CASH;
    
    // Trạng thái thanh toán
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.NOT_PAID;
    
    // Thêm thông tin về coupon
    @ManyToOne
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;
    
    private String couponCode;
    
    // Tổng tiền trước khi áp dụng coupon
    private Double subtotalAmount;
    
    // Số tiền giảm giá
    private Double discountAmount;
    
    // Tổng tiền sau khi áp dụng coupon
    private Double totalAmount;
    
    private String note;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Thời gian cho từng trạng thái đơn hàng
    private LocalDateTime pendingAt;
    
    private LocalDateTime confirmedAt;
    
    private LocalDateTime shippingAt;
    
    private LocalDateTime deliveredAt;
    
    private LocalDateTime completedAt;
    
    private LocalDateTime cancelledAt;
    
    private LocalDateTime returnedAt;
    
    // Thời gian thanh toán
    private LocalDateTime paidAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = OrderStatus.PENDING;
        }
        // Đặt thời gian cho trạng thái PENDING khi tạo mới đơn hàng
        pendingAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper method to add an order item
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }
    
    // Helper method to remove an order item
    public void removeOrderItem(OrderItem item) {
        orderItems.remove(item);
        item.setOrder(null);
    }
    
    // Helper method to calculate total amount
    public void calculateTotal() {
        // Tính tổng tiền các mục đơn hàng
        this.subtotalAmount = orderItems.stream()
                .mapToDouble(OrderItem::getSubTotal)
                .sum();
                
        // Nếu có áp dụng coupon
        if (coupon != null && couponCode != null) {
            BigDecimal subtotal = BigDecimal.valueOf(this.subtotalAmount);
            
            if (coupon.getDiscountType() == Coupon.CouponDiscountType.PERCENT) {
                // Nếu là phần trăm, tính toán số tiền giảm dựa trên tổng đơn hàng
                BigDecimal percent = coupon.getDiscountValue().divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                this.discountAmount = subtotal.multiply(percent).doubleValue();
            } else {
                // Nếu là số tiền cố định
                this.discountAmount = Math.min(coupon.getDiscountValue().doubleValue(), this.subtotalAmount);
            }
            
            // Tổng tiền sau khi giảm giá
            this.totalAmount = this.subtotalAmount - this.discountAmount;
        } else {
            // Không áp dụng coupon
            this.discountAmount = 0.0;
            this.totalAmount = this.subtotalAmount;
        }
    }
    
    // Cập nhật thời gian cho trạng thái đơn hàng
    public void updateStatusTime(OrderStatus newStatus) {
        LocalDateTime now = LocalDateTime.now();
        
        switch (newStatus) {
            case PENDING:
                this.pendingAt = now;
                break;
            case CONFIRMED:
                this.confirmedAt = now;
                break;
            case SHIPPING:
                this.shippingAt = now;
                break;
            case DELIVERED:
                this.deliveredAt = now;
                break;
            case COMPLETED:
                this.completedAt = now;
                break;
            case CANCELLED:
                this.cancelledAt = now;
                break;
            case RETURNED:
                this.returnedAt = now;
                break;
        }
        
        this.status = newStatus;
    }
    
    // Cập nhật trạng thái thanh toán
    public void updatePaymentStatus(PaymentStatus newPaymentStatus) {
        if (newPaymentStatus == PaymentStatus.PAID && this.paymentStatus != PaymentStatus.PAID) {
            this.paidAt = LocalDateTime.now();
        }
        this.paymentStatus = newPaymentStatus;
    }
    
    // Áp dụng coupon vào đơn hàng
    public void applyCoupon(Coupon coupon) {
        this.coupon = coupon;
        this.couponCode = coupon.getCouponCode();
        // Tính lại tổng tiền sau khi áp dụng coupon
        calculateTotal();
    }
    
    // Xóa coupon khỏi đơn hàng
    public void removeCoupon() {
        this.coupon = null;
        this.couponCode = null;
        this.discountAmount = 0.0;
        // Tính lại tổng tiền sau khi xóa coupon
        calculateTotal();
    }

    public enum OrderStatus {
        PENDING,         // Đơn hàng đang chờ xác nhận
        CONFIRMED,       // Đơn hàng đã được xác nhận
        SHIPPING,        // Đơn hàng đang được vận chuyển
        DELIVERED,       // Đơn hàng đã giao thành công
        COMPLETED,       // Đơn hàng đã hoàn thành
        CANCELLED,       // Đơn hàng đã bị hủy
        RETURNED         // Đơn hàng bị trả lại
    }
    
    public enum PaymentMethod {
        CASH,           // Thanh toán bằng tiền mặt khi nhận hàng
        VN_PAY          // Thanh toán online qua VN Pay
    }
    
    public enum PaymentStatus {
        NOT_PAID,       // Chưa thanh toán
        PAID            // Đã thanh toán
    }
} 