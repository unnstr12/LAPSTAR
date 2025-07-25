import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../utils/axiosConfig';
import '../css/product-list-admin.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [toasts, setToasts] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const history = useHistory();

  // Danh sách trường có thể sắp xếp
  const sortableFields = {
    'orderId': 'ID đơn hàng',
    'createdAt': 'Ngày đặt hàng',
    'totalAmount': 'Tổng tiền',
    'status': 'Trạng thái'
  };

  // Danh sách trạng thái đơn hàng
  const statusOptions = [
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao hàng' },
    { value: 'DELIVERED', label: 'Đã giao hàng' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'RETURNED', label: 'Hoàn hàng' }
  ];

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

  // Lấy tất cả đơn hàng với phân trang
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Xây dựng params cho request
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir
      };

      // Thêm các tham số tìm kiếm nếu có
      if (activeSearchTerm) {
        params.keyword = activeSearchTerm;
      }

      if (selectedStatus) {
        params.status = selectedStatus;
      }

      if (startDate) {
        params.startDate = startDate;
      }

      if (endDate) {
        params.endDate = endDate;
      }
      
      const response = await axios.get('/api/admin/orders', { params });
      
      console.log('Đã gọi API getAllOrders:', response);
      
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setOrders(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCurrentPage(pageData.number);
      } else {
        setOrders([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, activeSearchTerm, selectedStatus, startDate, endDate]);

  // Khi component được tải
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Xử lý khi người dùng nhấn Enter trong ô tìm kiếm
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearch = () => {
    // Cập nhật từ khóa tìm kiếm hiện tại
    setActiveSearchTerm(searchTerm);
    // Đặt lại trang về 0 và gọi API
    setCurrentPage(0);
    // fetchAllOrders() sẽ được gọi tự động do useEffect khi activeSearchTerm thay đổi
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value || null);
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  // Xử lý thay đổi trong ô tìm kiếm - chỉ cập nhật state, không gọi API
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý thay đổi ngày bắt đầu
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(0);
  };

  // Xử lý thay đổi ngày kết thúc
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(0);
  };

  // Xử lý sort khi click vào header
  const handleSort = (field) => {
    // Nếu đang sort theo field này, đổi chiều sort
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // Nếu sort theo field mới, mặc định sort desc
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  // Thêm xử lý thay đổi kích thước trang
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi số lượng hiển thị
  };

  // Xử lý click vào đơn hàng để xem chi tiết
  const handleViewOrderDetail = (orderId) => {
    history.push(`/admin/orders/${orderId}`);
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

  // Định dạng ngày tháng
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

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Hiển thị biểu tượng sắp xếp
  const renderSortIcon = (field) => {
    if (sortBy !== field) return <i className="fa fa-sort text-muted"></i>;
    return sortDir === 'asc' ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>;
  };

  // Hiển thị loading
  if (loading && orders.length === 0) {
    return (
      <div className="admin-product-list-page">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quản lý Đơn hàng</h3>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="text-center p-5">
              <div className="admin-spinner"></div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-list-page">
      {/* Hiển thị nhiều toast */}
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

      <div className="admin-card-header">
        <h3 className="admin-card-title">Quản lý Đơn hàng</h3>
        <div className="d-flex">
          <div className="search-container mr-3 d-flex">
            <input
              type="text"
              className="admin-form-control"
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              style={{ minWidth: '250px', borderTopRightRadius: '0', borderBottomRightRadius: '0', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}
            />
            <button 
              className="admin-btn admin-btn-secondary" 
              onClick={handleSearch}
              style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          {/* Filter và tìm kiếm */}
          <div className="row">
            <div className="col-md-3 mb-3">
              <select 
                className="admin-form-control"
                value={selectedStatus || ''}
                onChange={handleStatusChange}
              >
                <option value="">Tất cả trạng thái</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <input
                type="date"
                className="admin-form-control"
                placeholder="Từ ngày"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <input
                type="date"
                className="admin-form-control"
                placeholder="Đến ngày"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex align-items-center">
                <select
                  className="admin-form-control"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10 đơn hàng</option>
                  <option value="20">20 đơn hàng</option>
                  <option value="30">30 đơn hàng</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="admin-alert admin-alert-danger">{error}</div>}

          {loading && (
            <div className="text-center p-5">
              <div className="admin-spinner"></div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          )}

          {!loading && orders.length === 0 ? (
            <div className="text-center p-5">
              <p>Không tìm thấy đơn hàng nào.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="admin-table product-table">
                  <thead>
                    <tr>
                      <th className="text-center sortable" onClick={() => handleSort('orderId')}>
                        Mã ĐH {renderSortIcon('orderId')}
                      </th>
                      <th>Khách hàng</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th className="text-center sortable" onClick={() => handleSort('createdAt')}>
                        Ngày đặt {renderSortIcon('createdAt')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('totalAmount')}>
                        Tổng tiền {renderSortIcon('totalAmount')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('status')}>
                        Trạng thái {renderSortIcon('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId} style={{cursor: 'pointer'}} onClick={() => handleViewOrderDetail(order.orderId)}>
                        <td className="text-center">{order.orderId}</td>
                        <td>{order.fullName || '-'}</td>
                        <td>{order.userEmail || '-'}</td>
                        <td>{order.phoneNumber || '-'}</td>
                        <td className="text-center">{formatDate(order.createdAt)}</td>
                        <td className="text-center">{formatCurrency(order.totalAmount)}</td>
                        <td className="text-center">
                          <span 
                            className={`admin-badge ${getStatusBadgeClass(order.status)}`}
                          >
                            {statusOptions.find(opt => opt.value === order.status)?.label || order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <nav className="admin-pagination-wrapper mt-4 d-flex justify-content-center">
                  <ul className="admin-pagination">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
