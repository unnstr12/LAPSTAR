import React, { Component } from 'react';
import axios from 'axios';
import NavbarV2 from '../../components/global-components/navbar-v2';
import Footer from '../../components/global-components/footer';
import withAuth from '../../utils/withAuth';
import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                userId: '',
                email: '',
                fullName: '',
                phoneNumber: '',
                address: '',
                avatar: '',
                roleName: '',
                createdAt: '',
                updatedAt: '',
                isDeleted: false
            },
            activeTab: 'profile',
            loading: true,
            error: null,
            toasts: [],
            avatarPreview: null,
            avatarFile: null,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            passwordErrors: {},
            orders: [],
            orderLoading: false,
            orderError: null,
            orderCurrentPage: 0,
            orderTotalPages: 0,
            orderTotalElements: 0,
            orderPageSize: 5,
            selectedOrderId: null,
            orderDetails: null,
            showOrderDetailsModal: false
        };

        // Refs
        this.fileInputRef = React.createRef();
    }

    componentDidMount() {
        // Kiểm tra URL params để xem có tab được chỉ định không
        const queryParams = new URLSearchParams(this.props.location.search);
        const tabParam = queryParams.get('tab');
        const orderIdParam = queryParams.get('orderId');
        
        if (tabParam && ['profile', 'orders', 'password'].includes(tabParam)) {
            this.setState({ activeTab: tabParam });
        }
        
        this.fetchUserData();
        
        // Nếu đang ở tab orders hoặc được chỉ định tab orders từ URL, lấy dữ liệu đơn hàng
        if (this.state.activeTab === 'orders' || tabParam === 'orders') {
            this.fetchOrders().then(() => {
                // Sau khi lấy dữ liệu đơn hàng xong, nếu có orderId thì mở chi tiết đơn hàng đó
                if (orderIdParam) {
                    this.viewOrderDetails(parseInt(orderIdParam, 10));
                }
            });
        }
    }

    // Lấy thông tin người dùng từ API
    fetchUserData = () => {
        this.setState({ loading: true });
        axios.get('/api/users/profile')
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        user: response.data.data,
                        loading: false,
                        error: null
                    });
                } else {
                    this.setState({
                        loading: false,
                        error: response.data?.message || 'Không thể lấy thông tin người dùng'
                    });
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                this.setState({
                    loading: false,
                    error: error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng'
                });
            });
    };

    // Lấy danh sách đơn hàng từ API
    fetchOrders = () => {
        this.setState({ orderLoading: true, orderError: null });
        const { orderCurrentPage, orderPageSize } = this.state;

        return axios.get('/api/orders', {
            params: {
                page: orderCurrentPage,
                size: orderPageSize
            }
        })
            .then(response => {
                if (response.data && response.data.success) {
                    if (response.data.data && typeof response.data.data.content !== 'undefined') {
                        const pageData = response.data.data;
                        this.setState({
                            orders: pageData.content,
                            orderTotalPages: pageData.totalPages,
                            orderTotalElements: pageData.totalElements,
                            orderLoading: false
                        });
                    } else {
                        this.setState({
                            orders: response.data.data,
                            orderTotalPages: 1,
                            orderTotalElements: response.data.data.length,
                            orderLoading: false
                        });
                    }
                    return response.data.data; // Trả về dữ liệu để sử dụng trong then tiếp theo
                } else {
                    this.setState({
                        orderLoading: false,
                        orderError: response.data?.message || 'Không thể lấy danh sách đơn hàng'
                    });
                    return null;
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error);
                this.setState({
                    orderLoading: false,
                    orderError: error.response?.data?.message || 'Lỗi khi lấy danh sách đơn hàng'
                });
                return null;
            });
    };

    // Hiển thị toast thông báo
    showToast = (message, type = 'success') => {
        const newToast = {
            id: Date.now(),
            message,
            type,
            show: true
        };

        this.setState(prevState => ({
            toasts: [...prevState.toasts, newToast]
        }));

        setTimeout(() => {
            this.setState(prevState => ({
                toasts: prevState.toasts.filter(toast => toast.id !== newToast.id)
            }));
        }, 3000);
    };

    // Chuyển đổi tab
    handleTabChange = (tab) => {
        this.setState({ activeTab: tab }, () => {
            if (tab === 'orders' && this.state.orders.length === 0) {
                this.fetchOrders();
            }
            
            // Cập nhật URL để không còn tham số orderId khi chuyển tab
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            url.searchParams.delete('orderId');
            window.history.replaceState({}, '', url.toString());
        });
    };

    // Xử lý khi người dùng thay đổi input
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [name]: value
            }
        }));
    };

    // Xử lý khi người dùng thay đổi mật khẩu
    handlePasswordChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    // Validate thông tin người dùng
    validateUserInfo = () => {
        const { user } = this.state;
        let isValid = true;
        let errors = {};

        if (!user.fullName.trim()) {
            errors.fullName = 'Họ tên không được để trống';
            isValid = false;
        }

        if (user.phoneNumber && !/^(0|\+84)(\d{9}|\d{10})$/.test(user.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        return { isValid, errors };
    };

    // Validate thông tin đổi mật khẩu
    validatePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = this.state;
        let isValid = true;
        let errors = {};

        if (!currentPassword) {
            errors.currentPassword = 'Mật khẩu hiện tại không được để trống';
            isValid = false;
        }

        if (!newPassword) {
            errors.newPassword = 'Mật khẩu mới không được để trống';
            isValid = false;
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Xác nhận mật khẩu không khớp';
            isValid = false;
        }

        return { isValid, errors };
    };

    // Lưu thông tin người dùng
    saveUserInfo = () => {
        const { user } = this.state;
        const validation = this.validateUserInfo();

        if (!validation.isValid) {
            this.setState({ errors: validation.errors });
            this.showToast('Vui lòng kiểm tra lại thông tin', 'error');
            return;
        }

        this.setState({ loading: true });

        // Chuẩn bị dữ liệu gửi đi
        const userUpdate = {
            email: user.email,  // Email không thay đổi
            fullName: user.fullName,
            phoneNumber: user.phoneNumber || null,
            address: user.address || null,
            roleId: null, // Để API tự xử lý
            isDeleted: false
        };

        axios.put('/api/users/profile', userUpdate)
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        user: response.data.data,
                        loading: false,
                        errors: {}
                    });
                    this.showToast('Cập nhật thông tin thành công');
                } else {
                    this.setState({
                        loading: false,
                        error: response.data?.message || 'Không thể cập nhật thông tin người dùng'
                    });
                    this.showToast(response.data?.message || 'Không thể cập nhật thông tin người dùng', 'error');
                }
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
                this.setState({ loading: false });
                this.showToast(error.response?.data?.message || 'Lỗi khi cập nhật thông tin người dùng', 'error');
            });
    };

    // Đổi mật khẩu
    changePassword = () => {
        const { currentPassword, newPassword } = this.state;
        const validation = this.validatePassword();

        if (!validation.isValid) {
            this.setState({ passwordErrors: validation.errors });
            this.showToast('Vui lòng kiểm tra lại thông tin mật khẩu', 'error');
            return;
        }

        this.setState({ loading: true });

        axios.post('/api/users/change-password', {
            currentPassword,
            newPassword
        })
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                        passwordErrors: {},
                        loading: false
                    });
                    this.showToast('Đổi mật khẩu thành công');
                } else {
                    this.setState({
                        loading: false,
                        passwordErrors: { general: response.data?.message || 'Không thể đổi mật khẩu' }
                    });
                    this.showToast(response.data?.message || 'Không thể đổi mật khẩu', 'error');
                }
            })
            .catch(error => {
                console.error('Lỗi khi đổi mật khẩu:', error);
                this.setState({
                    loading: false,
                    passwordErrors: { general: error.response?.data?.message || 'Lỗi khi đổi mật khẩu' }
                });
                this.showToast(error.response?.data?.message || 'Lỗi khi đổi mật khẩu', 'error');
            });
    };

    // Xử lý khi người dùng chọn ảnh avatar
    handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            if (!file.type.match('image.*')) {
                this.showToast('Vui lòng chọn file hình ảnh', 'error');
                return;
            }

            // Kiểm tra kích thước file (tối đa 2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showToast('Kích thước file không được vượt quá 2MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.setState({
                    avatarPreview: e.target.result,
                    avatarFile: file
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload avatar
    uploadAvatar = () => {
        const { avatarFile } = this.state;
        if (!avatarFile) {
            this.showToast('Vui lòng chọn ảnh đại diện', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', avatarFile);

        this.setState({ loading: true });

        axios.post('/api/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        user: response.data.data,
                        avatarPreview: null,
                        avatarFile: null,
                        loading: false
                    });
                    this.showToast('Cập nhật ảnh đại diện thành công');
                } else {
                    this.setState({
                        loading: false,
                        error: response.data?.message || 'Không thể cập nhật ảnh đại diện'
                    });
                    this.showToast(response.data?.message || 'Không thể cập nhật ảnh đại diện', 'error');
                }
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật ảnh đại diện:', error);
                this.setState({ loading: false });
                this.showToast(error.response?.data?.message || 'Lỗi khi cập nhật ảnh đại diện', 'error');
            });
    };

    // Xóa avatar
    removeAvatar = () => {
        if (!window.confirm('Bạn có chắc muốn xóa ảnh đại diện?')) return;

        this.setState({ loading: true });

        axios.delete('/api/users/avatar')
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        user: response.data.data,
                        avatarPreview: null,
                        avatarFile: null,
                        loading: false
                    });
                    this.showToast('Xóa ảnh đại diện thành công');
                } else {
                    this.setState({
                        loading: false,
                        error: response.data?.message || 'Không thể xóa ảnh đại diện'
                    });
                    this.showToast(response.data?.message || 'Không thể xóa ảnh đại diện', 'error');
                }
            })
            .catch(error => {
                console.error('Lỗi khi xóa ảnh đại diện:', error);
                this.setState({ loading: false });
                this.showToast(error.response?.data?.message || 'Lỗi khi xóa ảnh đại diện', 'error');
            });
    };

    // Đăng xuất
    handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    // Lấy URL hình ảnh đầy đủ
    getImageUrl = (imagePath) => {
        if (!imagePath) return `${process.env.PUBLIC_URL}/assets/img/user/default-avatar.jpg`;

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        return imagePath.startsWith('/')
            ? `${baseUrl}${imagePath}`
            : `${baseUrl}/${imagePath}`;
    };

    // Xem chi tiết đơn hàng
    viewOrderDetails = (orderId) => {
        this.setState({ orderLoading: true, selectedOrderId: orderId });
        axios.get(`/api/orders/${orderId}`)
            .then(response => {
                if (response.data && response.data.success) {
                    this.setState({
                        orderDetails: response.data.data,
                        showOrderDetailsModal: true,
                        orderLoading: false
                    });
                } else {
                    this.showToast(response.data?.message || 'Không thể lấy chi tiết đơn hàng', 'error');
                    this.setState({ orderLoading: false });
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                this.showToast(error.response?.data?.message || 'Lỗi khi lấy chi tiết đơn hàng', 'error');
                this.setState({ orderLoading: false });
            });
    };

    // Đóng modal chi tiết đơn hàng
    closeOrderDetailsModal = () => {
        this.setState({ showOrderDetailsModal: false, orderDetails: null });
        const url = new URL(window.location.href);
        url.searchParams.delete('orderId');
        window.history.replaceState({}, '', url.toString());
    };

    // Thay đổi trang khi xem danh sách đơn hàng
    handleOrderPageChange = (pageNumber) => {
        this.setState({ orderCurrentPage: pageNumber }, () => {
            this.fetchOrders();
        });
    };

    // Hủy đơn hàng
    cancelOrder = (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;

        this.setState({ orderLoading: true });
        axios.post(`/api/orders/${orderId}/cancel`)
            .then(response => {
                if (response.data && response.data.success) {
                    this.showToast('Hủy đơn hàng thành công');
                    this.fetchOrders();
                    this.setState({ showOrderDetailsModal: false, orderDetails: null });
                } else {
                    this.showToast(response.data?.message || 'Không thể hủy đơn hàng', 'error');
                    this.setState({ orderLoading: false });
                }
            })
            .catch(error => {
                console.error('Lỗi khi hủy đơn hàng:', error);
                this.showToast(error.response?.data?.message || 'Lỗi khi hủy đơn hàng', 'error');
                this.setState({ orderLoading: false });
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
            'COD': 'Thanh toán khi nhận hàng',
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
            'PENDING': 'Chưa thanh toán',
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

    // Process VNPAY payment for an order
    processVnpayPayment = async (orderId) => {
        try {
            this.setState({ orderLoading: true });
            const paymentRequest = {
                orderId: orderId
            };

            const vnpayResponse = await axios.post('/api/vnpay', paymentRequest);

            if (vnpayResponse.data) {
                // API trả về URL của VNPay, điều hướng người dùng đến đó
                window.location.href = vnpayResponse.data;
            } else {
                this.showToast('Không thể tạo yêu cầu thanh toán VNPay.', 'error');
                this.setState({ orderLoading: false });
            }
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán VNPay:', error);
            this.setState({ orderLoading: false });
            const errorMessage = error.response?.data?.message || error.response?.data || 'Lỗi khi tạo yêu cầu thanh toán VNPay.';
            this.showToast(errorMessage, 'error');
        }
    };

    render() {
        const {
            user,
            activeTab,
            loading,
            error,
            toasts,
            avatarPreview,
            currentPassword,
            newPassword,
            confirmPassword,
            passwordErrors,
            errors,
            orders,
            orderLoading,
            orderError,
            orderCurrentPage,
            orderTotalPages,
            orderTotalElements,
            orderPageSize,
            selectedOrderId,
            orderDetails,
            showOrderDetailsModal
        } = this.state;

        return (
            <div>
                <NavbarV2 />
                <div className="profile-page-area pd-top-120 pd-bottom-90">
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

                                <div className="row">
                            {/* Sidebar */}
                            <div className="col-lg-3">
                                <div className="profile-sidebar">
                                    <div className="profile-sidebar-header">
                                        <div className="profile-avatar">
                                            <a href="#" data-toggle="modal" data-target="#avatarModal">
                                                <img
                                                    src={avatarPreview || this.getImageUrl(user.avatar)}
                                                    alt={user.fullName || 'Avatar'}
                                                />
                                            </a>
                                            <div className="modal fade" id="avatarModal" tabIndex="-1" role="dialog" aria-labelledby="avatarModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                                    <div className="modal-content">
                                                        <img
                                                            src={avatarPreview || this.getImageUrl(user.avatar)}
                                                            alt={user.fullName || 'Avatar'}
                                                            className="img-fluid"
                                                            />
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="profile-name">{user.fullName}</h4>
                                        <p className="profile-email">{user.email}</p>
                                </div>
                                    <div className="profile-sidebar-menu">
                                        <ul>
                                            <li className={activeTab === 'profile' ? 'active' : ''}>
                                                <a href="#profile" onClick={(e) => { e.preventDefault(); this.handleTabChange('profile'); }}>
                                                    <i className="fa fa-user"></i> Thông tin tài khoản
                                                </a>
                                            </li>
                                            <li className={activeTab === 'orders' ? 'active' : ''}>
                                                <a href="#orders" onClick={(e) => { e.preventDefault(); this.handleTabChange('orders'); }}>
                                                    <i className="fa fa-shopping-bag"></i> Lịch sử đơn hàng
                                                </a>
                                            </li>
                                            <li className={activeTab === 'password' ? 'active' : ''}>
                                                <a href="#password" onClick={(e) => { e.preventDefault(); this.handleTabChange('password'); }}>
                                                    <i className="fa fa-lock"></i> Đổi mật khẩu
                                                </a>
                                            </li>
                                            <li className="sidebar-menu-logout">
                                                <a href="#logout" onClick={(e) => { e.preventDefault(); this.handleLogout(); }}>
                                                    <i className="fa fa-power-off"></i> Đăng xuất
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="col-lg-9">
                                <div className="card p-4">
                                    {/* Thông tin tài khoản */}
                                    {activeTab === 'profile' && (
                                        <div>
                                            <div className="profile-section-title">
                                                <h3>Thông tin tài khoản</h3>
                                            </div>
                                            <div className="profile-form">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Email</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                value={user.email}
                                                                disabled
                                                            />
                                                            <small className="form-text text-muted">Email không thể thay đổi</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Họ và tên</label>
                                                                    <input
                                                                        type="text"
                                                                className={`form-control ${errors?.fullName ? 'is-invalid' : ''}`}
                                                                name="fullName"
                                                                value={user.fullName || ''}
                                                                onChange={this.handleInputChange}
                                                            />
                                                            {errors?.fullName && (
                                                                <div className="invalid-feedback">{errors.fullName}</div>
                                                            )}
                                                                </div>
                                                            </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Số điện thoại</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${errors?.phoneNumber ? 'is-invalid' : ''}`}
                                                                name="phoneNumber"
                                                                value={user.phoneNumber || ''}
                                                                onChange={this.handleInputChange}
                                                            />
                                                            {errors?.phoneNumber && (
                                                                <div className="invalid-feedback">{errors.phoneNumber}</div>
                                                            )}
                                                        </div>
                                                            </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Địa chỉ</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="address"
                                                                value={user.address || ''}
                                                                onChange={this.handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                                    <button
                                                    className="admin-btn admin-btn-primary"
                                                    onClick={this.saveUserInfo}
                                                    disabled={loading}
                                                                    >
                                                    {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                                                                    </button>
                                            </div>

                                            <div className="profile-section-title mt-5">
                                                <h3>Ảnh đại diện</h3>
                                            </div>
                                            <div className="profile-avatar-section">
                                                <div className="profile-avatar-container">
                                                    <img
                                                        src={avatarPreview || this.getImageUrl(user.avatar)}
                                                        alt={user.fullName || 'Avatar'}
                                                        className="profile-avatar-preview"
                                                    />
                                                </div>
                                                <div className="profile-avatar-controls">
                                                                    <input
                                                        type="file"
                                                        ref={this.fileInputRef}
                                                        style={{ display: 'none' }}
                                                        onChange={this.handleAvatarChange}
                                                        accept="image/*"
                                                                    />
                                                                    <button
                                                        className="admin-btn admin-btn-primary"
                                                        onClick={() => this.fileInputRef.current.click()}
                                                                    >
                                                        Chọn ảnh
                                                                    </button>
                                                    {avatarPreview && (
                                                        <button
                                                            className="admin-btn admin-btn-success"
                                                            onClick={this.uploadAvatar}
                                                            disabled={loading}
                                                        >
                                                            {loading ? 'Đang tải lên...' : 'Lưu ảnh'}
                                                        </button>
                                                    )}
                                                    {user.avatar && (
                                                        <button
                                                            className="admin-btn admin-btn-secondary"
                                                            onClick={this.removeAvatar}
                                                            disabled={loading}
                                                        >
                                                            Xóa ảnh
                                                        </button>
                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                    )}

                                    {/* Lịch sử đơn hàng */}
                                    {activeTab === 'orders' && (
                                        <div className="profile-orders">
                                            <div className="profile-section-title">
                                                <h3>Lịch sử đơn hàng</h3>
                                                            </div>
                                            {orderLoading && (
                                                <div className="text-center mb-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="sr-only">Đang tải...</span>
                                                        </div>
                                                </div>
                                            )}
                                            {orderError && !orderLoading && (
                                                <div className="alert alert-danger" role="alert">
                                                    {orderError}
                                                </div>
                                            )}
                                            {!orderLoading && orders.length === 0 && (
                                                <div className="alert alert-info">
                                                    Bạn chưa có đơn hàng nào.
                                                </div>
                                            )}
                                            {!orderLoading && orders.length > 0 && (
                                                <div className="table-responsive">
                                                    <table className="admin-table product-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Mã đơn hàng</th>
                                                                <th>Ngày đặt</th>
                                                                <th>Tổng tiền</th>
                                                                <th className="text-center">Trạng thái</th>
                                                                <th className="text-center">Hành động</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orders.map(order => (
                                                                <tr 
                                                                    key={order.orderId} 
                                                                    className="order-row" 
                                                                    onClick={() => this.viewOrderDetails(order.orderId)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{order.orderId}</td>
                                                                    <td>{this.formatDate(order.createdAt)}</td>
                                                                    <td>{this.formatCurrency(order.totalAmount)}</td>
                                                                    <td className="text-center">
                                                                        <span className={`admin-badge ${this.getOrderStatusClass(order.status)}`}>
                                                                            {this.formatOrderStatus(order.status)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {order.status === 'PENDING' && (
                                                        <button
                                                                                className="admin-btn admin-btn-danger"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên phần tử cha
                                                                                    this.cancelOrder(order.orderId);
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-times"></i> Hủy
                                                        </button>
                                                                        )}
                                                                        {order.status === 'PENDING' && 
                                                                         order.paymentMethod === 'VN_PAY' && 
                                                                         order.paymentStatus === 'NOT_PAID' && (
                                                                            <button
                                                                                className="admin-btn admin-btn-primary ml-2"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên phần tử cha
                                                                                    this.processVnpayPayment(order.orderId);
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-credit-card"></i> Thanh toán
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    </div>
                                            )}

                                            {orderTotalPages > 1 && (
                                                <nav className="admin-pagination-wrapper mt-4 d-flex justify-content-center">
                                                    <ul className="admin-pagination">
                                                        <li className={`page-item ${orderCurrentPage === 0 ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => this.handleOrderPageChange(orderCurrentPage - 1)}
                                                                disabled={orderCurrentPage === 0}
                                                            >
                                                                &laquo;
                                                            </button>
                                                        </li>
                                                        {Array.from({ length: orderTotalPages }, (_, i) => i).map(page => (
                                                            <li key={page} className={`page-item ${orderCurrentPage === page ? 'active' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => this.handleOrderPageChange(page)}
                                                                >
                                                                    {page + 1}
                                                                </button>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item ${orderCurrentPage === orderTotalPages - 1 ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => this.handleOrderPageChange(orderCurrentPage + 1)}
                                                                disabled={orderCurrentPage === orderTotalPages - 1}
                                                            >
                                                                &raquo;
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                        )}
                                    </div>
                                    )}

                                    {/* Đổi mật khẩu */}
                                    {activeTab === 'password' && (
                                        <div>
                                            <div className="profile-section-title">
                                                <h3>Đổi mật khẩu</h3>
                                            </div>
                                            <div className="profile-form">
                                                {passwordErrors?.general && (
                                                    <div className="alert alert-danger">
                                                        {passwordErrors.general}
                                                </div>
                                                )}
                                                <div className="form-group">
                                                    <label>Mật khẩu hiện tại</label>
                                                    <input
                                                        type="password"
                                                        className={`form-control ${passwordErrors?.currentPassword ? 'is-invalid' : ''}`}
                                                        name="currentPassword"
                                                        value={currentPassword}
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                    {passwordErrors?.currentPassword && (
                                                        <div className="invalid-feedback">{passwordErrors.currentPassword}</div>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>Mật khẩu mới</label>
                                                    <input
                                                        type="password"
                                                        className={`form-control ${passwordErrors?.newPassword ? 'is-invalid' : ''}`}
                                                        name="newPassword"
                                                        value={newPassword}
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                    {passwordErrors?.newPassword && (
                                                        <div className="invalid-feedback">{passwordErrors.newPassword}</div>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>Xác nhận mật khẩu mới</label>
                                                    <input
                                                        type="password"
                                                        className={`form-control ${passwordErrors?.confirmPassword ? 'is-invalid' : ''}`}
                                                        name="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                    {passwordErrors?.confirmPassword && (
                                                        <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>
                                                    )}
                                                </div>
                                                <button
                                                    className="admin-btn admin-btn-success"
                                                    onClick={this.changePassword}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                <Footer />
                {showOrderDetailsModal && (
                    <div className="modal order-details-modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Chi tiết đơn hàng #{orderDetails?.orderId}</h5>
                                    <button type="button" className="close" onClick={this.closeOrderDetailsModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {orderLoading && (
                                        <div className="text-center mb-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Đang tải...</span>
                                            </div>
                                        </div>
                                    )}
                                    {orderError && !orderLoading && (
                                        <div className="alert alert-danger" role="alert">
                                            {orderError}
                                        </div>
                                    )}
                                    {orderDetails && !orderLoading && (
                                        <div className="order-details-content">
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
                                                                <td>{orderDetails.paymentMethod === 'VN_PAY' ? 'VNPay' : this.formatPaymentMethod(orderDetails.paymentMethod)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Trạng thái thanh toán:</strong></td>
                                                                <td>
                                                                    <span className={`admin-badge ${orderDetails.paymentStatus === 'PAID' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                                                                        {this.formatPaymentStatus(orderDetails.paymentStatus) === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
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
                                    )}
                                </div>
                                <div className="modal-footer">
                                    {orderDetails && orderDetails.status === 'PENDING' && (
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-danger"
                                            onClick={() => this.cancelOrder(orderDetails.orderId)}
                                            disabled={orderLoading}
                                        >
                                            <i className="fa fa-times-circle mr-1"></i> Hủy đơn hàng
                                        </button>
                                    )}
                                    {orderDetails && orderDetails.status === 'PENDING' && 
                                     orderDetails.paymentMethod === 'VN_PAY' && 
                                     orderDetails.paymentStatus === 'NOT_PAID' && (
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-primary"
                                            onClick={() => this.processVnpayPayment(orderDetails.orderId)}
                                            disabled={orderLoading}
                                        >
                                            <i className="fa fa-credit-card mr-1"></i> Thanh toán qua VNPay
                                        </button>
                                    )}
                                    <button type="button" className="admin-btn admin-btn-secondary" onClick={this.closeOrderDetailsModal}>
                                        <i className="fa fa-times mr-1"></i> Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <style jsx>{`
                    .order-row:hover {
                        background-color: #f8f9fa;
                    }
                `}</style>
            </div>
        );
    }
}

export default withAuth(Profile, { requiredRoles: ['USER', 'ADMIN', 'SELLER'] }); 