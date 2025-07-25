import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../utils/axiosConfig';
import '../css/product-list-admin.css';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('couponId');
  const [sortDir, setSortDir] = useState('asc');
  const [toasts, setToasts] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

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

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/admin/coupons', {
        params: {
          page: currentPage,
          size: pageSize,
          sortBy,
          sortDir,
          keyword: activeSearchTerm,
          isActive: isActiveFilter
        }
      });
      
      console.log('Đã gọi API getCoupons:', response);
      
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setCoupons(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCurrentPage(pageData.pageNo);
      } else {
        setCoupons([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách coupon:', err);
      setError('Không thể tải danh sách coupon. Vui lòng thử lại sau.');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, activeSearchTerm, isActiveFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setIsActiveFilter(value === '' ? null : value === 'true');
    setCurrentPage(0);
  };

  // Xử lý sort khi click vào header
  const handleSort = (field) => {
    // Nếu đang sort theo field này, đổi chiều sort
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // Nếu sort theo field mới, mặc định sort asc
      setSortBy(field);
      setSortDir('asc');
    }
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  // Hiển thị biểu tượng sắp xếp
  const renderSortIcon = (field) => {
    if (sortBy !== field) return <i className="fa fa-sort text-muted"></i>;
    return sortDir === 'asc' ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>;
  };

  const openConfirmModal = (coupon) => {
    setSelectedCoupon(coupon);
    setConfirmAction(coupon.active ? 'deactivate' : 'activate');
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedCoupon(null);
    setConfirmAction(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedCoupon) return;
    
    try {
      const endpoint = confirmAction;
      const response = await axios.put(`/api/admin/coupons/${selectedCoupon.couponId}/${endpoint}`);
      
      if (response.data && response.data.message) {
        showToast(response.data.message);
      }
      
      closeConfirmModal();
      fetchCoupons();
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái coupon:', err);   
      if (err.response && err.response.data && err.response.data.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Không thể cập nhật trạng thái coupon', 'error');
      }
      closeConfirmModal();
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

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

  if (loading && coupons.length === 0) {
    return (
      <div className="admin-product-list-page">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quản lý Coupon</h3>
          <Link to="/admin/coupons/add" className="admin-btn admin-btn-primary">
            <i className="fa fa-plus"></i> Thêm Coupon
          </Link>
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

      {showConfirmModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h6 className='mb-0'>Xác nhận thay đổi trạng thái</h6>
              <button className="admin-modal-close" onClick={closeConfirmModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Bạn có chắc chắn muốn {confirmAction === 'deactivate' ? 'vô hiệu hóa' : 'kích hoạt'} coupon{' '}
                <strong>{selectedCoupon?.couponCode}</strong> không?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={closeConfirmModal}>
                Hủy
              </button>
              <button 
                className={`admin-btn ${confirmAction === 'deactivate' ? 'admin-btn-danger' : 'admin-btn-success'}`}
                onClick={handleConfirmStatusChange}
              >
                {confirmAction === 'deactivate' ? 'Vô hiệu hóa' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card-header">
        <h3 className="admin-card-title">Quản lý Coupon</h3>
        <div className="d-flex">
          <div className="search-container mr-3 d-flex">
            <input
              type="text"
              className="admin-form-control"
              placeholder="Tìm kiếm theo mã coupon..."
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
          <Link to="/admin/coupons/add" className="admin-btn admin-btn-primary">
            <i className="fa fa-plus"></i> Thêm Coupon
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <select 
                className="admin-form-control"
                value={isActiveFilter === null ? '' : isActiveFilter.toString()}
                onChange={handleStatusFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang kích hoạt</option>
                <option value="false">Đã vô hiệu hóa</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex align-items-center">
                <select
                  className="admin-form-control"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10 coupon</option>
                  <option value="20">20 coupon</option>
                  <option value="30">30 coupon</option>
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

          {!loading && coupons.length === 0 ? (
            <div className="text-center p-5">
              <p>Không tìm thấy coupon nào.</p>
              <Link to="/admin/coupons/add" className="admin-btn admin-btn-primary">
                Thêm coupon mới
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="admin-table product-table">
                  <thead>
                    <tr>
                      <th className="text-center sortable" onClick={() => handleSort('couponId')}>
                        ID {renderSortIcon('couponId')}
                      </th>
                      <th className="sortable" onClick={() => handleSort('couponCode')}>
                        Mã coupon {renderSortIcon('couponCode')}
                      </th>
                      <th className="sortable" onClick={() => handleSort('discountType')}>
                        Loại {renderSortIcon('discountType')}
                      </th>
                      <th className="sortable" onClick={() => handleSort('discountValue')}>
                        Giá trị {renderSortIcon('discountValue')}
                      </th>
                      <th className="sortable" onClick={() => handleSort('minimumOrderAmount')}>
                        Giá trị đơn tối thiểu {renderSortIcon('minimumOrderAmount')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('usageLimit')}>
                        Giới hạn sử dụng {renderSortIcon('usageLimit')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('usedCount')}>
                        Đã sử dụng {renderSortIcon('usedCount')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('isActive')}>
                        Trạng thái {renderSortIcon('isActive')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => (
                      <tr key={coupon.couponId}>
                        <td className="text-center">{coupon.couponId}</td>
                        <td>
                          <Link to={`/admin/coupons/${coupon.couponId}`} className="product-name">
                            {coupon.couponCode}
                          </Link>
                        </td>
                        <td>
                          {coupon.discountType === 'PERCENT' ? 'Phần trăm' : 'Cố định'}
                        </td>
                        <td>
                          {coupon.discountType === 'PERCENT' 
                            ? `${coupon.discountValue}%` 
                            : `${formatCurrency(coupon.discountValue)} đ`}
                        </td>
                        <td className="text-center">
                          {coupon.minimumOrderAmount ? `${formatCurrency(coupon.minimumOrderAmount)} đ` : '-'}
                        </td>
                        <td className="text-center">
                          {coupon.usageLimit || 'Không giới hạn'}
                        </td>
                        <td className="text-center">{coupon.usedCount}</td>
                        <td className="text-center">
                          <span 
                            className={`admin-badge ${coupon.active ? 'admin-badge-success' : 'admin-badge-danger'}`}
                            onClick={() => openConfirmModal(coupon)}
                            style={{ cursor: 'pointer' }}
                            title={coupon.active ? 'Click để vô hiệu hóa' : 'Click để kích hoạt'}
                          >
                            {coupon.active ? 'Đang kích hoạt' : 'Đã vô hiệu hóa'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

export default CouponList;

