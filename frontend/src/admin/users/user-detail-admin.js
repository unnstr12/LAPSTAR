import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../../utils/axiosConfig';
import '../css/product-detail-admin.css';

const UserDetailAdmin = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    userId: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    avatar: '',
    roleName: '',
    createdAt: null,
    updatedAt: null,
    isDeleted: false
  });

  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Thông báo
  const [toasts, setToasts] = useState([]);

  // Danh sách các role có thể chọn
  const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'SELLER' },
    { id: 3, name: 'USER' }
  ];

  // Hiển thị thông báo
  const showToast = (message, type = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      type,
      show: true
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id));
    }, 2000);
  };

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/admin/users/${id}`);
        console.log('User data:', response.data);

        if (response.data && response.data.data) {
          const userData = response.data.data;
          setUser(userData);

          if (userData.avatar) {
            setPreviewAvatar(userData.avatar);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserDetail();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  // Lấy danh sách đơn hàng của người dùng
  const fetchUserOrders = useCallback(async () => {
    if (!user.email) return;

    try {
      setOrderLoading(true);
      setOrderError(null);

      const response = await axios.get('/api/admin/orders', {
        params: {
          userEmail: user.email,
          page: 0,
          size: 10,
          sortBy: 'createdAt',
          sortDir: 'desc'
        }
      });

      console.log('User orders:', response.data);

      if (response.data && response.data.data) {
        setUserOrders(response.data.data.content);
      } else {
        setUserOrders([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      setOrderError('Không thể tải danh sách đơn hàng.');
    } finally {
      setOrderLoading(false);
    }
  }, [user.email]);

  // Lấy danh sách đơn hàng khi có email người dùng
  useEffect(() => {
    if (user.email) {
      fetchUserOrders();
    }
  }, [user.email, fetchUserOrders]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Lưu thay đổi
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi API thay đổi vai trò người dùng
      const roleRequest = {
        roleId: roles.find(role => role.name === user.roleName)?.id
      };

      // Gọi API changeUserRole
      await axios.put(`/api/admin/users/${id}/role`, roleRequest);

      showToast('Cập nhật người dùng thành công');

      // Đợi 1s và điều hướng về trang danh sách người dùng
      setTimeout(() => {
        history.push('/admin/users');
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      showToast('Không thể cập nhật người dùng. Vui lòng thử lại.', 'error');
    }
  };

  const handleViewOrderDetail = (orderId) => {
    history.push(`/admin/orders/${orderId}`);
  };

  // Xử lý bật/tắt trạng thái người dùng
  const handleToggleStatus = async () => {
    try {
      if (user.isDeleted) {
        // Kích hoạt tài khoản
        await axios.put(`/api/admin/users/${id}/enable`);
        setUser({
          ...user,
          isDeleted: false
        });
        showToast('Tài khoản đã được kích hoạt thành công');
      } else {
        // Vô hiệu hóa tài khoản
        await axios.delete(`/api/admin/users/${id}`);
        setUser({
          ...user,
          isDeleted: true
        });
        showToast('Tài khoản đã được vô hiệu hóa thành công');
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái người dùng:', error);
      showToast('Không thể thay đổi trạng thái người dùng. Vui lòng thử lại.', 'error');
    }
  };

  // Tạo URL avatar đầy đủ
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return `${process.env.PUBLIC_URL}/assets/img/user/default-avatar.jpg`;

    // Nếu là URL preview của file vừa chọn
    if (avatarUrl.startsWith('blob:')) return avatarUrl;

    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    // Nếu avatarUrl bắt đầu bằng dấu /, bỏ dấu / ở đầu để tránh lặp
    const imagePath = avatarUrl.startsWith('/') ? avatarUrl.substring(1) : avatarUrl;

    return `${baseUrl}/${imagePath}`;
  };

  // Định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Lấy class CSS cho trạng thái đơn hàng
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'admin-badge-warning';
      case 'CONFIRMED':
        return 'admin-badge-info';
      case 'SHIPPING':
        return 'admin-badge-primary';
      case 'DELIVERED':
        return 'admin-badge-success';
      case 'COMPLETED':
        return 'admin-badge-success';
      case 'CANCELLED':
        return 'admin-badge-danger';
      default:
        return 'admin-badge-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => history.push('/admin/users')}>
          Quay lại danh sách người dùng
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Toast thông báo */}
      <div className="admin-toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`admin-toast ${toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="product-detail-header">
          <div className="header-left">
            <button type="button" className="back-button" onClick={() => history.push('/admin/users')}>
              <i className="fas fa-chevron-left"></i> Người dùng
            </button>
            <h1>Chi tiết người dùng</h1>
          </div>
          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-save"></i> Lưu thay đổi
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => history.push('/admin/users')}
            >
              <i className="fas fa-times"></i> Hủy
            </button>
          </div>
        </div>
        <div className="product-detail-body">

          {/* Sidebar Area */}
          <div className="sidebar" style={{ maxWidth: '400px' }}>
            <div className="card history-card">
              <h2 className="card-title">Thông tin người dùng</h2>
              <div className="history-item">
                <div className="profile-avatar">
                  <a href="#" data-toggle="modal" data-target="#avatarModal">
                    <img
                      src={getAvatarUrl(previewAvatar)}
                      alt={user.fullName || 'Avatar'}
                    />
                  </a>
                  <div className="modal fade" id="avatarModal" tabIndex="-1" role="dialog" aria-labelledby="avatarModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                      <div className="modal-content">
                        <img
                          src={getAvatarUrl(previewAvatar)}
                          alt={user.fullName || 'Avatar'}
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="history-item">
                <div className="label">ID người dùng</div>
                <div className="value">{user.userId || 'Chưa có'}</div>
              </div>
              <div className="history-item">
                <div className="label">Email</div>
                <div className="value">{user.email || 'Chưa có'}</div>
              </div>
              <div className="history-item">
                <div className="label">Họ và tên</div>
                <div className="value">{user.fullName || 'Chưa có'}</div>
              </div>
              <div className="history-item">
                <div className="label">Số điện thoại</div>
                <div className="value">{user.phoneNumber || 'Chưa có'}</div>
              </div>
              <div className="history-item">
                <div className="label">Địa chỉ</div>
                <div className="value">{user.address || 'Chưa có'}</div>
              </div>
              <div className="history-item">
                <div className="label">Ngày tạo</div>
                <div className="value">{formatDate(user.createdAt)}</div>
              </div>
              <div className="history-item">
                <div className="label">Cập nhật cuối</div>
                <div className="value">{formatDate(user.updatedAt)}</div>
              </div>
              <div className="history-item">
                <div className="label">Trạng thái</div>
                <div className="value status-toggle">
                  <span
                    className={`admin-badge ${user.isDeleted ? 'admin-badge-danger' : 'admin-badge-success'}`}
                    onClick={handleToggleStatus}
                    style={{ cursor: 'pointer' }}
                    title={user.isDeleted ? 'Click để kích hoạt tài khoản' : 'Click để vô hiệu hóa tài khoản'}
                  >
                    {user.isDeleted ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}
                  </span>
                </div>
              </div>
              <div className="history-item align-items-center">
                  <div className="label">Vai trò</div>
                  <div className="mb-0 form-group select-wrapper">
                    <select
                      id="roleName"
                      name="roleName"
                      className='p-0 pl-3 pr-5'
                      value={user.roleName || ''}
                      onChange={handleInputChange}
                      required
                      style={{ height: '36px' }}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-content">
            {/* Đơn hàng của người dùng */}
            <div className="card attributes-card">
              <h2 className="card-title">Đơn hàng gần đây</h2>
              {orderLoading ? (
                <div className="text-center p-3">
                  <div className="admin-spinner"></div>
                  <p>Đang tải dữ liệu đơn hàng...</p>
                </div>
              ) : orderError ? (
                <div className="admin-alert admin-alert-danger">{orderError}</div>
              ) : userOrders.length === 0 ? (
                <p className="text-center p-3">Không có đơn hàng nào.</p>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table product-table">
                    <thead>
                      <tr>
                        <th className="text-center">Mã ĐH</th>
                        <th className="text-center">Ngày đặt</th>
                        <th className="text-center">Tổng tiền</th>
                        <th className="text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map(order => (
                        <tr key={order.orderId} style={{ cursor: 'pointer' }} onClick={() => handleViewOrderDetail(order.orderId)}>
                          <td className="text-center">{order.orderId}</td>
                          <td className="text-center">{formatDate(order.createdAt)}</td>
                          <td className="text-center">{formatCurrency(order.totalAmount)}</td>
                          <td className="text-center">
                            <span className={`admin-badge ${getStatusBadgeClass(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>


        </div>
      </form>
    </div>
  );
};

export default UserDetailAdmin;
