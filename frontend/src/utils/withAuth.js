import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent, options = {}) => {
  
  const WithAuthComponent = (props) => {
    const { isAuthenticated, currentUser, loading, hasRole } = useAuth();
    const history = useHistory();
    const location = useLocation();
    
    const { 
      requiredRoles, 
      redirectPath = '/login', 
      adminOnly = false,
      excludeRoles = []
    } = options;
    
    useEffect(() => {
      if (loading) return; // Chờ quá trình xác thực hoàn tất
      
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (!isAuthenticated) {
        history.replace({
          pathname: redirectPath,
          state: { 
            from: location,
            message: 'Vui lòng đăng nhập để truy cập trang này'
          }
        });
        return;
      }
      
      // Kiểm tra vai trò bị loại trừ
      if (excludeRoles && excludeRoles.length > 0) {
        const hasExcludedRole = excludeRoles.some(role => hasRole(role));
        if (hasExcludedRole) {
          history.replace({
            pathname: '/error',
            state: { 
              status: 403,
              message: 'Bạn không có quyền truy cập trang này'
            }
          });
          return;
        }
      }
      
      // Kiểm tra adminOnly
      if (adminOnly && !hasRole('ADMIN')) {
        history.replace({
          pathname: '/error',
          state: { 
            status: 403,
            message: 'Chỉ Admin mới có quyền truy cập trang này'
          }
        });
        return;
      }
      
      // Nếu có yêu cầu vai trò cụ thể
      if (requiredRoles && requiredRoles.length > 0) {
        // Kiểm tra xem người dùng có ít nhất một trong các vai trò yêu cầu không
        const hasRequiredRole = requiredRoles.some(role => hasRole(role));
        
        if (!hasRequiredRole) {
          history.replace({
            pathname: '/error',
            state: { 
              status: 403,
              message: 'Bạn không có quyền truy cập trang này'
            }
          });
          return;
        }
      }
    }, [isAuthenticated, currentUser, loading, history, location, requiredRoles, adminOnly, excludeRoles]);
    
    // Hiển thị loading khi đang kiểm tra xác thực
    if (loading) {
      return <div className="loading-container">Đang tải...</div>;
    }
    
    // Nếu chưa đăng nhập hoặc không đủ quyền, component sẽ được chuyển hướng trong useEffect
    // Nếu đã đăng nhập và có đủ quyền, hiển thị component
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
  
  // Đặt tên hiển thị cho component mới để dễ debug
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithAuthComponent;
};

// Helper functions để tạo HOC với các quyền cụ thể
export const withAdminAuth = (WrappedComponent, redirectPath) => {
  return withAuth(WrappedComponent, { 
    adminOnly: true, 
    redirectPath 
  });
};

export const withSellerAuth = (WrappedComponent, redirectPath) => {
  return withAuth(WrappedComponent, { 
    requiredRoles: ['ADMIN', 'SELLER'], 
    redirectPath 
  });
};

export const withAdminOnlyAuth = (WrappedComponent, redirectPath) => {
  return withAuth(WrappedComponent, { 
    requiredRoles: ['ADMIN'],
    redirectPath 
  });
};

export default withAuth; 