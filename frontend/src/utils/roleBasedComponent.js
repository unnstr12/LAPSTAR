import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Component để ẩn/hiện UI elements dựa trên quyền của user
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Danh sách các role được phép xem
 * @param {string[]} props.deniedRoles - Danh sách các role bị cấm xem
 * @param {boolean} props.adminOnly - Chỉ admin mới được xem
 * @param {React.ReactNode} props.children - Nội dung cần ẩn/hiện
 * @param {React.ReactNode} props.fallback - Nội dung hiển thị khi không có quyền
 */
const RoleBasedComponent = ({ 
  allowedRoles = [], 
  deniedRoles = [], 
  adminOnly = false, 
  children, 
  fallback = null 
}) => {
  const { hasRole, isAuthenticated } = useAuth();

  // Nếu chưa đăng nhập, không hiển thị gì
  if (!isAuthenticated) {
    return fallback;
  }

  // Kiểm tra adminOnly
  if (adminOnly && !hasRole('ADMIN')) {
    return fallback;
  }

  // Kiểm tra denied roles
  if (deniedRoles.length > 0) {
    const hasDeniedRole = deniedRoles.some(role => hasRole(role));
    if (hasDeniedRole) {
      return fallback;
    }
  }

  // Kiểm tra allowed roles
  if (allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => hasRole(role));
    if (!hasAllowedRole) {
      return fallback;
    }
  }

  return children;
};

// Helper components cho các trường hợp thường dùng
export const AdminOnly = ({ children, fallback = null }) => (
  <RoleBasedComponent adminOnly={true} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const AdminOrSeller = ({ children, fallback = null }) => (
  <RoleBasedComponent allowedRoles={['ADMIN', 'SELLER']} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const SellerOnly = ({ children, fallback = null }) => (
  <RoleBasedComponent allowedRoles={['SELLER']} deniedRoles={['ADMIN']} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export default RoleBasedComponent; 