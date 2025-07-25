import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../../components/global-components/footer';
import NavbarV2 from '../../components/global-components/navbar-v2';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { withRouter } from 'react-router-dom';
import './checkout.css';

const CheckoutWithHooks = (props) => {
    const { cart, loading: cartLoading, clearCart } = useCart();
    const { isAuthenticated, currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState({});
    const [toasts, setToasts] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [orderData, setOrderData] = useState({
                fullName: '',
        email: '',
                phoneNumber: '',
                province: '',
                district: '',
                ward: '',
                addressDetail: '',
                note: '',
        cartItems: [],
                paymentMethod: 'CASH'
    });
    // Thêm state cho popup
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    
    // State cho mã giảm giá
    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // Lấy thông tin người dùng và giỏ hàng khi component mount
    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            
            try {
                // Nếu đã đăng nhập, lấy thông tin profile
                if (isAuthenticated) {
                    try {
                        const userResponse = await axios.get('/api/users/profile');
                        if (userResponse.data && userResponse.data.success) {
                            const userData = userResponse.data.data;

                            setOrderData(prev => ({
                                ...prev,
                            fullName: userData.fullName || '',
                                email: userData.email || '',
                                phoneNumber: userData.phoneNumber || ''
                            }));
                        }
                    } catch (error) {
                        console.error('Lỗi khi lấy thông tin người dùng:', error);
                    }
                }
                
                // Lấy thông tin chi tiết cho từng sản phẩm trong giỏ hàng
                if (cart && cart.items && cart.items.length > 0) {
                    const cartItems = [];
                    
                    for (const item of cart.items) {
                        try {
                            const response = await axios.get(`/api/products/${item.productId}`);
                            if (response.data && response.data.success) {
                                setProductDetails(prev => ({
                                    ...prev,
                                    [item.productId]: response.data.data
                                }));
                                
                                // Thêm vào danh sách sản phẩm để đặt hàng
                                cartItems.push({
                                    productId: item.productId,
                                    quantity: item.quantity
                                });
                            }
                        } catch (error) {
                            // console.error(`Lỗi khi lấy thông tin sản phẩm ID ${item.productId}:`, error);
                        }
                    }
                    
                    // Cập nhật danh sách sản phẩm vào orderData
                    setOrderData(prev => ({
                        ...prev,
                        cartItems: cartItems
                    }));
                }
            } catch (error) {
                // console.error('Lỗi khi khởi tạo trang checkout:', error);
                setError('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        
        initialize();
    }, [isAuthenticated, cart]);

    // Hiển thị toast
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

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
                [name]: value
        }));
    };

    // Xử lý thay đổi phương thức thanh toán
    const handlePaymentMethodChange = (method) => {
        setOrderData(prev => ({
            ...prev,
                paymentMethod: method
        }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!orderData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
        if (!isAuthenticated && !orderData.email.trim()) errors.email = 'Vui lòng nhập email';
        if (!isAuthenticated && orderData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email.trim())) {
            errors.email = 'Email không hợp lệ';
        }
        if (!orderData.phoneNumber.trim()) errors.phoneNumber = 'Vui lòng nhập số điện thoại';
        else if (!/^\d{10,11}$/.test(orderData.phoneNumber.trim())) errors.phoneNumber = 'Số điện thoại không hợp lệ';
        if (!orderData.province.trim()) errors.province = 'Vui lòng nhập tỉnh/thành phố';
        if (!orderData.district.trim()) errors.district = 'Vui lòng nhập quận/huyện';
        if (!orderData.ward.trim()) errors.ward = 'Vui lòng nhập phường/xã';
        if (!orderData.addressDetail.trim()) errors.addressDetail = 'Vui lòng nhập địa chỉ chi tiết';

        return errors;
    };

    // Submit đơn hàng
    const submitOrder = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        setSubmitting(true);

        try {
            // Chuẩn bị dữ liệu gửi đi
            const orderPayload = {
                ...orderData
            };
            
            // Thêm mã giảm giá nếu đã áp dụng
            if (appliedCoupon) {
                orderPayload.couponCode = appliedCoupon;
            }
            
            // Nếu đã đăng nhập, sử dụng cartId từ server
            if (isAuthenticated) {
                if (cart && cart.cartId) {
                    orderPayload.cartId = cart.cartId;
                    delete orderPayload.cartItems; // Không cần gửi cartItems khi có cartId
                }
                delete orderPayload.email; // Không cần gửi email khi đã đăng nhập
            }
            
            // Gọi API tạo đơn hàng
            let orderEndpoint = isAuthenticated ? '/api/orders' : '/api/guest-orders';
            const orderResponse = await axios.post(orderEndpoint, orderPayload);

            if (orderResponse.data && orderResponse.data.success) {
                const createdOrder = orderResponse.data.data;

                if (orderData.paymentMethod === 'VN_PAY') {
                    // Xử lý thanh toán VNPay
                    if (!isAuthenticated) {
                        clearCart();
                    }
                    await processVnpayPayment(createdOrder);
                } else {
                    // Xử lý thanh toán COD
                    showToast('Đặt hàng thành công!', 'success');
                    if (!isAuthenticated) {
                        clearCart();
                        // Hiển thị popup cho khách vãng lai
                        setOrderDetails(createdOrder);
                        setShowSuccessPopup(true);
                    } else {
                        // Chuyển hướng đến trang chi tiết đơn hàng nếu đã đăng nhập
                        props.history.push(`/order-status?orderId=${createdOrder.orderId}`);
                    }
                }
                } else {
                showToast(orderResponse.data.message || 'Đặt hàng thất bại', 'error');
                }
        } catch (error) {
            // console.error('Lỗi khi đặt hàng:', error);
            showToast(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Xử lý thanh toán VNPay
    const processVnpayPayment = async (order) => {
        try {
            const paymentRequest = {
                orderId: order.orderId,
                amount: order.totalAmount.toString()
            };

            const vnpayResponse = await axios.post('/api/vnpay', paymentRequest);

            if (vnpayResponse.data) {
                window.location.href = vnpayResponse.data;
            } else {
                showToast('Không thể tạo yêu cầu thanh toán VNPay.', 'error');
            }
        } catch (error) {
            // console.error('Lỗi khi xử lý thanh toán VNPay:', error);
            const errorMessage = error.response?.data?.message || error.response?.data || 'Lỗi khi tạo yêu cầu thanh toán VNPay.';
            showToast(errorMessage, 'error');
        }
    };

    // Lấy thuộc tính sản phẩm
    const getProductAttributes = (productId) => {
        const productDetail = productDetails[productId];
        if (!productDetail || !productDetail.attributeValues) {
            return '-';
        }

        // Lấy 5 thuộc tính đầu tiên
        const attributes = productDetail.attributeValues.slice(0, 5);
        return attributes.map(attr => attr.value).join(', ');
    };

    // Lấy URL hình ảnh
    const getImageUrl = (imagePath) => {
        if (!imagePath) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        return imagePath.startsWith('/')
            ? `${baseUrl}${imagePath}`
            : `${baseUrl}/${imagePath}`;
    };

    // Định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

        const items = cart?.items || [];
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    // Định dạng trạng thái đơn hàng
    const formatOrderStatus = (status) => {
        const statusMap = {
            'PENDING': 'Đang chờ xử lý',
            'CONFIRMED': 'Đã xác nhận',
            'SHIPPING': 'Đang giao hàng',
            'DELIVERED': 'Đã giao hàng',
            'COMPLETED': 'Hoàn thành',
            'CANCELLED': 'Đã hủy',
            'RETURNED': 'Hoàn hàng'
        };
        return statusMap[status] || status;
    };

    // Định dạng phương thức thanh toán
    const formatPaymentMethod = (method) => {
        const methodMap = {
            'CASH': 'Thanh toán khi nhận hàng',
            'VN_PAY': 'VNPay',
            'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
            'CREDIT_CARD': 'Thẻ tín dụng'
        };
        return methodMap[method] || method;
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

    // Đóng popup
    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
        setOrderDetails(null);
        // Chuyển về trang chủ sau khi đóng popup
        props.history.push('/');
    };

    // Xử lý áp dụng mã giảm giá
    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const validateCoupon = async () => {
        if (!couponCode.trim()) {
            showToast('Vui lòng nhập mã giảm giá', 'error');
            return;
        }

        setValidatingCoupon(true);
        try {
            const response = await axios.get('/api/coupons/validate', {
                params: {
                    code: couponCode,
                    orderAmount: cart.totalAmount
                }
            });

            if (response.data && response.data.success) {
                const discount = response.data.data;
                setDiscountAmount(discount);
                setAppliedCoupon(couponCode);
                showToast('Áp dụng mã giảm giá thành công', 'success');
            } else {
                setDiscountAmount(0);
                setAppliedCoupon(null);
                showToast(response.data.message || 'Mã giảm giá không hợp lệ', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi áp dụng mã giảm giá:', error);
            setDiscountAmount(0);
            setAppliedCoupon(null);
            showToast(error.response?.data?.message || 'Mã giảm giá không hợp lệ', 'error');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setDiscountAmount(0);
        setAppliedCoupon(null);
        showToast('Đã hủy mã giảm giá', 'success');
    };

    // Hiển thị loading khi đang tải giỏ hàng
    if (cartLoading) {
        return (
            <div>
                <NavbarV2 />
                <div className="cart-page-area pd-top-120 pd-bottom-100">
                    <div className="container">
                        <div className="text-center mb-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Đang tải...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    return (
        <div>
            <NavbarV2 />
                <div className="cart-page-area pd-top-120 pd-bottom-100">
                    <div className="container">
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

                        {loading && (
                            <div className="text-center mb-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Đang tải...</span>
                                </div>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {/* Order Header */}
                                <div className="cart-header">
                                    <h2>Thanh toán <span>{totalItems} sản phẩm</span></h2>
                                </div>

                                <div className="row">
                                    <div className="col-lg-8">
                                        {/* Shipping Information Form */}
                                        <div className="order-form-wrapper">
                                            <div className="section-title mb-4">
                                                <h3>Thông tin đặt hàng</h3>
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="fullName">Họ tên người nhận <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                                                    id="fullName"
                                                    name="fullName"
                                                    placeholder="Nguyễn Văn A"
                                                    value={orderData.fullName}
                                                onChange={handleInputChange}
                                                />
                                                {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                                            </div>

                                        {/* Hiển thị field email chỉ khi chưa đăng nhập */}
                                        {!isAuthenticated && (
                                            <div className="form-group mb-3">
                                                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                    id="email"
                                                    name="email"
                                                    placeholder="example@gmail.com"
                                                    value={orderData.email}
                                                    onChange={handleInputChange}
                                                />
                                                {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                            </div>
                                        )}

                                        <div className="form-group mb-3">
                                            <label htmlFor="phoneNumber">Số điện thoại <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    placeholder="0987654321"
                                                    value={orderData.phoneNumber}
                                                onChange={handleInputChange}
                                                />
                                                {formErrors.phoneNumber && <div className="invalid-feedback">{formErrors.phoneNumber}</div>}
                                            </div>

                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="province">Tỉnh/Thành phố <span className="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${formErrors.province ? 'is-invalid' : ''}`}
                                                            id="province"
                                                            name="province"
                                                            placeholder="Hà Nội"
                                                            value={orderData.province}
                                                        onChange={handleInputChange}
                                                        />
                                                        {formErrors.province && <div className="invalid-feedback">{formErrors.province}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="district">Quận/Huyện <span className="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${formErrors.district ? 'is-invalid' : ''}`}
                                                            id="district"
                                                            name="district"
                                                            placeholder="Cầu Giấy"
                                                            value={orderData.district}
                                                        onChange={handleInputChange}
                                                        />
                                                        {formErrors.district && <div className="invalid-feedback">{formErrors.district}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="ward">Phường/Xã <span className="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${formErrors.ward ? 'is-invalid' : ''}`}
                                                            id="ward"
                                                            name="ward"
                                                            placeholder="Quan Hoa"
                                                            value={orderData.ward}
                                                        onChange={handleInputChange}
                                                        />
                                                        {formErrors.ward && <div className="invalid-feedback">{formErrors.ward}</div>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="addressDetail">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.addressDetail ? 'is-invalid' : ''}`}
                                                    id="addressDetail"
                                                    name="addressDetail"
                                                    placeholder="Số 25, Ngõ 30, Đường Nguyễn Thị Định"
                                                    value={orderData.addressDetail}
                                                onChange={handleInputChange}
                                                />
                                                {formErrors.addressDetail && <div className="invalid-feedback">{formErrors.addressDetail}</div>}
                                            </div>

                                            <div className="form-group mb-3">
                                                <label htmlFor="note">Ghi chú</label>
                                                <textarea
                                                    className="form-control"
                                                    id="note"
                                                    name="note"
                                                    rows="3"
                                                    placeholder="Ghi chú về đơn hàng, ví dụ: Gọi trước khi giao hàng"
                                                    value={orderData.note}
                                                onChange={handleInputChange}
                                                ></textarea>
                                            </div>

                                            <div className="payment-methods mt-4">
                                                <div className="section-title">
                                                    <h3>Phương thức thanh toán</h3>
                                                </div>

                                                <div className="payment-method-options">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="paymentMethod"
                                                            id="cash"
                                                            checked={orderData.paymentMethod === 'CASH'}
                                                        onChange={() => handlePaymentMethodChange('CASH')}
                                                        />
                                                        <label className="form-check-label" htmlFor="cash">
                                                            <span className="payment-icon">💵</span>
                                                            Thanh toán khi nhận hàng (COD)
                                                        </label>
                                                    </div>
                                                    {isAuthenticated && (
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="paymentMethod"
                                                            id="vnpay"
                                                            checked={orderData.paymentMethod === 'VN_PAY'}
                                                        onChange={() => handlePaymentMethodChange('VN_PAY')}
                                                        />
                                                        <label className="form-check-label" htmlFor="vnpay">
                                                            <span className="payment-icon">💳</span>
                                                            Thanh toán qua VNPay
                                                        </label>
                                                    </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="cart-summary">
                                            <div className="summary-header">
                                                <h3>Khuyến mãi</h3>
                                            </div>
                                            <div className="summary-body">
                                                {appliedCoupon ? (
                                                    <div className="applied-coupon">
                                                        <div className="coupon-info">
                                                            <span className="coupon-code">{appliedCoupon}</span>
                                                            <span className="coupon-discount ml-3">-{formatPrice(discountAmount)} đ</span>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            className="remove-coupon" 
                                                            onClick={removeCoupon}
                                                            title="Xóa mã giảm giá"
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Nhập mã giảm giá"
                                                                value={couponCode}
                                                                onChange={handleCouponChange}
                                                                disabled={validatingCoupon}
                                                            />
                                                            <div className="input-group-append">
                                                                <button
                                                                    className="btn-apply-coupon"
                                                                    type="button"
                                                                    onClick={validateCoupon}
                                                                    disabled={!couponCode.trim() || validatingCoupon}
                                                                >
                                                                    {validatingCoupon ? 
                                                                        <i className="fa fa-spinner fa-spin"></i> : 
                                                                        'Áp dụng'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="cart-summary mt-4">
                                            <div className="summary-header">
                                                <h3>Tóm tắt đơn hàng</h3>
                                            </div>
                                            <div className="summary-body">
                                                <div className="summary-row">
                                                    <div className="summary-label">Tạm tính</div>
                                                <div className="summary-value">{formatPrice(cart.totalAmount)} đ</div>
                                                </div>

                                                {appliedCoupon && (
                                                    <div className="summary-row discount">
                                                        <div className="summary-label">Giảm giá</div>
                                                        <div className="summary-value discount">-{formatPrice(discountAmount)} đ</div>
                                                    </div>
                                                )}

                                                <div className="summary-row total">
                                                    <div className="summary-label">Tổng cộng</div>
                                                    <div className="summary-value price total">
                                                        {formatPrice(cart.totalAmount - (appliedCoupon ? discountAmount : 0))} đ
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn-order"
                                                    disabled={items.length === 0 || submitting}
                                                onClick={submitOrder}
                                                >
                                                    {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="order-products mt-4">
                                            <div className="section-title mb-3">
                                                <h5>Sản phẩm trong đơn ({totalItems})</h5>
                                            </div>
                                            <div className="order-products-list">
                                                {items.map(item => (
                                                <div className="order-product-item" key={item.cartItemId || item.productId}>
                                                        <div className="product-thumbnail">
                                                            <img
                                                            src={getImageUrl(item.productImage)}
                                                                alt={item.productName}
                                                                className="product-image"
                                                            />
                                                        </div>
                                                        <div className="checkout-product-details">
                                                            <div className="product-name">{item.productName}</div>
                                                            <div className="product-price-qty">
                                                            <span className="product-price">{formatPrice(item.price)} đ</span>
                                                                <span className="product-quantity">x{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <Footer />
                
                {/* Popup thông báo đặt hàng thành công cho khách vãng lai */}
                {showSuccessPopup && orderDetails && (
                    <div className="order-success-popup">
                        <div className="order-popup-overlay" onClick={closeSuccessPopup}></div>
                        <div className="order-popup-content">
                            <div className="order-popup-header">
                                <h3>Đặt hàng thành công!</h3>
                                <button className="order-popup-close" onClick={closeSuccessPopup}>&times;</button>
                            </div>
                            
                            <div className="order-popup-body">
                                <div className="order-success-message">
                                    <div className="order-success-icon">
                                        <i className="fa fa-check-circle"></i>
                                    </div>
                                    <p>Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                                </div>
                                
                                <div className="order-details-card">
                                    <div className="order-details-header">
                                        <h4>Chi tiết đơn hàng <span>#{orderDetails.orderId}</span></h4>
                                    </div>
                                    
                                    <div className="order-summary">
                                        <div className="order-info-row">
                                            <span className="order-info-label">Ngày đặt hàng:</span>
                                            <span className="order-info-value">{formatDate(orderDetails.createdAt)}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span className="order-info-label">Trạng thái:</span>
                                            <span className="order-info-value status">{formatOrderStatus(orderDetails.status)}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span className="order-info-label">Phương thức thanh toán:</span>
                                            <span className="order-info-value">{formatPaymentMethod(orderDetails.paymentMethod)}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span className="order-info-label">Tổng tiền:</span>
                                            <span className="order-info-value total">{formatPrice(orderDetails.totalAmount)} đ</span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-shipping-info">
                                        <h5>Thông tin giao hàng</h5>
                                        <div className="order-info-row">
                                            <span className="order-info-label">Người nhận:</span>
                                            <span className="order-info-value">{orderDetails.fullName}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span className="order-info-label">Số điện thoại:</span>
                                            <span className="order-info-value">{orderDetails.phoneNumber}</span>
                                        </div>
                                        <div className="order-info-row">
                                            <span className="order-info-label">Địa chỉ:</span>
                                            <span className="order-info-value">
                                                {orderDetails.addressDetail}, {orderDetails.ward}, {orderDetails.district}, {orderDetails.province}
                                            </span>
                                        </div>
                                        {orderDetails.note && (
                                            <div className="order-info-row">
                                                <span className="order-info-label">Ghi chú:</span>
                                                <span className="order-info-value">{orderDetails.note}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="order-items">
                                        <h5>Sản phẩm đã đặt</h5>
                                        <div className="order-items-list">
                                            {orderDetails.items && orderDetails.items.map((item, index) => (
                                                <div className="order-item" key={index}>
                                                    <div className="order-item-image">
                                                        <img 
                                                            src={getImageUrl(item.productImage)} 
                                                            alt={item.productName} 
                                                        />
                                                    </div>
                                                    <div className="order-item-details">
                                                        <div className="order-item-name">{item.productName}</div>
                                                        <div className="order-item-price-qty">
                                                            <span className="order-item-price">{formatPrice(item.price)} đ</span>
                                                            <span className="order-item-quantity">x{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="order-popup-actions">
                                    <button className="admin-btn admin-btn-primary" onClick={closeSuccessPopup}>
                                        <i className="fa fa-home mr-2"></i>Tiếp tục mua sắm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    /* Styles for the popup */
                    .order-success-popup {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                    }
                    
                    /* Styles for coupon */
                    .coupon-form {
                        width: 100%;
                    }
                    
                    .coupon-form .input-group {
                        display: flex;
                        position: relative;
                    }
                    
                    .coupon-code {
                        font-weight: 600;
                        color: #333;
                    }
                    
                    .coupon-discount {
                        color: #4CAF50;
                        font-weight: 600;
                        margin-top: 5px;
                    }
                    
                    .remove-coupon {
                        background: none;
                        border: none;
                        color: #999;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 0 5px;
                    }
                    
                    .remove-coupon:hover {
                        color: #f53333;
                    }
                    
                    .summary-row.discount {
                        color: #4CAF50;
                        font-weight: 500;
                    }
                    
                    .summary-value.discount {
                        color: #4CAF50;
                    }
                    
                    .order-popup-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                    }
                    
                    .order-popup-content {
                        position: relative;
                        width: 90%;
                        max-width: 700px;
                        max-height: 90vh;
                        overflow-y: auto;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        z-index: 10000;
                    }
                    
                    .order-popup-header {
                        padding: 15px 20px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .order-popup-header h3 {
                        margin: 0;
                        color: #333;
                        font-size: 20px;
                    }
                    
                    .order-popup-close {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    }
                    
                    .order-popup-body {
                        padding: 20px;
                    }
                    
                    .order-success-message {
                        text-align: center;
                        margin-bottom: 20px;
                        padding: 10px;
                    }
                    
                    .order-success-icon {
                        margin-bottom: 15px;
                    }
                    
                    .order-success-icon i {
                        font-size: 50px;
                        color: #4CAF50;
                    }
                    
                    .order-details-card {
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        padding: 15px;
                        margin-bottom: 20px;
                    }
                    
                    .order-details-header {
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #eee;
                    }
                    
                    .order-details-header h4 {
                        margin: 0;
                        font-size: 18px;
                    }
                    
                    .order-details-header h4 span {
                        color: #f53333;
                    }
                    
                    .order-summary, .order-shipping-info {
                        margin-bottom: 20px;
                    }
                    
                    .order-info-row {
                        display: flex;
                        margin-bottom: 8px;
                    }
                    
                    .order-info-label {
                        width: 40%;
                        font-weight: 600;
                        color: #666;
                    }
                    
                    .order-info-value {
                        width: 60%;
                    }
                    
                    .order-info-value.status {
                        color: #ff9800;
                        font-weight: 600;
                    }
                    
                    .order-info-value.total {
                        color: #f53333;
                        font-weight: 600;
                    }
                    
                    .order-shipping-info h5, .order-items h5 {
                        font-size: 16px;
                        margin-bottom: 10px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid #eee;
                    }
                    
                    .order-items-list {
                        max-height: 200px;
                        overflow-y: auto;
                    }
                    
                    .order-item {
                        display: flex;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }
                    
                    .order-item:last-child {
                        border-bottom: none;
                    }
                    
                    .order-item-image {
                        width: 60px;
                        height: 60px;
                        margin-right: 15px;
                    }
                    
                    .order-item-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    
                    .order-item-details {
                        flex: 1;
                    }
                    
                    .order-item-name {
                        font-weight: 500;
                        margin-bottom: 5px;
                    }
                    
                    .order-item-price-qty {
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                    }
                    
                    .order-item-price {
                        color: #f53333;
                    }
                    
                    .order-popup-actions {
                        text-align: center;
                        margin-top: 20px;
                    }
                    
                    .order-popup-btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s;
                    }

                    /* Responsive */
                    @media (max-width: 767px) {
                        .order-info-row {
                            flex-direction: column;
                        }
                        
                        .order-info-label, .order-info-value {
                            width: 100%;
                        }
                        
                        .order-popup-content {
                            width: 95%;
                        }
                    }
                `}</style>
            </div>
        );
};

export default withRouter(CheckoutWithHooks); 