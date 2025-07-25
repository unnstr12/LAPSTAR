package com.nah.backend.service;

import com.nah.backend.dto.cart.CartDTO;
import com.nah.backend.dto.cart.request.UpdateCartItemRequest;

public interface CartService {
    // Lấy giỏ hàng hiện tại của người dùng
    CartDTO getCurrentCart(Integer userId);
    
    // Thêm sản phẩm vào giỏ hàng
    CartDTO addToCart(Integer userId, UpdateCartItemRequest request);
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    CartDTO updateCartItem(Integer userId, UpdateCartItemRequest request);
    
    // Xóa sản phẩm khỏi giỏ hàng
    CartDTO removeCartItem(Integer userId, Integer productId);
    
    // Giảm bớt số lượng sản phẩm trong giỏ hàng
    CartDTO decreaseCartItemQuantity(Integer userId, Integer productId, Integer quantity);
    
    // Xóa toàn bộ giỏ hàng
    void clearCart(Integer userId);
    
    // Tạo giỏ hàng rỗng (không lưu vào database)
    CartDTO createEmptyCart(Integer userId);
} 