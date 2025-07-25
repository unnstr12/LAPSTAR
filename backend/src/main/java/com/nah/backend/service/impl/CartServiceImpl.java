package com.nah.backend.service.impl;

import com.nah.backend.dto.cart.CartDTO;
import com.nah.backend.dto.cart.CartItemDTO;
import com.nah.backend.dto.cart.request.UpdateCartItemRequest;
import com.nah.backend.model.Cart;
import com.nah.backend.model.CartItem;
import com.nah.backend.model.Product;
import com.nah.backend.model.ProductImage;
import com.nah.backend.model.User;
import com.nah.backend.repository.CartRepository;
import com.nah.backend.repository.ProductImageRepository;
import com.nah.backend.repository.ProductRepository;
import com.nah.backend.repository.UserRepository;
import com.nah.backend.service.CartService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    @Transactional(readOnly = true)
    public CartDTO getCurrentCart(Integer userId) {
        try {
            Cart cart = getOrCreateCart(userId);
            return convertToDTO(cart);
        } catch (Exception e) {
            // Nếu có lỗi (ví dụ: kết nối read-only), trả về giỏ hàng rỗng
            return createEmptyCart(userId);
        }
    }

    @Override
    public CartDTO createEmptyCart(Integer userId) {
        CartDTO emptyCart = new CartDTO();
        emptyCart.setUserId(userId);
        emptyCart.setItems(new ArrayList<>());
        emptyCart.setTotalAmount(0.0);
        emptyCart.setTotalItems(0);
        emptyCart.setUpdatedAt(LocalDateTime.now());
        return emptyCart;
    }

    @Override
    @Transactional
    public CartDTO addToCart(Integer userId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));
        
        // Kiểm tra sản phẩm có trong giỏ hàng chưa
        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(request.getProductId()))
                .findFirst();
        
        // Lấy số lượng hiện có trong giỏ hàng (0 nếu chưa có sản phẩm này trong giỏ)
        int currentQuantityInCart = existingItemOpt.map(CartItem::getQuantity).orElse(0);
        
        // Kiểm tra xem số lượng tồn kho có đủ để thêm vào giỏ hàng không
        if (product.getStockQuantity() < currentQuantityInCart + request.getQuantity()) {
            throw new IllegalStateException(
                "Không đủ hàng trong kho. Sản phẩm " + product.getProductName() + 
                " chỉ còn " + product.getStockQuantity() + " sản phẩm (bạn đã có " + 
                currentQuantityInCart + " sản phẩm trong giỏ hàng)."
            );
        }
        
        if (existingItemOpt.isPresent()) {
            // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            // Không cần cập nhật giá ở đây nữa
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            // Không cần set giá ở đây nữa
            cart.getCartItems().add(newItem);            
        }
        
        Cart updatedCart = cartRepository.save(cart);
        return convertToDTO(updatedCart);
    }

    @Override
    @Transactional
    public CartDTO updateCartItem(Integer userId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        // Tìm item trong giỏ hàng
        CartItem itemToUpdate = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));
        
        Product product = itemToUpdate.getProduct();
        
        // Nếu yêu cầu cập nhật số lượng nhiều hơn số lượng trong kho
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalStateException(
                "Không đủ hàng trong kho. Sản phẩm " + product.getProductName() + 
                " chỉ còn " + product.getStockQuantity() + " sản phẩm."
            );
        }
        
        // Chỉ cập nhật số lượng, không cần cập nhật giá
        itemToUpdate.setQuantity(request.getQuantity());
        
        Cart updatedCart = cartRepository.save(cart);
        return convertToDTO(updatedCart);
    }

    @Override
    @Transactional
    public CartDTO removeCartItem(Integer userId, Integer productId) {
        Cart cart = getOrCreateCart(userId);
        
        // Tìm và xóa item khỏi giỏ hàng
        cart.getCartItems().removeIf(item -> item.getProduct().getProductId().equals(productId));
        
        Cart updatedCart = cartRepository.save(cart);
        return convertToDTO(updatedCart);
    }

    @Override
    @Transactional
    public void clearCart(Integer userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
    
    @Override
    @Transactional
    public CartDTO decreaseCartItemQuantity(Integer userId, Integer productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Số lượng giảm phải lớn hơn 0");
        }
        
        Cart cart = getOrCreateCart(userId);
        
        // Tìm item trong giỏ hàng
        Optional<CartItem> cartItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();
        
        if (cartItemOpt.isEmpty()) {
            throw new EntityNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng");
        }
        
        CartItem cartItem = cartItemOpt.get();
        
        // Xác định số lượng mới
        int newQuantity = cartItem.getQuantity() - quantity;
        
        // Nếu số lượng mới <= 0, xóa sản phẩm khỏi giỏ hàng
        if (newQuantity <= 0) {
            cart.getCartItems().remove(cartItem);
        } else {
            // Ngược lại, cập nhật số lượng mới
            cartItem.setQuantity(newQuantity);
        }
        
        // Lưu giỏ hàng
        Cart updatedCart = cartRepository.save(cart);
        
        return convertToDTO(updatedCart);
    }
    
    // Phương thức trợ giúp để lấy hoặc tạo giỏ hàng cho người dùng
    private Cart getOrCreateCart(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: " + userId));
        
        return cartRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }
    
    // Chuyển đổi từ Cart entity sang CartDTO
    @SuppressWarnings("null")
    private CartDTO convertToDTO(Cart cart) {
        List<CartItem> items = cart.getCartItems();
        Map<Integer, String> productImagesMap = new HashMap<>();

        if (items != null && !items.isEmpty()) {
            List<Integer> productIds = items.stream()
                                           .map(item -> item.getProduct().getProductId())
                                           .distinct()
                                           .collect(Collectors.toList());
            
            if (!productIds.isEmpty()) {
                // Lưu ý: Cần tạo phương thức này trong ProductImageRepository: List<ProductImage> findByProductProductIdIn(List<Integer> productIds);
                List<ProductImage> allImagesForCartProducts = productImageRepository.findByProduct_ProductIdIn(productIds); // Giả sử tên phương thức là findByProduct_ProductIdIn
                Map<Integer, List<ProductImage>> imagesByProductId = allImagesForCartProducts.stream()
                    .collect(Collectors.groupingBy(img -> img.getProduct().getProductId()));
                
                for(Integer productId : productIds) {
                    imagesByProductId.getOrDefault(productId, Collections.emptyList()).stream()
                        .findFirst()
                        .map(ProductImage::getImageUrl)
                        .ifPresent(url -> productImagesMap.put(productId, url));
                }
            }
        }

        List<CartItemDTO> itemDTOs = items.stream()
                .map(item -> convertToDTO(item, productImagesMap.get(item.getProduct().getProductId())))
                .collect(Collectors.toList());
                
        Double totalAmount = cart.getTotalAmount();
        Integer totalItems = cart.getCartItems().size();
        
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getCartId());
        cartDTO.setUserId(cart.getUser().getUserId());
        cartDTO.setItems(itemDTOs);
        cartDTO.setTotalAmount(totalAmount);
        cartDTO.setUpdatedAt(cart.getUpdatedAt());
        cartDTO.setTotalItems(totalItems);
        
        return cartDTO;
    }
    
    // Chuyển đổi từ CartItem entity sang CartItemDTO
    private CartItemDTO convertToDTO(CartItem cartItem, String preloadedProductImage) {
        Product product = cartItem.getProduct();
        
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(cartItem.getCartItemId());
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setProductImage(preloadedProductImage);
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(product.getFinalPrice().doubleValue());
        dto.setSubTotal(product.getFinalPrice().doubleValue() * cartItem.getQuantity());
        
        return dto;
    }
} 