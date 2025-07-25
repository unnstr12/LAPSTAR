package com.nah.backend.controller.user;

import com.nah.backend.dto.cart.CartDTO;
import com.nah.backend.dto.cart.request.UpdateCartItemRequest;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.service.CartService;
import com.nah.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getCurrentCart() {
        try {
            Integer userId = getCurrentUserId();
            CartDTO cart = cartService.getCurrentCart(userId);
            
            // Kiểm tra nếu giỏ hàng trống
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Giỏ hàng của bạn hiện đang trống", cart));
            }
            
            return ResponseEntity.ok(ApiResponse.success(cart));
        } catch (EntityNotFoundException e) {
            // Xử lý khi không tìm thấy người dùng
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            // Xử lý lỗi kết nối read-only hoặc lỗi khác
            Integer userId = getCurrentUserId();
            CartDTO emptyCart = cartService.createEmptyCart(userId);
            return ResponseEntity.ok(ApiResponse.success("Giỏ hàng của bạn hiện đang trống", emptyCart));
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@Valid @RequestBody UpdateCartItemRequest request) {
        try {
            Integer userId = getCurrentUserId();
            CartDTO cart = cartService.addToCart(userId, request);
            return ResponseEntity.ok(ApiResponse.success("Thêm vào giỏ hàng thành công", cart));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể thêm sản phẩm vào giỏ hàng: " + e.getMessage()));
        }
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    @PutMapping("/items")
    public ResponseEntity<?> updateCartItem(@Valid @RequestBody UpdateCartItemRequest request) {
        try {
            Integer userId = getCurrentUserId();
            CartDTO cart = cartService.updateCartItem(userId, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật giỏ hàng thành công", cart));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể cập nhật giỏ hàng: " + e.getMessage()));
        }
    }
    

    @PutMapping("/items/decrease")
    public ResponseEntity<?> decreaseCartItemQuantity(@Valid @RequestBody UpdateCartItemRequest request) {
        try {
            Integer userId = getCurrentUserId();
            CartDTO cart = cartService.decreaseCartItemQuantity(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(ApiResponse.success("Đã giảm số lượng sản phẩm trong giỏ hàng", cart));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể giảm số lượng sản phẩm: " + e.getMessage()));
        }
    }


    @DeleteMapping("/items/{productId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Integer productId) {
        try {
            Integer userId = getCurrentUserId();
            CartDTO cart = cartService.removeCartItem(userId, productId);
            return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm khỏi giỏ hàng thành công", cart));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa sản phẩm khỏi giỏ hàng: " + e.getMessage()));
        }
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        try {
            Integer userId = getCurrentUserId();
            cartService.clearCart(userId);
            return ResponseEntity.ok(ApiResponse.success("Đã xóa toàn bộ giỏ hàng"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa giỏ hàng: " + e.getMessage()));
        }
    }

    /**
     * Lấy ID người dùng hiện tại từ token
     */
    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).getUserId();
    }
} 