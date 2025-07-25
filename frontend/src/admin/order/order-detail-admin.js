import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import '../../utils/axiosConfig';
import '../css/order-detail-admin.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusToChange, setStatusToChange] = useState(null);
  const [statusModalTitle, setStatusModalTitle] = useState('');

  // Thông báo
  const [toasts, setToasts] = useState([]);

  const orderStatusList = [
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao hàng' },
    { value: 'DELIVERED', label: 'Đã giao hàng' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'RETURNED', label: 'Hoàn hàng' }
  ];

  const paymentStatusList = [
    { value: 'NOT_PAID', label: 'Chưa thanh toán' },
    { value: 'PAID', label: 'Đã thanh toán' }
  ];

  const paymentMethodList = [
    { value: 'CASH', label: 'Tiền mặt khi nhận hàng' },
    { value: 'VN_PAY', label: 'VN Pay' }
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

  // Lấy thông tin chi tiết người dùng
  const fetchUserDetail = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}`);
      if (response.data && response.data.success) {
        setUserDetail(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  // Lấy thông tin chi tiết đơn hàng
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/admin/orders/${id}`);

        if (response.data && response.data.data) {
          const orderData = response.data.data;
          setOrder(orderData);
          
          // Nếu có userId, lấy thông tin chi tiết người dùng
          if (orderData.userId) {
            await fetchUserDetail(orderData.userId);
          }
        } else {
          setError('Không tìm thấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    if (!statusToChange) return;

    try {
      setIsLoading(true);
      const response = await axios.put(`/api/admin/orders/${id}/status`, {
        status: statusToChange
      });

      if (response.data && response.data.success) {
        setOrder(response.data.data);
        showToast(`Cập nhật trạng thái đơn hàng thành công: ${getStatusLabel(statusToChange)}`);
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      showToast('Không thể cập nhật trạng thái đơn hàng', 'error');
    } finally {
      setIsLoading(false);
      setStatusToChange(null);
    }
  };

  // Mở modal xác nhận chuyển trạng thái
  const openStatusConfirmModal = (status, title) => {
    setStatusToChange(status);
    setStatusModalTitle(title);
    setShowConfirmModal(true);
  };

  // Tạo URL ảnh đầy đủ
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;

    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    // Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / ở đầu để tránh lặp
    const imagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

    return `${baseUrl}${imagePath}`;
  };

  // Định dạng tiền tệ
  const formatCurrency = (value) => {
    if (typeof value !== 'number') {
      // Chuyển đổi scientific notation thành số
      if (typeof value === 'string' && value.includes('E')) {
        value = parseFloat(value);
      } else {
        return '0 đ';
      }
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
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

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Lấy class CSS cho trạng thái đơn hàng
  const getStatusBadgeClass = (status) => {
    if (!status) return 'admin-badge-secondary';

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
      case 'RETURNED':
        return 'admin-badge-danger';
      default:
        return 'admin-badge-secondary';
    }
  };

  // Lấy class CSS cho trạng thái thanh toán
  const getPaymentStatusBadgeClass = (status) => {
    if (!status) return 'admin-badge-secondary';

    switch (status) {
      case 'PAID':
        return 'admin-badge-success';
      case 'NOT_PAID':
        return 'admin-badge-warning';
      default:
        return 'admin-badge-secondary';
    }
  };

  // Lấy nhãn hiển thị cho trạng thái đơn hàng
  const getStatusLabel = (status) => {
    if (!status) return 'Không xác định';
    const statusObj = orderStatusList.find(item => item.value === status);
    return statusObj ? statusObj.label : status;
  };

  // Lấy nhãn hiển thị cho phương thức thanh toán
  const getPaymentMethodLabel = (method) => {
    if (!method) return 'Không xác định';
    const methodObj = paymentMethodList.find(item => item.value === method);
    return methodObj ? methodObj.label : method;
  };

  // Lấy nhãn hiển thị cho trạng thái thanh toán
  const getPaymentStatusLabel = (status) => {
    if (!status) return 'Không xác định';
    const statusObj = paymentStatusList.find(item => item.value === status);
    return statusObj ? statusObj.label : status;
  };

  // Hiển thị các nút trạng thái dựa trên trạng thái hiện tại
  const renderStatusButtons = () => {
    if (!order) return null;

    const currentStatus = order.status;
    const buttons = [];

    switch (currentStatus) {
      case 'PENDING':
        // Chỉ hiển thị nút "Xác nhận đơn hàng" khi phương thức thanh toán khác VN_PAY
        if (order.paymentMethod !== 'VN_PAY') {
        buttons.push(
          <button 
            key="confirm" 
            className="admin-btn admin-btn-info mr-2"
            onClick={() => openStatusConfirmModal('CONFIRMED', 'Xác nhận đơn hàng')}
          >
            <i className="fas fa-check-circle"></i> Xác nhận đơn hàng
          </button>
        );
        }
        buttons.push(
          <button 
            key="cancel" 
            className="admin-btn admin-btn-danger"
            onClick={() => openStatusConfirmModal('CANCELLED', 'Hủy đơn hàng')}
          >
            <i className="fas fa-times-circle"></i> Hủy đơn hàng
          </button>
        );
        break;
        
      case 'CONFIRMED':
        buttons.push(
          <button 
            key="ship" 
            className="admin-btn admin-btn-primary mr-2"
            onClick={() => openStatusConfirmModal('SHIPPING', 'Bắt đầu giao hàng')}
          >
            <i className="fas fa-shipping-fast"></i> Bắt đầu giao hàng
          </button>
        );
        buttons.push(
          <button 
            key="cancel" 
            className="admin-btn admin-btn-danger"
            onClick={() => openStatusConfirmModal('CANCELLED', 'Hủy đơn hàng')}
          >
            <i className="fas fa-times-circle"></i> Hủy đơn hàng
          </button>
        );
        break;
        
      case 'SHIPPING':
        buttons.push(
          <button 
            key="deliver" 
            className="admin-btn admin-btn-success"
            onClick={() => openStatusConfirmModal('DELIVERED', 'Xác nhận đã giao hàng')}
          >
            <i className="fas fa-truck-loading"></i> Đã giao hàng
          </button>
        );
        break;
        
      case 'DELIVERED':
        buttons.push(
          <button 
            key="return" 
            className="admin-btn admin-btn-danger mr-2"
            onClick={() => openStatusConfirmModal('RETURNED', 'Xác nhận hoàn hàng')}
          >
            <i className="fas fa-undo-alt"></i> Hoàn hàng
          </button>
        );
        break;
        
      default:
        // Không hiển thị nút nếu trạng thái là COMPLETED, CANCELLED, RETURNED
        break;
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => history.push('/admin/orders')}>
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  if (!order) return null;

  const deliveryDate = (order.deliveredAt)
    ? formatDateOnly(order.deliveredAt)
    : '-';

  const trackingCode = order.orderId ? `TRK${order.orderId.toString().padStart(6, '0')}` : 'N/A';

  // Sử dụng thông tin từ API getUserById nếu có, ngược lại sử dụng từ đơn hàng
  const customerName = userDetail ? userDetail.fullName : order.fullName;
  const customerPhone = userDetail ? userDetail.phoneNumber : order.phoneNumber;
  const customerEmail = userDetail ? userDetail.email : order.userEmail;

  return (
    <div className="order-detail-container">
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

      {/* Modal xác nhận chuyển trạng thái */}
      {showConfirmModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h6 className='mb-0'>{statusModalTitle}</h6>
              <button className="admin-modal-close" onClick={() => setShowConfirmModal(false)}>
                <i className="fa fa-times"></i>
            </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Bạn có chắc chắn muốn {statusModalTitle.toLowerCase()} <strong>#{order.orderId}</strong> ?
              </p>
              <p>
                <strong>Trạng thái hiện tại:</strong> {getStatusLabel(order.status)}
                <br />
                <strong>Trạng thái mới:</strong> {getStatusLabel(statusToChange)}
              </p>
          </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowConfirmModal(false)}>
                Hủy
            </button>
            <button
                className="admin-btn admin-btn-primary"
                onClick={handleUpdateStatus}
            >
                Xác nhận
            </button>
            </div>
          </div>
        </div>
      )}

      <div className="order-detail-header-bar">
        <div className="header-left">
          <button type="button" className="back-button" onClick={() => history.push('/admin/orders')}>
            <i className="fas fa-chevron-left"></i> Đơn hàng
          </button>
          <h1>Chi tiết đơn hàng #{order.orderId}</h1>
        </div>
        <div className="header-actions">
          {renderStatusButtons()}
        </div>
      </div>

      <div className="order-detail-layout">
        {/* Main content: Status and Cart/Timeline */}
        <div className="order-detail-main-content">
          {/* Status Section */}
          <div className="status-section-container">
            <h2 className="section-title-main">Trạng thái</h2>
            <div className="status-cards-grid">
              <div className="status-card-item">
                <div className="icon-wrapper blue-icon">
                  <i className="fas fa-tag"></i>
                </div>
                <div className="info-content">
                  <div className="label">Mã đơn hàng</div>
                  <div className="value">#{order.orderId}</div>
                </div>
              </div>
              <div className="status-card-item">
                <div className="icon-wrapper blue-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <div className="info-content">
                  <div className="label">Trạng thái đơn hàng</div>
                  <div className="value">
                    <span className={`status-text ${getStatusBadgeClass(order.status).replace('admin-badge-', '')}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="status-card-item">
                <div className="icon-wrapper blue-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="info-content">
                  <div className="label">Ngày giao hàng</div>
                  <div className="value">{deliveryDate}</div>
                </div>
              </div>
              <div className="status-card-item">
                <div className="icon-wrapper blue-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="info-content">
                  <div className="label">Phương thức thanh toán</div>
                  <div className="value">{order.paymentMethod ? getPaymentMethodLabel(order.paymentMethod) : 'Không xác định'}</div>
                </div>
              </div>
              <div className="status-card-item">
                <div className="icon-wrapper blue-icon">
                  <i className="fas fa-money-check-alt"></i>
                </div>
                <div className="info-content">
                  <div className="label">Trạng thái thanh toán</div>
                  <div className="value">
                    <span className={`status-text ${getPaymentStatusBadgeClass(order.paymentStatus).replace('admin-badge-', '')}`}>
                      {order.paymentStatus ? getPaymentStatusLabel(order.paymentStatus) : 'Không xác định'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="status-card-item">
                <div className="icon-wrapper blue-icon">
                  <i className="fas fa-clock"></i>
            </div>
                <div className="info-content">
                  <div className="label">Ngày đặt hàng</div>
                  <div className="value">{formatDateOnly(order.createdAt)}</div>
                            </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="address-card-container">
            <h2 className="mb-2 section-title-main">Ghi chú</h2>
            <div className="info-content">
              <div className="summary-line">{order.note || 'Không có ghi chú'}</div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="order-cart-section">
            <h2 className="section-title-main">Giỏ hàng</h2>
            <div className="cart-items-list">
              {order.items && order.items.map(item => (
                <div className="cart-item-row" key={item.orderItemId}>
                  <div className="item-image-cart">
                    <img src={getImageUrl(item.productImage)} alt={item.productName} />
                  </div>
                  <Link to={`/admin/products/${item.productId}`} className="item-info-cart">
                    <div className="item-name-cart"><span>{item.productName}</span></div>
                    <div className="item-desc-cart">{item.quantity} x {formatCurrency(item.price)}</div>
                  </Link>
                  <div className="item-subtotal-cart">{formatCurrency(item.subTotal)}</div>
                </div>
              ))}
            </div>
            <div className="order-summary-cart">
              <div className="summary-line">
                <span>Tổng phụ</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="summary-line">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-line total">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Address Information */}
        <div className="order-detail-sidebar">
          <div className='infomation-container'>
            <h2 className="section-title-main">Thông tin</h2>
            <div className="address-card-container">
              <div className="address-section">
                <h3 className="address-subsection-title">KHÁCH HÀNG</h3>
                <div className="address-detail-item">
                  <i className="fas fa-user address-icon"></i>
                  <span>{customerName || 'Không xác định'}</span>
                </div>
                <div className="address-detail-item">
                  <i className="fas fa-envelope address-icon"></i>
                  <span>{customerEmail || 'Không xác định'}</span>
                </div>
                <div className="address-detail-item">
                  <i className="fas fa-phone address-icon"></i>
                  <span>{customerPhone || 'Không xác định'}</span>
                </div>
              </div>
              <div className="address-section">
                <h3 className="address-subsection-title">ĐỊA CHỈ GIAO HÀNG</h3>
                <div className="address-detail-item">
                  <i className="fas fa-user address-icon"></i>
                  <span>{order.fullName || 'Không xác định'}</span>
                </div>
                <div className="address-detail-item">
                  <i className="fas fa-map-marker-alt address-icon"></i>
                  <span>{order.addressDetail && order.ward && order.district && order.province ? 
                    `${order.addressDetail}, ${order.ward}, ${order.district}, ${order.province}` : 
                    'Không xác định'}</span>
                </div>
                <div className="address-detail-item">
                  <i className="fas fa-phone address-icon"></i>
                  <span>{order.phoneNumber || 'Không xác định'}</span>
              </div>
            </div>
              {order.paymentMethod && (
                <div className="address-section payment-section">
                  <h3 className="address-subsection-title">PHƯƠNG THỨC THANH TOÁN</h3>
                  <div className="address-detail-item">
                    <i className={order.paymentMethod === 'CASH' ? 'fas fa-money-bill-wave address-icon' : 'fas fa-credit-card address-icon'}></i>
                    <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  {order.paymentStatus && (
                    <div className="address-detail-item">
                      <i className="fas fa-check-circle address-icon"></i>
                      <span className={order.paymentStatus === 'PAID' ? 'text-success' : 'text-warning'}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </div>
                  )}
                  {order.paidAt && (
                    <div className="address-detail-item">
                      <i className="fas fa-calendar-check address-icon"></i>
                      <span>Thanh toán vào: {formatDate(order.paidAt)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="order-timeline-section">
            <h2 className="section-title-main">Lịch sử đơn hàng</h2>
            <div className="timeline-container">
              <div className="timeline-item">
                <div className="timeline-icon-dot"></div>
                <div className="timeline-content-details">
                  <h4>Đơn hàng được tạo</h4>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {order.pendingAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng đang chờ xử lý</h4>
                    <p>{formatDate(order.pendingAt)}</p>
                  </div>
                </div>
              )}

              {order.confirmedAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng đã xác nhận</h4>
                    <p>{formatDate(order.confirmedAt)}</p>
                  </div>
                </div>
              )}

              {order.shippingAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng đang giao</h4>
                    <p>{formatDate(order.shippingAt)}</p>
                  </div>
                </div>
              )}

              {order.deliveredAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng đã giao</h4>
                    <p>{formatDate(order.deliveredAt)}</p>
                  </div>
                </div>
              )}

              {order.completedAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng hoàn thành</h4>
                    <p>{formatDate(order.completedAt)}</p>
                  </div>
                </div>
              )}

              {order.cancelledAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot red-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng đã hủy</h4>
                    <p>{formatDate(order.cancelledAt)}</p>
                  </div>
                </div>
              )}

              {order.returnedAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot red-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng hoàn trả</h4>
                    <p>{formatDate(order.returnedAt)}</p>
                  </div>
                </div>
              )}

              {order.paidAt && (
                <div className="timeline-item">
                  <div className="timeline-icon-dot"></div>
                  <div className="timeline-content-details">
                    <h4>Đơn hàng đã thanh toán</h4>
                    <p>{formatDate(order.paidAt)}</p>
                  </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
