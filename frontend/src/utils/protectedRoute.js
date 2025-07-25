import React, { useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component Route bảo vệ, kiểm tra xác thực và quyền
const ProtectedRoute = ({ children, roles, ...rest }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const history = useHistory();
  
  // Thêm useEffect để kiểm tra xác thực mỗi khi vào trang protected
  useEffect(() => {
    // Nếu không xác thực, đảm bảo chuyển hướng
    if (!loading && !isAuthenticated) {
      history.replace({
        pathname: '/login',
        state: { message: 'Vui lòng đăng nhập để truy cập trang này' }
      });
    }
  }, [isAuthenticated, loading, history]);
  
  // Hiển thị loading nếu đang kiểm tra xác thực
  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }
  
  return (
    <Route
      {...rest}
      render={props => {
        // Kiểm tra đã đăng nhập chưa
        if (!isAuthenticated || !currentUser) {
          // Chuyển hướng đến trang đăng nhập kèm theo returnUrl
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location, message: 'Vui lòng đăng nhập để truy cập trang này' }
              }}
            />
          );
        }
        
        // Kiểm tra quyền nếu có yêu cầu - đảm bảo currentUser tồn tại
        if (roles && currentUser && !roles.includes(currentUser.role)) {
          // Chuyển hướng đến trang lỗi 403 (không có quyền)
          return (
            <Redirect
              to={{
                pathname: '/error',
                state: { 
                  status: 403, 
                  message: 'Bạn không có quyền truy cập trang này' 
                }
              }}
            />
          );
        }
        
        // Người dùng đã đăng nhập và có quyền, hiển thị component
        return React.cloneElement(children, props);
      }}
    />
  );
};

export default ProtectedRoute; 