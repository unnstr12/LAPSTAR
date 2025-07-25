import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Khởi tạo trạng thái xác thực từ localStorage khi component mount
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      
      if (storedUser && accessToken) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // Thiết lập header mặc định cho axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Hàm đăng nhập
  const login = (responseData) => {
    const { data } = responseData;
    const { token, user } = data;
    
    // Lưu thông tin người dùng và token vào localStorage
    const userToStore = {
      userId: user.userId,
      email: user.email, 
      fullName: user.fullName,
      role: user.roleName  // Lưu ý: API trả về roleName
    };
    
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', token); // Nếu không có refreshToken riêng, có thể dùng token chính
    
    // Cập nhật state
    setCurrentUser(userToStore);
    setIsAuthenticated(true);
    
    // Thiết lập header cho axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Đã đăng nhập với user:', userToStore); // Debug

    // Kích hoạt sự kiện đăng nhập thành công để components khác có thể lắng nghe
    const loginEvent = new CustomEvent('user-login-success', { detail: { user: userToStore } });
    window.dispatchEvent(loginEvent);
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      // Lấy token từ localStorage trước khi xóa
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Đảm bảo header Authorization được thiết lập chính xác
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Gọi API logout với token hiện tại
        await axios.post('/api/auth/logout');
        console.log('Đã gọi API đăng xuất thành công');
      } else {
        console.log('Không tìm thấy token để đăng xuất');
      }
    } catch (error) {
      console.log('Lỗi khi gọi API đăng xuất:', error);
      if (error.response) {
        console.log('Chi tiết lỗi:', error.response.data);
      }
      // Vẫn tiếp tục xử lý đăng xuất ở client ngay cả khi API bị lỗi
    } finally {
    // Xóa thông tin trong localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Xóa state
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Xóa header Authorization
    delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Kiểm tra nếu người dùng có quyền cụ thể
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    
    // Nếu requiredRole là mảng, kiểm tra xem user có bất kỳ quyền nào trong đó
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentUser.role);
    }
    
    // Nếu requiredRole là string, so sánh trực tiếp
    return currentUser.role === requiredRole;
  };

  // Hàm cập nhật token (khi refresh token)
  const updateTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    // Cập nhật header cho axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const contextValue = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    updateTokens
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dễ dàng sử dụng AuthContext
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  
  return authContext;
};

export default AuthContext;