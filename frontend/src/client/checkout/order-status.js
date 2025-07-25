import React, { Component } from 'react';
import axios from 'axios';
import Footer from '../../components/global-components/footer';
import withAuth from '../../utils/withAuth';
import './checkout.css';
import { Link } from 'react-router-dom';
import './payment.css';
import NavbarV2 from '../../components/global-components/navbar-v2';

class OrderStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            paymentSuccess: false,
            paymentMessage: '',
            orderId: null,
            orderDetails: null
        };
    }

    componentDidMount() {
        // Kiểm tra cả vnpay callback và orderId từ thanh toán COD
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get('vnp_ResponseCode');
        const orderId = urlParams.get('orderId');
        
        if (vnpResponseCode && orderId) {
            this.processVnpayCallback(vnpResponseCode, orderId);
        } else if (orderId) {
            // Nếu chỉ có orderId (từ thanh toán COD) thì lấy thông tin đơn hàng
            this.fetchOrderDetails(orderId);
        } else {
            this.setState({ loading: false });
        }
    }

    // Xử lý callback từ VNPay
    processVnpayCallback = (vnpResponseCode, orderId) => {
        this.setState({ loading: true });
        
        // Gọi API backend để cập nhật trạng thái thanh toán
        axios.get(`/api/vnpay/callback?vnp_ResponseCode=${vnpResponseCode}&orderId=${orderId}`)
            .then(response => {
                // Xử lý kết quả trả về từ API
                if (vnpResponseCode === '00') {
                    this.setState({
                        paymentSuccess: true,
                        paymentMessage: 'Thanh toán đã được xác nhận thành công! Đơn hàng của bạn đang được xử lý.',
                        orderId: orderId
                    });
                } else {
                    // Đặt các thông báo lỗi dựa trên mã lỗi
                    let errorMessage = 'Thanh toán thất bại.';
                    switch(vnpResponseCode) {
                        case '24':
                            errorMessage = 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
                            break;
                        case '09':
                            errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng';
                            break;
                        case '10':
                            errorMessage = 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
                            break;
                        case '11':
                            errorMessage = 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán';
                            break;
                        case '12':
                            errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa';
                            break;
                        default:
                            errorMessage = `Thanh toán thất bại. Mã lỗi: ${vnpResponseCode}`;
                    }
                    
                    this.setState({
                        paymentSuccess: false,
                        paymentMessage: errorMessage,
                        orderId: orderId
                    });
                }
                
                // Sau khi xử lý VNPay, lấy chi tiết đơn hàng
                this.fetchOrderDetails(orderId);
                
                // Xóa tham số trên URL để tránh reload lại trang vẫn thấy thông báo
                window.history.replaceState({}, document.title, `/payment?orderId=${orderId}`);
            })
            .catch(error => {
                console.error('Lỗi khi xử lý kết quả thanh toán:', error);
                this.setState({
                    paymentSuccess: false,
                    paymentMessage: `Có lỗi xảy ra khi xử lý thanh toán: ${error.response?.data?.message || 'Không xác định được lỗi'}`,
                    orderId: orderId,
                    loading: false
                });
                window.history.replaceState({}, document.title, `/payment?orderId=${orderId}`);
            });
    }
    
    // Lấy chi tiết đơn hàng
    fetchOrderDetails = (orderId) => {
        this.setState({ loading: true, orderId });
        
        axios.get(`/api/orders/${orderId}`)
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        orderDetails: response.data.data,
                        loading: false,
                        // Nếu là thanh toán COD thành công
                        paymentSuccess: response.data.data.paymentMethod === 'CASH' ? true : this.state.paymentSuccess,
                        paymentMessage: response.data.data.paymentMethod === 'CASH' && !this.state.paymentMessage 
                            ? 'Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.' 
                            : this.state.paymentMessage
                    });
                } else {
                    this.setState({ 
                        error: 'Không thể tải thông tin đơn hàng', 
                        loading: false 
                    });
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                this.setState({ 
                    error: error.response?.data?.message || 'Lỗi khi tải dữ liệu đơn hàng', 
                    loading: false 
                });
            });
    }
    
    // Hủy đơn hàng
    cancelOrder = (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;

        this.setState({ loading: true });
        axios.post(`/api/orders/${orderId}/cancel`)
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        paymentSuccess: false,
                        paymentMessage: 'Đơn hàng đã được hủy thành công',
                        loading: false
                    });
                    // Cập nhật lại thông tin đơn hàng
                    this.fetchOrderDetails(orderId);
                } else {
                    this.setState({ 
                        loading: false,
                        error: response.data?.message || 'Không thể hủy đơn hàng'
                    });
                }
            })
            .catch(error => {
                console.error('Lỗi khi hủy đơn hàng:', error);
                this.setState({ 
                    loading: false,
                    error: error.response?.data?.message || 'Lỗi khi hủy đơn hàng'
                });
            });
    };
    
    // Xử lý thanh toán qua VNPay
    processVnpayPayment = (orderId) => {
        this.setState({ loading: true });
        
        const paymentRequest = {
            orderId: orderId
        };

        axios.post('/api/vnpay', paymentRequest)
            .then(response => {
                if (response.data) {
                    window.location.href = response.data;
                } else {
                    this.setState({
                        loading: false,
                        error: 'Không thể tạo yêu cầu thanh toán VNPay.'
                    });
                }
            })
            .catch(error => {
                console.error('Lỗi khi xử lý thanh toán VNPay:', error);
                this.setState({
                    loading: false,
                    error: error.response?.data?.message || 'Lỗi khi tạo yêu cầu thanh toán VNPay.'
                });
            });
    };

    // Định dạng trạng thái đơn hàng
    formatOrderStatus = (status) => {
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
    formatPaymentMethod = (method) => {
        const methodMap = {
            'CASH': 'Thanh toán khi nhận hàng',
            'VN_PAY': 'VNPay',
            'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
            'CREDIT_CARD': 'Thẻ tín dụng',
            'MOMO': 'Ví MoMo',
            'ZALOPAY': 'ZaloPay'
        };
        return methodMap[method] || method;
    };

    // Định dạng trạng thái thanh toán
    formatPaymentStatus = (status) => {
        const statusMap = {
            'NOT_PAID': 'Chưa thanh toán',
            'PAID': 'Đã thanh toán',
            'REFUNDED': 'Đã hoàn tiền',
            'FAILED': 'Thanh toán thất bại'
        };
        return statusMap[status] || status;
    };

    // Định dạng ngày tháng
    formatDate = (dateString) => {
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
    formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Lấy class CSS cho trạng thái đơn hàng
    getOrderStatusClass = (status) => {
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
    
    // Lấy URL hình ảnh đầy đủ
    getImageUrl = (imagePath) => {
        if (!imagePath) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        return imagePath.startsWith('/')
            ? `${baseUrl}${imagePath}`
            : `${baseUrl}/${imagePath}`;
    };

    renderVnPayResult = () => {
        const { paymentSuccess, paymentMessage, orderId } = this.state;

        return (
            <div className="success-page">
                <div className={`success-container ${paymentSuccess ? 'success' : 'error'}`}>
                    <div className="success-icon">
                        {paymentSuccess ? 
                            <i className="fa fa-check-circle"></i> : 
                            <i className="fa fa-times-circle"></i>
                        }
                    </div>
                    <h2 className="success-title">
                        {paymentSuccess ? 'Đặt hàng thành công!' : 'Đặt hàng không thành công'}
                    </h2>
                    <p className="success-message">
                        {paymentMessage}
                    </p>
                    {orderId && (
                        <p className="order-id">
                            Mã đơn hàng: <span>#{orderId}</span>
                        </p>
                    )}
                </div>
            </div>
        );
    };
    
    renderOrderDetails = () => {
        const { orderDetails } = this.state;
        
        if (!orderDetails) return null;
        
        return (
            <div className="order-details-container">
                <div className="order-result-header">
                    <h2>Chi tiết đơn hàng <span>#{orderDetails.orderId}</span></h2>
                </div>
                
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h5 className="mb-3">Thông tin đơn hàng</h5>
                        <table className="table table-bordered table-sm">
                            <tbody>
                                <tr>
                                    <td width="40%"><strong>Mã đơn hàng:</strong></td>
                                    <td>#{orderDetails.orderId}</td>
                                </tr>
                                <tr>
                                    <td><strong>Ngày đặt hàng:</strong></td>
                                    <td>{this.formatDate(orderDetails.createdAt)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Trạng thái:</strong></td>
                                    <td>
                                        <span className={`admin-badge ${this.getOrderStatusClass(orderDetails.status)}`}>
                                            {this.formatOrderStatus(orderDetails.status)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Phương thức thanh toán:</strong></td>
                                    <td>{this.formatPaymentMethod(orderDetails.paymentMethod)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Trạng thái thanh toán:</strong></td>
                                    <td>
                                        <span className={`admin-badge ${orderDetails.paymentStatus === 'PAID' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                                            {this.formatPaymentStatus(orderDetails.paymentStatus)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Tổng tiền:</strong></td>
                                    <td><strong className="text-primary">{this.formatCurrency(orderDetails.totalAmount)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <h5 className="mb-3">Địa chỉ giao hàng</h5>
                        <table className="table table-bordered table-sm">
                            <tbody>
                                <tr>
                                    <td width="40%"><strong>Người nhận:</strong></td>
                                    <td>{orderDetails.fullName}</td>
                                </tr>
                                <tr>
                                    <td><strong>Số điện thoại:</strong></td>
                                    <td>{orderDetails.phoneNumber}</td>
                                </tr>
                                <tr>
                                    <td><strong>Địa chỉ:</strong></td>
                                    <td>
                                        {orderDetails.addressDetail && `${orderDetails.addressDetail}, `}
                                        {orderDetails.ward && `${orderDetails.ward}, `}
                                        {orderDetails.district && `${orderDetails.district}, `}
                                        {orderDetails.province}
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Ghi chú:</strong></td>
                                    <td>{orderDetails.note || "Không có"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h5>Sản phẩm đã đặt</h5>
                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th className="text-center">Giá</th>
                                <th className="text-center">Số lượng</th>
                                <th className="text-center">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.items && orderDetails.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={this.getImageUrl(item.productImage)}
                                                alt={item.productName}
                                                className="img-thumbnail mr-2"
                                                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                            />
                                            <div>
                                                <a href={`/product-details/${item.productId}`} className="mb-0 font-weight-bold text-dark">
                                                    {item.productName}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">{this.formatCurrency(item.price)}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-center">{this.formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-right"><strong>Tổng cộng:</strong></td>
                                <td className="text-center"><strong className="text-primary">{this.formatCurrency(orderDetails.totalAmount)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {/* Lịch sử đơn hàng */}
                <div className="order-timeline mt-4">
                    <h5>Lịch sử đơn hàng</h5>
                    <div className="timeline-items">
                        {orderDetails.createdAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng được tạo</h6>
                                    <p>{this.formatDate(orderDetails.createdAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.pendingAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng đang chờ xử lý</h6>
                                    <p>{this.formatDate(orderDetails.pendingAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.confirmedAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng đã xác nhận</h6>
                                    <p>{this.formatDate(orderDetails.confirmedAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.shippingAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng đang giao</h6>
                                    <p>{this.formatDate(orderDetails.shippingAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.deliveredAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng đã giao</h6>
                                    <p>{this.formatDate(orderDetails.deliveredAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.completedAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng hoàn thành</h6>
                                    <p>{this.formatDate(orderDetails.completedAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.cancelledAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker cancelled"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng đã hủy</h6>
                                    <p>{this.formatDate(orderDetails.cancelledAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.returnedAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker returned"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng hoàn trả</h6>
                                    <p>{this.formatDate(orderDetails.returnedAt)}</p>
                                </div>
                            </div>
                        )}
                        {orderDetails.paidAt && (
                            <div className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h6>Đơn hàng đã thanh toán</h6>
                                    <p>{this.formatDate(orderDetails.paidAt)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
    renderActionButtons = () => {
        const { orderDetails } = this.state;
        
        if (!orderDetails) return null;
        
        return (
            <div className="success-actions mt-4">
                {orderDetails.status === 'PENDING' && (
                    <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => this.cancelOrder(orderDetails.orderId)}
                    >
                        <i className="fa fa-times-circle mr-1"></i> Hủy đơn hàng
                    </button>
                )}
                {orderDetails.status === 'PENDING' && 
                 orderDetails.paymentMethod === 'VN_PAY' && 
                 orderDetails.paymentStatus === 'NOT_PAID' && (
                    <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        onClick={() => this.processVnpayPayment(orderDetails.orderId)}
                    >
                        <i className="fa fa-credit-card mr-1"></i> Thanh toán qua VNPay
                    </button>
                )}
                {orderDetails.userId && (
                    <Link to={`/profile?tab=orders&orderId=${orderDetails.orderId}`} className="admin-btn admin-btn-primary">
                        <i className="fa fa-user-circle mr-2"></i>Xem trong tài khoản của tôi
                    </Link>
                )}
                <Link to="/" className="admin-btn admin-btn-secondary">
                    <i className="fa fa-home mr-2"></i>Tiếp tục mua sắm
                </Link>
            </div>
        );
    };

    renderDefaultPage = () => {
        return (
            <div className="success-page">
                <div className="success-container">
                    <h2 className="success-title">Trang thanh toán</h2>
                    <p className="success-message">
                        Bạn sẽ được chuyển hướng về trang này sau khi hoàn tất thanh toán.
                    </p>
                    <div className="success-actions">
                        <Link to="/profile?tab=orders" className="admin-btn admin-btn-primary">
                            <i className="fa fa-user-circle mr-2"></i>Xem đơn hàng của tôi
                        </Link>
                        <Link to="/" className="admin-btn admin-btn-secondary">
                            <i className="fa fa-home mr-2"></i>Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    };
    
    render() {
        const { loading, error, paymentMessage, orderDetails } = this.state;

        return (
            <div>
                <NavbarV2 />
                <div className="cart-page-area pd-top-120 pd-bottom-100">
                    <div className="container">
                        {loading ? (
                            <div className="text-center mb-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Đang tải...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        ) : paymentMessage ? (
                            // Hiển thị kết quả thanh toán VNPay nếu có
                            <div>
                                {this.renderVnPayResult()}
                                {orderDetails && this.renderOrderDetails()}
                                {this.renderActionButtons()}
                            </div>
                        ) : orderDetails ? (
                            // Hiển thị thông tin đơn hàng nếu có
                            <div>
                                {this.renderOrderDetails()}
                                {this.renderActionButtons()}
                            </div>
                        ) : (
                            // Trang mặc định khi không có thông tin
                            this.renderDefaultPage()
                        )}
                    </div>
                </div>
                <Footer />
                <style jsx>{`
                    .order-details-container {
                        background: #fff;
                        border-radius: 10px;
                        padding: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        margin-top: 20px;
                    }
                    .order-result-header {
                        margin-bottom: 20px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 10px;
                    }
                    .order-result-header h2 {
                        font-size: 24px;
                        font-weight: 600;
                    }
                    .order-result-header h2 span {
                        color: #f53333;
                    }
                    .timeline-items {
                        position: relative;
                        padding-left: 40px;
                    }
                    .timeline-item {
                        position: relative;
                        margin-bottom: 20px;
                    }
                    .timeline-marker {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        left: -30px;
                        background-color: #4CAF50;
                        border-radius: 50%;
                    }
                    .timeline-marker.cancelled {
                        background-color: #f44336;
                    }
                    .timeline-marker.returned {
                        background-color: #ff9800;
                    }
                    .timeline-item:not(:last-child):before {
                        content: '';
                        position: absolute;
                        left: -23px;
                        top: 16px;
                        height: calc(100% + 4px);
                        width: 2px;
                        background-color: #e0e0e0;
                    }
                    .timeline-content h6 {
                        margin-bottom: 5px;
                        font-weight: 600;
                    }
                    .timeline-content p {
                        margin: 0;
                        color: #666;
                        font-size: 14px;
                    }
                `}</style>
            </div>
        );
    }
}

// Bọc component Order với withAuth HOC
// Yêu cầu người dùng phải đăng nhập để truy cập trang này
export default OrderStatus