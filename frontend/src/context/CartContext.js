import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Khởi tạo giỏ hàng:
  // - Nếu đã đăng nhập: Lấy từ API
  // - Nếu chưa đăng nhập: Lấy từ localStorage
  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      
      try {
        if (isAuthenticated) {
          // Đã đăng nhập, lấy giỏ hàng từ API
          const response = await axios.get('/api/cart');
          if (response.data && response.data.success) {
            setCart(response.data.data);
            setError(null);
          } else {
            throw new Error(response.data?.message || 'Không thể tải giỏ hàng');
          }
        } else {
          // Chưa đăng nhập, lấy giỏ hàng từ localStorage
          const localCart = localStorage.getItem('guestCart');
          if (localCart) {
            setCart(JSON.parse(localCart));
          }
          setError(null);
        }
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
        setError(error.response?.data?.message || 'Lỗi khi tải giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [isAuthenticated]);

  // Lưu giỏ hàng khách vào localStorage khi thay đổi
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, loading]);

  // Lắng nghe sự kiện đăng nhập thành công để đồng bộ giỏ hàng
  useEffect(() => {
    const handleUserLogin = () => {
      // Đồng bộ giỏ hàng từ localStorage khi người dùng đăng nhập
      syncCartWithServer();
    };

    // Đăng ký lắng nghe sự kiện
    window.addEventListener('user-login-success', handleUserLogin);

    // Hủy đăng ký khi component unmount
    return () => {
      window.removeEventListener('user-login-success', handleUserLogin);
    };
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    try {
      if (isAuthenticated) {
        // Đã đăng nhập, gọi API để thêm vào giỏ hàng
        const response = await axios.post('/api/cart/items', {
          productId,
          quantity
        });

        if (response.data && response.data.success) {
          setCart(response.data.data);
          return { success: true, message: 'Đã thêm vào giỏ hàng' };
        } else {
          throw new Error(response.data?.message || 'Không thể thêm vào giỏ hàng');
        }
      } else {
        // Chưa đăng nhập, thêm vào localStorage
        // Lấy thông tin sản phẩm
        const productResponse = await axios.get(`/api/products/${productId}`);
        if (!productResponse.data || !productResponse.data.success) {
          throw new Error('Không thể lấy thông tin sản phẩm');
        }

        const productData = productResponse.data.data;
        
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex !== -1) {
          // Sản phẩm đã tồn tại, cập nhật số lượng
          const updatedItems = [...cart.items];
          updatedItems[existingItemIndex].quantity += quantity;
          
          // Tính lại tổng tiền
          const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
          
          setCart({
            items: updatedItems,
            totalAmount,
            totalItems
          });
        } else {
          // Thêm sản phẩm mới
          const newItem = {
            productId: productId,
            productName: productData.name,
            price: productData.price,
            quantity: quantity,
            productImage: productData.mainImage,
            cartItemId: Date.now() // Tạo ID tạm thời
          };
          
          const updatedItems = [...cart.items, newItem];
          
          // Tính lại tổng tiền
          const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
          
          setCart({
            items: updatedItems,
            totalAmount,
            totalItems
          });
        }
        
        return { success: true, message: 'Đã thêm vào giỏ hàng' };
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi thêm vào giỏ hàng'
      };
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        // Đã đăng nhập, gọi API
        const response = await axios.put('/api/cart/items', {
          productId,
          quantity
        });

        if (response.data && response.data.success) {
          setCart(response.data.data);
          return { success: true, message: 'Đã cập nhật số lượng sản phẩm' };
        } else {
          throw new Error(response.data?.message || 'Không thể cập nhật số lượng sản phẩm');
        }
      } else {
        // Chưa đăng nhập, cập nhật trong localStorage
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex === -1) {
          throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
        }
        
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity = quantity;
        
        // Tính lại tổng tiền
        const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        setCart({
          items: updatedItems,
          totalAmount,
          totalItems
        });
        
        return { success: true, message: 'Đã cập nhật số lượng sản phẩm' };
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi cập nhật số lượng sản phẩm'
      };
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (productId) => {
    try {
      if (isAuthenticated) {
        // Đã đăng nhập, gọi API
        const response = await axios.delete(`/api/cart/items/${productId}`);

        if (response.data && response.data.success) {
          setCart(response.data.data);
          return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
        } else {
          throw new Error(response.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
        }
      } else {
        // Chưa đăng nhập, xóa từ localStorage
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        
        // Tính lại tổng tiền
        const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        setCart({
          items: updatedItems,
          totalAmount,
          totalItems
        });
        
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng'
      };
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        // Đã đăng nhập, gọi API
        const response = await axios.delete('/api/cart');

        if (response.data && response.data.success) {
          setCart({
            items: [],
            totalAmount: 0,
            totalItems: 0
          });
          return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
        } else {
          throw new Error(response.data?.message || 'Không thể xóa giỏ hàng');
        }
      } else {
        // Chưa đăng nhập, xóa từ localStorage
        setCart({
          items: [],
          totalAmount: 0,
          totalItems: 0
        });
        
        return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
      }
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi xóa giỏ hàng'
      };
    }
  };

  // Đồng bộ giỏ hàng từ localStorage lên server khi đăng nhập
  const syncCartWithServer = async () => {
    const localCart = localStorage.getItem('guestCart');
    if (!localCart) return;
    
    const parsedCart = JSON.parse(localCart);
    if (!parsedCart.items || parsedCart.items.length === 0) return;
    
    try {
      // Duyệt qua từng sản phẩm trong localStorage và thêm vào giỏ hàng trên server
      for (const item of parsedCart.items) {
        await axios.post('/api/cart/items', {
          productId: item.productId,
          quantity: item.quantity
        });
      }
      
      // Sau khi đồng bộ xong, xóa giỏ hàng trong localStorage
      localStorage.removeItem('guestCart');
      
      // Tải lại giỏ hàng từ server
      const response = await axios.get('/api/cart');
      if (response.data && response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi đồng bộ giỏ hàng:', error);
    }
  };

  const contextValue = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    syncCartWithServer
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook để dễ dàng sử dụng CartContext
export const useCart = () => {
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    throw new Error('useCart phải được sử dụng trong CartProvider');
  }
  
  return cartContext;
};

export default CartContext; 