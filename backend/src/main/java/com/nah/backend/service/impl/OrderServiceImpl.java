package com.nah.backend.service.impl;

import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.OrderItemDTO;
import com.nah.backend.dto.order.request.CreateGuestOrderRequest;
import com.nah.backend.dto.order.request.CreateOrderRequest;
import com.nah.backend.dto.order.request.UpdateOrderStatusRequest;
import com.nah.backend.dto.order.request.UpdatePaymentStatusRequest;
import com.nah.backend.model.*;
import com.nah.backend.repository.*;
import com.nah.backend.service.OrderService;
import com.nah.backend.service.ProductInventoryService;
import com.nah.backend.service.CouponService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductInventoryService productInventoryService;
    private final CouponRepository couponRepository;
    private final CouponService couponService;

    @Override
    @Transactional
    public OrderDTO createOrder(Integer userId, CreateOrderRequest request) {
        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với ID: " + userId));
        
        // Tạo đơn hàng mới
        Order order = new Order();
        order.setUser(user);
        order.setUserEmail(user.getEmail());
        order.setFullName(request.getFullName());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setProvince(request.getProvince());
        order.setDistrict(request.getDistrict());
        order.setWard(request.getWard());
        order.setAddressDetail(request.getAddressDetail());
        order.setNote(request.getNote());
        order.setStatus(Order.OrderStatus.PENDING);
        
        // Thiết lập phương thức thanh toán và trạng thái thanh toán
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(Order.PaymentStatus.NOT_PAID);
        
        if (request.getCartId() != null) {
            // Lấy giỏ hàng
            Cart cart = cartRepository.findById(request.getCartId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giỏ hàng với ID: " + request.getCartId()));
            
            // Kiểm tra xem giỏ hàng có thuộc về người dùng không
            if (!cart.getUser().getUserId().equals(userId)) {
                throw new IllegalArgumentException("Giỏ hàng không thuộc về người dùng này");
            }
            
            // Kiểm tra xem giỏ hàng có trống không
            if (cart.getCartItems().isEmpty()) {
                throw new IllegalArgumentException("Giỏ hàng trống, không thể tạo đơn hàng");
            }
        
            // Tạo các mục đơn hàng từ giỏ hàng
            cart.getCartItems().forEach(cartItem -> {
                Product product = cartItem.getProduct();
                
                // Kiểm tra hàng tồn kho trước khi thêm vào đơn hàng
                if (!productInventoryService.hasEnoughStock(product, cartItem.getQuantity())) {
                    throw new IllegalStateException("Không đủ số lượng sản phẩm " + product.getProductName() + " trong kho");
                }
                    
                // Tạo mục đơn hàng mới
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setProductName(product.getProductName());
                
                // Lấy giá cuối cùng từ Product tại thời điểm tạo đơn hàng
                orderItem.setPrice(product.getFinalPrice().doubleValue());
                
                orderItem.setQuantity(cartItem.getQuantity());
                
                // Lấy ảnh đại diện của sản phẩm (nếu có)
                String productImage = productImageRepository.findByProductProductId(product.getProductId())
                    .stream()
                    .findFirst()
                    .map(image -> image.getImageUrl())
                    .orElse(null);
                orderItem.setProductImage(productImage);
                
                // Thêm vào đơn hàng
                order.addOrderItem(orderItem);
            });
            
            // Xóa giỏ hàng sau khi đã tạo đơn hàng
            cart.getCartItems().clear();
            cartRepository.save(cart);
        } 
        else if (request.getCartItems() != null && !request.getCartItems().isEmpty()) {
            // Xử lý từng sản phẩm trong danh sách
            for (CreateOrderRequest.CartItem item : request.getCartItems()) {
                // Tìm sản phẩm
                Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + item.getProductId()));
                
                // Kiểm tra hàng tồn kho
                if (!productInventoryService.hasEnoughStock(product, item.getQuantity())) {
                    throw new IllegalStateException("Không đủ số lượng sản phẩm " + product.getProductName() + " trong kho");
                }
                
                // Tạo mục đơn hàng
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setProductName(product.getProductName());
                
                // Lấy giá cuối cùng từ Product tại thời điểm tạo đơn hàng
                orderItem.setPrice(product.getFinalPrice().doubleValue());
                
                orderItem.setQuantity(item.getQuantity());
                
                // Lấy ảnh đại diện của sản phẩm (nếu có)
                String productImage = productImageRepository.findByProductProductId(product.getProductId())
                    .stream()
                    .findFirst()
                    .map(image -> image.getImageUrl())
                    .orElse(null);
                orderItem.setProductImage(productImage);
                
                // Thêm vào đơn hàng
                order.addOrderItem(orderItem);
            }
        } else {
            throw new IllegalArgumentException("Cần phải có giỏ hàng hoặc danh sách sản phẩm để tạo đơn hàng");
        }
        
        // Tính tổng tiền đơn hàng
        order.calculateTotal();
        
        // Áp dụng coupon nếu có mã giảm giá
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            applyCouponToOrder(order, request.getCouponCode());
        }
        
        // Lưu đơn hàng
        Order savedOrder = orderRepository.save(order);
        
        // Giảm số lượng sản phẩm trong kho
        productInventoryService.decreaseStock(savedOrder.getOrderItems());
        
        return convertToDTO(savedOrder);
    }

    @Override
    @Transactional
    public OrderDTO createGuestOrder(CreateGuestOrderRequest request) {
        // Kiểm tra danh sách sản phẩm không được trống
        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Danh sách sản phẩm trống, không thể tạo đơn hàng");
        }
        
        // Tạo đơn hàng mới
        Order order = new Order();
        // Đơn hàng của khách vãng lai không có user
        order.setUser(null);
        // Lưu thông tin email cho khách vãng lai
        order.setUserEmail(request.getEmail());
        order.setFullName(request.getFullName());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setProvince(request.getProvince());
        order.setDistrict(request.getDistrict());
        order.setWard(request.getWard());
        order.setAddressDetail(request.getAddressDetail());
        order.setNote(request.getNote());
        order.setStatus(Order.OrderStatus.PENDING);
        
        // Thiết lập phương thức thanh toán và trạng thái thanh toán
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(Order.PaymentStatus.NOT_PAID);
        
        // Xử lý từng sản phẩm trong đơn hàng
        for (CreateOrderRequest.CartItem item : request.getCartItems()) {
            // Tìm sản phẩm
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + item.getProductId()));
            
            // Kiểm tra hàng tồn kho
            if (!productInventoryService.hasEnoughStock(product, item.getQuantity())) {
                throw new IllegalStateException("Không đủ số lượng sản phẩm " + product.getProductName() + " trong kho");
            }
            
            // Tạo mục đơn hàng
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getProductName());
            
            // Lấy giá cuối cùng từ Product tại thời điểm tạo đơn hàng
            orderItem.setPrice(product.getFinalPrice().doubleValue());
            
            orderItem.setQuantity(item.getQuantity());
            
            // Lấy ảnh đại diện của sản phẩm (nếu có)
            String productImage = productImageRepository.findByProductProductId(product.getProductId())
                .stream()
                .findFirst()
                .map(image -> image.getImageUrl())
                .orElse(null);
            orderItem.setProductImage(productImage);
            
            // Thêm vào đơn hàng
            order.addOrderItem(orderItem);
        }
        
        // Tính tổng tiền đơn hàng
        order.calculateTotal();
        
        // Áp dụng coupon nếu có mã giảm giá
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            applyCouponToOrder(order, request.getCouponCode());
        }
        
        // Lưu đơn hàng
        Order savedOrder = orderRepository.save(order);
        
        // Giảm số lượng sản phẩm trong kho
        productInventoryService.decreaseStock(savedOrder.getOrderItems());
        
        return convertToDTO(savedOrder);
    }

    // Phương thức riêng để áp dụng coupon vào đơn hàng
    private void applyCouponToOrder(Order order, String couponCode) {
        try {
            // Lấy thông tin coupon từ database
            Coupon coupon = couponRepository.findByCouponCode(couponCode)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy mã giảm giá: " + couponCode));
            
            // Kiểm tra tính hợp lệ của coupon
            if (!couponService.isValidCoupon(couponCode, BigDecimal.valueOf(order.getSubtotalAmount()))) {
                throw new IllegalArgumentException("Mã giảm giá không hợp lệ hoặc không áp dụng được cho đơn hàng này");
            }
            
            // Áp dụng coupon vào đơn hàng
            order.applyCoupon(coupon);
            
            // Tăng số lần sử dụng coupon
            couponService.incrementCouponUsage(couponCode);
            
        } catch (EntityNotFoundException | IllegalArgumentException e) {
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        return convertToDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(Integer userId) {
        List<Order> orders = orderRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getUserOrders(Integer userId, Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByUserUserId(userId, pageable);
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(orderDTOs, pageable, orderPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrdersByStatus(Integer userId, Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByUserUserIdAndStatus(userId, status);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        
        Order.OrderStatus oldStatus = order.getStatus();
        Order.OrderStatus newStatus = request.getStatus();
        
        // Kiểm tra luồng chuyển đổi trạng thái hợp lệ
        validateStatusTransition(oldStatus, newStatus);
        
        // Cập nhật trạng thái và thời gian tương ứng
        order.updateStatusTime(newStatus);
        
        // Nếu đơn hàng đã hoàn thành giao hàng (DELIVERED) và phương thức thanh toán là tiền mặt (CASH), cập nhật trạng thái thanh toán
        if (newStatus == Order.OrderStatus.DELIVERED && order.getPaymentMethod() == Order.PaymentMethod.CASH) {
            order.updatePaymentStatus(Order.PaymentStatus.PAID);
        }
        
        // Lưu đơn hàng
        Order updatedOrder = orderRepository.save(order);
        
        // Nếu đơn hàng chuyển sang trạng thái CANCELLED, trả lại số lượng tồn kho
        if (newStatus == Order.OrderStatus.CANCELLED && oldStatus != Order.OrderStatus.CANCELLED) {
            productInventoryService.increaseStock(updatedOrder.getOrderItems());
        }
        
        return convertToDTO(updatedOrder);
    }

    // Kiểm tra luồng chuyển đổi trạng thái hợp lệ
    private void validateStatusTransition(Order.OrderStatus oldStatus, Order.OrderStatus newStatus) {
        switch (oldStatus) {
            case PENDING:
                // Từ PENDING chỉ được chuyển sang CONFIRMED hoặc CANCELLED
                if (newStatus != Order.OrderStatus.CONFIRMED && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new IllegalStateException(
                        "Đơn hàng ở trạng thái " + oldStatus + " chỉ có thể chuyển sang CONFIRMED hoặc CANCELLED"
                    );
                }
                break;
            case CONFIRMED:
                // Từ CONFIRMED chỉ được chuyển sang SHIPPING hoặc CANCELLED
                if (newStatus != Order.OrderStatus.SHIPPING && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new IllegalStateException(
                        "Đơn hàng ở trạng thái " + oldStatus + " chỉ có thể chuyển sang SHIPPING hoặc CANCELLED"
                    );
                }
                break;
            case SHIPPING:
                // Từ SHIPPING chỉ được chuyển sang DELIVERED
                if (newStatus != Order.OrderStatus.DELIVERED) {
                    throw new IllegalStateException(
                        "Đơn hàng ở trạng thái " + oldStatus + " chỉ có thể chuyển sang DELIVERED"
                    );
                }
                break;
            case DELIVERED:
                // Từ DELIVERED chỉ được chuyển sang COMPLETED hoặc RETURNED
                if (newStatus != Order.OrderStatus.COMPLETED && newStatus != Order.OrderStatus.RETURNED) {
                    throw new IllegalStateException(
                        "Đơn hàng ở trạng thái " + oldStatus + " chỉ có thể chuyển sang COMPLETED hoặc RETURNED"
                    );
                }
                break;
            case COMPLETED:
            case CANCELLED:
            case RETURNED:
                // Các trạng thái kết thúc không thể chuyển tiếp
                throw new IllegalStateException(
                    "Đơn hàng ở trạng thái " + oldStatus + " không thể thay đổi trạng thái"
                );
            default:
                throw new IllegalStateException("Trạng thái đơn hàng không hợp lệ");
        }
    }

    @Override
    @Transactional
    public OrderDTO cancelOrder(Integer userId, Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        
        // Kiểm tra xem đơn hàng có thuộc về người dùng không
        if (!order.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Đơn hàng không thuộc về người dùng này");
        }
        
        // Kiểm tra xem đơn hàng có thể hủy không
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Không thể hủy đơn hàng ở trạng thái " + order.getStatus());
        }
        
        // Lưu trạng thái cũ để kiểm tra sau này
        Order.OrderStatus oldStatus = order.getStatus();
        
        // Cập nhật trạng thái thành CANCELLED
        order.updateStatusTime(Order.OrderStatus.CANCELLED);
        
        // Lưu đơn hàng
        Order cancelledOrder = orderRepository.save(order);
        
        // Nếu đơn hàng đã được tạo (đã giảm số lượng tồn kho), thì cần tăng lại số lượng tồn kho
        if (oldStatus == Order.OrderStatus.PENDING || oldStatus == Order.OrderStatus.CONFIRMED) {
            productInventoryService.increaseStock(cancelledOrder.getOrderItems());
        }
        
        return convertToDTO(cancelledOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(orderDTOs, pageable, orderPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByStatus(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByStatus(status, pageable);
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(orderDTOs, pageable, orderPage.getTotalElements());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> searchOrders(String keyword, Order.OrderStatus status, 
                                      LocalDateTime startDate, LocalDateTime endDate, 
                                      String userEmail,
                                      Pageable pageable) {
        Page<Order> orderPage = orderRepository.findWithFilters(keyword, status, startDate, endDate, userEmail, pageable);
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(orderDTOs, pageable, orderPage.getTotalElements());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> findOrderById(Integer orderId, Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByOrderId(orderId, pageable);
        List<OrderDTO> orderDTOs = orderPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(orderDTOs, pageable, orderPage.getTotalElements());
    }
    
    @Override
    @Transactional
    public OrderDTO updatePaymentStatus(Integer orderId, UpdatePaymentStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        
        Order.PaymentStatus newStatus = request.getPaymentStatus();
        
        // Cập nhật trạng thái thanh toán
        order.updatePaymentStatus(newStatus);
        
        // Nếu đơn hàng được thanh toán và phương thức thanh toán là VN_PAY, 
        // và đơn hàng đang ở trạng thái PENDING, thì cập nhật sang CONFIRMED
        if (newStatus == Order.PaymentStatus.PAID && 
            order.getPaymentMethod() == Order.PaymentMethod.VN_PAY && 
            order.getStatus() == Order.OrderStatus.PENDING) {
            order.updateStatusTime(Order.OrderStatus.CONFIRMED);
        }
        
        // Lưu đơn hàng
        Order updatedOrder = orderRepository.save(order);
        
        return convertToDTO(updatedOrder);
    }
    
    // Chuyển đổi từ Order entity sang OrderDTO
    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(order.getOrderId());
        
        // Xử lý trường hợp đơn hàng không có người dùng (khách vãng lai)
        if (order.getUser() != null) {
            orderDTO.setUserId(order.getUser().getUserId());
            orderDTO.setUserEmail(order.getUser().getEmail());
        } else {
            // Đơn hàng của khách vãng lai
            orderDTO.setUserId(null);
            orderDTO.setUserEmail(order.getUserEmail());
        }
        
        orderDTO.setFullName(order.getFullName());
        orderDTO.setPhoneNumber(order.getPhoneNumber());
        orderDTO.setProvince(order.getProvince());
        orderDTO.setDistrict(order.getDistrict());
        orderDTO.setWard(order.getWard());
        orderDTO.setAddressDetail(order.getAddressDetail());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setPaymentMethod(order.getPaymentMethod());
        orderDTO.setPaymentStatus(order.getPaymentStatus());
        
        // Thông tin coupon
        if (order.getCoupon() != null) {
            orderDTO.setCouponId(order.getCoupon().getCouponId());
            orderDTO.setCouponCode(order.getCouponCode());
        }
        orderDTO.setSubtotalAmount(order.getSubtotalAmount());
        orderDTO.setDiscountAmount(order.getDiscountAmount());
        orderDTO.setTotalAmount(order.getTotalAmount());
        
        orderDTO.setNote(order.getNote());
        orderDTO.setCreatedAt(order.getCreatedAt());
        orderDTO.setUpdatedAt(order.getUpdatedAt());
        orderDTO.setPendingAt(order.getPendingAt());
        orderDTO.setConfirmedAt(order.getConfirmedAt());
        orderDTO.setShippingAt(order.getShippingAt());
        orderDTO.setDeliveredAt(order.getDeliveredAt());
        orderDTO.setCompletedAt(order.getCompletedAt());
        orderDTO.setCancelledAt(order.getCancelledAt());
        orderDTO.setReturnedAt(order.getReturnedAt());
        orderDTO.setPaidAt(order.getPaidAt());
        orderDTO.setItems(itemDTOs);
        
        return orderDTO;
    }
    
    // Chuyển đổi từ OrderItem entity sang OrderItemDTO
    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setOrderItemId(orderItem.getOrderItemId());
        dto.setProductId(orderItem.getProduct().getProductId());
        dto.setProductName(orderItem.getProductName());
        dto.setProductImage(orderItem.getProductImage());
        dto.setPrice(orderItem.getPrice());
        dto.setQuantity(orderItem.getQuantity());
        dto.setSubTotal(orderItem.getSubTotal());
        
        return dto;
    }

    @Override
    @Transactional
    public OrderDTO requestReturn(Integer userId, Integer orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        
        // Kiểm tra xem đơn hàng có thuộc về người dùng không
        if (!order.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Đơn hàng không thuộc về người dùng này");
        }
        
        // Chỉ cho phép yêu cầu trả hàng khi đơn hàng ở trạng thái DELIVERED
        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            throw new IllegalStateException("Chỉ có thể yêu cầu trả hàng với đơn hàng đã giao thành công");
        }
        
        // Cập nhật trạng thái thành RETURNED
        order.updateStatusTime(Order.OrderStatus.RETURNED);
        order.setNote(order.getNote() != null ? 
                order.getNote() + " | Lý do trả hàng: " + reason : 
                "Lý do trả hàng: " + reason);
        
        // Lưu đơn hàng
        Order returnedOrder = orderRepository.save(order);
        
        return convertToDTO(returnedOrder);
    }

    @Override
    @Transactional
    public void processCompletedOrders() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(1);
        
        // Tìm tất cả đơn hàng ở trạng thái DELIVERED và đã giao hơn 3 ngày
        List<Order> ordersToComplete = orderRepository.findByStatusAndDeliveredAtBefore(
            Order.OrderStatus.DELIVERED, threeDaysAgo);
        
        // Cập nhật trạng thái các đơn hàng
        if (!ordersToComplete.isEmpty()) {
            for (Order order : ordersToComplete) {
                order.updateStatusTime(Order.OrderStatus.COMPLETED);
                orderRepository.save(order);
            }
        }
    }
} 