import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../../utils/axiosConfig';
import '../css/product-detail-admin.css';

const CouponDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupon, setCoupon] = useState({
    couponCode: '',
    discountType: 'PERCENT',
    discountValue: 0,
    minimumOrderAmount: null,
    usageLimit: null,
    active: true,
    usedCount: 0
  });

  const [formattedDiscountValue, setFormattedDiscountValue] = useState('0');
  const [formattedMinimumOrderAmount, setFormattedMinimumOrderAmount] = useState('');
  const [toasts, setToasts] = useState([]);

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

  useEffect(() => {
    const fetchCouponDetail = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const response = await axios.get(`/api/admin/coupons/${id}`);
          console.log('Coupon data:', response.data);
          
          if (response.data && response.data.data) {
            const couponData = response.data.data;
            setCoupon(couponData);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin coupon:', error);
        setError('Không thể tải thông tin coupon. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouponDetail();
  }, [id]);

  useEffect(() => {
    if (typeof coupon.discountValue === 'number' && !isNaN(coupon.discountValue)) {
      setFormattedDiscountValue(coupon.discountValue.toLocaleString('de-DE'));
    } else {
      setFormattedDiscountValue('0');
    }
  }, [coupon.discountValue]);

  useEffect(() => {
    if (coupon.minimumOrderAmount !== null && typeof coupon.minimumOrderAmount === 'number' && !isNaN(coupon.minimumOrderAmount)) {
      setFormattedMinimumOrderAmount(coupon.minimumOrderAmount.toLocaleString('de-DE'));
    } else {
      setFormattedMinimumOrderAmount('');
    }
  }, [coupon.minimumOrderAmount]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'discountValue') {
      const rawValue = value.replace(/\./g, '');
      const numericValue = Number(rawValue);
      if (!isNaN(numericValue)) {
        setCoupon(prev => ({ ...prev, discountValue: numericValue }));
      } else if (value === '') {
        setCoupon(prev => ({ ...prev, discountValue: 0 }));
      }
    } else if (name === 'minimumOrderAmount') {
      if (value === '') {
        setCoupon(prev => ({ ...prev, minimumOrderAmount: null }));
      } else {
        const rawValue = value.replace(/\./g, '');
        const numericValue = Number(rawValue);
        if (!isNaN(numericValue)) {
          setCoupon(prev => ({ ...prev, minimumOrderAmount: numericValue }));
        }
      }
    } else if (name === 'usageLimit') {
      if (value === '') {
        setCoupon(prev => ({ ...prev, usageLimit: null }));
      } else {
        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
          setCoupon(prev => ({ ...prev, usageLimit: numericValue }));
        }
      }
    } else {
      setCoupon(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleToggleStatus = async () => {
    if (!id) return; // Chỉ áp dụng cho coupon đã tồn tại
    
    try {
      const newStatus = !coupon.active;
      const endpoint = newStatus ? 'activate' : 'deactivate';
      
      await axios.put(`/api/admin/coupons/${id}/${endpoint}`);
      
      setCoupon({
        ...coupon,
        active: newStatus
      });
      
      showToast(`Coupon đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công`);
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái coupon:', error);
      showToast('Không thể thay đổi trạng thái coupon. Vui lòng thử lại.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const couponData = {
        couponCode: coupon.couponCode,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        usageLimit: coupon.usageLimit,
        isActive: coupon.active
      };
      
      let response;
      
      if (id) {
        // Cập nhật coupon
        response = await axios.put(`/api/admin/coupons/${id}`, couponData);
        showToast('Cập nhật coupon thành công');
      } else {
        // Tạo coupon mới
        response = await axios.post('/api/admin/coupons', couponData);
        showToast('Tạo coupon thành công');
      }
      
      setTimeout(() => {
        history.push('/admin/coupons');
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi lưu coupon:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Không thể lưu coupon. Vui lòng thử lại.';
      showToast(errorMessage, 'error');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
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

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Đang tải thông tin coupon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => history.push('/admin/coupons')}>
          Quay lại danh sách coupon
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
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
            <button type="button" className="back-button" onClick={() => history.push('/admin/coupons')}>
              <i className="fas fa-chevron-left"></i> Coupon
            </button>
            <h1>{id ? 'Chi tiết coupon' : 'Thêm coupon mới'}</h1>
          </div>
          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-save"></i> {id ? 'Cập nhật' : 'Lưu'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => history.push('/admin/coupons')}
            >
              <i className="fas fa-times"></i> Hủy
            </button>
          </div>
        </div>
        <div className="product-detail-body">
          <div className="main-content">
            <div className="card product-info-card">
              <h2 className="card-title">Thông tin coupon</h2>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="couponCode">Mã coupon</label>
                  <input
                    type="text"
                    id="couponCode"
                    name="couponCode"
                    value={coupon.couponCode || ''}
                    onChange={handleInputChange}
                    placeholder="Nhập mã coupon"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discountType">Loại giảm giá</label>
                  <div className="select-wrapper">
                    <select
                      id="discountType"
                      name="discountType"
                      value={coupon.discountType || 'PERCENT'}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="PERCENT">Phần trăm (%)</option>
                      <option value="FIXED">Số tiền cố định</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="discountValue">
                    {coupon.discountType === 'PERCENT' ? 'Phần trăm giảm giá (%)' : 'Số tiền giảm giá'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="discountValue"
                    name="discountValue"
                    value={formattedDiscountValue}
                    onChange={handleInputChange}
                    placeholder={coupon.discountType === 'PERCENT' ? 'Nhập % giảm giá' : 'Nhập số tiền giảm giá'}
                    required
                  />
                  {coupon.discountType === 'PERCENT' && parseInt(formattedDiscountValue.replace(/\./g, '')) > 100 && (
                    <small className="text-danger">Phần trăm giảm giá không được vượt quá 100%</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="minimumOrderAmount">Giá trị đơn hàng tối thiểu</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="minimumOrderAmount"
                    name="minimumOrderAmount"
                    value={formattedMinimumOrderAmount}
                    onChange={handleInputChange}
                    placeholder="Để trống nếu không giới hạn"
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="usageLimit">Số lần sử dụng tối đa</label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={coupon.usageLimit === null ? '' : coupon.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Để trống nếu không giới hạn"
                    min="0"
                  />
                </div>

                {id && (
                  <div className="form-group">
                    <label htmlFor="usedCount">Số lần đã sử dụng</label>
                    <input
                      type="number"
                      id="usedCount"
                      name="usedCount"
                      value={coupon.usedCount || 0}
                      disabled
                      className="disabled-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {id && (
            <div className="sidebar">
              <div className="card history-card">
                <h2 className="card-title">Thông tin chung</h2>
                <div className="history-item">
                  <div className="label">ID coupon</div>
                  <div className="value">{coupon.couponId || 'Chưa có'}</div>
                </div>
                <div className="history-item">
                  <div className="label">Ngày tạo</div>
                  <div className="value">{formatDate(coupon.createdAt)}</div>
                </div>
                <div className="history-item">
                  <div className="label">Cập nhật cuối</div>
                  <div className="value">{formatDate(coupon.updatedAt)}</div>
                </div>
                <div className="history-item">
                  <div className="label">Trạng thái</div>
                  <div className="value status-toggle">
                    <span
                      className={`admin-badge ${coupon.active ? 'admin-badge-success' : 'admin-badge-danger'}`}
                      onClick={handleToggleStatus}
                      style={{ cursor: 'pointer' }}
                      title={coupon.active ? 'Click để vô hiệu hóa' : 'Click để kích hoạt'}
                    >
                      {coupon.active ? 'Đang kích hoạt' : 'Đã vô hiệu hóa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CouponDetailPage;
