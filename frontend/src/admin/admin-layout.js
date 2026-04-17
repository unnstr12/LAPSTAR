import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/admin-layout.css'; // Tạo file CSS riêng cho layout

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const { currentUser, isAuthenticated, logout, hasRole } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Kiểm tra xác thực và quyền admin khi component mount hoặc isAuthenticated thay đổi
  useEffect(() => {
    // Kiểm tra xác thực
    if (!isAuthenticated || !currentUser) {
      history.replace({
        pathname: '/login',
        state: { message: 'Vui lòng đăng nhập để truy cập trang quản trị' }
      });
      return;
    }

    // Nếu đã xác thực nhưng không có quyền ADMIN, chuyển hướng đến trang lỗi
    if (currentUser && !hasRole('ADMIN') && !hasRole('SELLER')) {
      history.replace({
        pathname: '/error',
        state: { 
          status: 403, 
          message: 'Bạn không có quyền truy cập trang quản trị' 
        }
      });
    }
  }, [currentUser, hasRole, history, isAuthenticated]);

  // Theo dõi kích thước màn hình để xác định giao diện di động
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 576;
      setIsMobile(mobile);
      
      // Tự động thu gọn sidebar trên tablet
      if (window.innerWidth <= 992 && window.innerWidth > 576) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Gọi lần đầu để thiết lập trạng thái ban đầu
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Xử lý click vào menu trên điện thoại - tự đóng sidebar
  const handleMobileMenuClick = () => {
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async (e) => {
    e.preventDefault();
    
    if (isLoggingOut) return; // Ngăn nhấn nhiều lần
    
    try {
      setIsLoggingOut(true);
      await logout(); // Đợi quá trình logout từ AuthContext hoàn tất
      history.push('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      // Vẫn chuyển hướng ngay cả khi có lỗi
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    history.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Nếu không có user hoặc chưa xác thực, không hiển thị layout admin
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  // Định nghĩa menu items với quyền hạn
  const allMenuItems = [
    {
      title: 'Tổng quan',
      icon: 'fa-tachometer-alt',
      path: '/admin/dashboard',
      requiredRoles: ['ADMIN'] // Chỉ ADMIN
    },
    {
      title: 'Quản lý Sản phẩm',
      icon: 'fa-box-open',
      path: '/admin/products',
      requiredRoles: ['ADMIN', 'SELLER'] // ADMIN và SELLER
    },
    {
      title: 'Quản lý Đơn hàng',
      icon: 'fa-shopping-cart',
      path: '/admin/orders',
      requiredRoles: ['ADMIN', 'SELLER'] // ADMIN và SELLER
    },
    {
      title: 'Quản lý Người dùng',
      icon: 'fa-users',
      path: '/admin/users',
      requiredRoles: ['ADMIN'] // Chỉ ADMIN
    },
    {
      title: 'Quản lý Coupon',
      icon: 'fa-tags',
      path: '/admin/coupons',
      requiredRoles: ['ADMIN', 'SELLER'] // ADMIN và SELLER
    },
  ];

  // Lọc menu items dựa trên quyền của user hiện tại
  const menuItems = allMenuItems.filter(item => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true; // Nếu không yêu cầu quyền đặc biệt, hiển thị cho tất cả
    }
    // Kiểm tra xem user có ít nhất một trong các quyền yêu cầu không
    return item.requiredRoles.some(role => hasRole(role));
  });

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  };

  // Tính toán các class cần thiết
  const sidebarClass = `admin-sidebar ${isMobile && showMobileSidebar ? 'show' : ''}`;
  const layoutClass = `admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`;

  return (
    <div className={layoutClass}>
      {/* Mobile backdrop */}
      {isMobile && showMobileSidebar && (
        <div 
          className="mobile-backdrop"
          onClick={() => setShowMobileSidebar(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99
          }}
        />
      )}
      
      {/* Sidebar */}
      <aside className={sidebarClass}>
        <div className="sidebar-header">
          <Link to="/" className="admin-logo">
            {isSidebarCollapsed ? 'LS' : 'LapStar Admin'}
          </Link>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fa ${isSidebarCollapsed || (isMobile && !showMobileSidebar) ? 'fa-indent' : 'fa-outdent'}`}></i>
          </button>
        </div>

        <nav className="admin-menu">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className={isActive(item.path) ? 'active' : ''}>
                <Link to={item.path} onClick={handleMobileMenuClick}>
                  <i className={`fa ${item.icon}`}></i>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {!isSidebarCollapsed && <span>© 2026 LapStar</span>}
          <a href="#" onClick={handleLogout} title="Đăng xuất" className={isLoggingOut ? 'disabled-link' : ''}>
            <i className="fa fa-sign-out-alt"></i>
            {isLoggingOut && <span className="logout-spinner"></span>}
          </a>
        </div>
      </aside>

      {/* Mobile header (chỉ hiển thị ở chế độ điện thoại) */}
      {isMobile && (
        <div className="mobile-header" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 98,
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px'
        }}>
          <button 
            onClick={toggleSidebar} 
            className="menu-toggle"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            <i className="fa fa-bars"></i>
          </button>
          <div style={{ marginLeft: '15px', fontWeight: 600 }}>LapStar Admin</div>
          <div style={{ marginLeft: 'auto' }}>
            {currentUser && (
              <span>{currentUser.fullName} &nbsp;
                <a href="#" onClick={handleLogout} className={isLoggingOut ? 'disabled-link' : ''}>
                  <i className="fa fa-sign-out-alt"></i>
                  {isLoggingOut && <span className="logout-spinner"></span>}
                </a>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="admin-main-content" style={isMobile ? { marginTop: '60px' } : {}}>
        <div className="admin-page-content">
          {children} {/* Nội dung trang cụ thể sẽ được render ở đây */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
