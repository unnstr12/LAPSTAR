import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../utils/axiosConfig';
import '../css/dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalSoldProducts: 0,
        newUsers: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        recentOrders: [],
        topProducts: [],
        revenueByTime: [],
        soldProductsByTime: [],
        ordersByStatus: [],
        productsByCategory: [],
        topRevenueProducts: []
    });
    const [timeRange, setTimeRange] = useState('weekly');
    const [customTimeRange, setCustomTimeRange] = useState(false);
    const [startDate, setStartDate] = useState(getLastWeekDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const customDateRef = useRef(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Hàm lấy ngày hiện tại định dạng YYYY-MM-DD
    function getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    // Hàm lấy ngày 7 ngày trước định dạng YYYY-MM-DD
    function getLastWeekDate() {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    }

    // Chuẩn bị tham số truy vấn dựa trên lựa chọn khoảng thời gian
    const getQueryParams = () => {
        let params = {};

        if (timeRange === 'custom') {
            if (startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            } else {
                params.timeRange = 'weekly'; // Fallback nếu không có ngày
            }
        } else {
            params.timeRange = timeRange;
        }

        return params;
    };

    // Lấy dữ liệu thống kê cho dashboard
    useEffect(() => {
        const fetchDashboardStats = async () => {
            setIsLoading(true);
            try {
                // Lấy tham số truy vấn
                const params = getQueryParams();

                // Các API gọi thống kê
                const endpoints = {
                    overview: '/api/admin/stats/overview',
                    revenue: '/api/admin/stats/revenue',
                    soldProducts: '/api/admin/stats/sold-products',
                    ordersByStatus: '/api/admin/stats/orders-by-status',
                    recentOrders: '/api/admin/stats/recent-orders',
                    topProducts: '/api/admin/stats/top-products',
                    productsByCategory: '/api/admin/stats/products-by-category',
                    topRevenueProducts: '/api/admin/stats/top-revenue-products'
                };

                // Gọi tất cả API song song
                const [
                    overviewResponse,
                    revenueResponse,
                    soldProductsResponse,
                    orderStatusResponse,
                    recentOrdersResponse,
                    topProductsResponse,
                    productsByCategoryResponse,
                    topRevenueProductsResponse
                ] = await Promise.all([
                    axios.get(endpoints.overview, { params }),
                    axios.get(endpoints.revenue, { params }),
                    axios.get(endpoints.soldProducts, { params }),
                    axios.get(endpoints.ordersByStatus, { params }),
                    axios.get(endpoints.recentOrders, { params }),
                    axios.get(endpoints.topProducts, { params }),
                    axios.get(endpoints.productsByCategory, { params }),
                    axios.get(endpoints.topRevenueProducts, { params })
                ]);

                // Tổng hợp dữ liệu
                if (overviewResponse.data && overviewResponse.data.success) {
                    setStats({
                        ...overviewResponse.data.data,
                        revenueByTime: revenueResponse.data.data || [],
                        soldProductsByTime: soldProductsResponse.data.data || [],
                        ordersByStatus: orderStatusResponse.data.data || [],
                        recentOrders: recentOrdersResponse.data.data || [],
                        topProducts: topProductsResponse.data.data || [],
                        productsByCategory: productsByCategoryResponse.data.data || [],
                        topRevenueProducts: topRevenueProductsResponse.data.data || []
                    });
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu thống kê dashboard:', error);
                setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, [timeRange, startDate, endDate, refreshTrigger]);

    // Thay đổi khoảng thời gian
    const handleTimeRangeChange = (range) => {
        if (range !== timeRange) {
            setTimeRange(range);
            setCustomTimeRange(range === 'custom');

            // Thiết lập ngày mặc định dựa trên khoảng thời gian mới
            if (range !== 'custom') {
                switch (range) {
                    case 'daily':
                        setStartDate(getCurrentDate());
                        setEndDate(getCurrentDate());
                        break;
                    case 'weekly':
                        setStartDate(getLastWeekDate());
                        setEndDate(getCurrentDate());
                        break;
                    case 'monthly':
                        const date = new Date();
                        date.setMonth(date.getMonth() - 1);
                        setStartDate(date.toISOString().split('T')[0]);
                        setEndDate(getCurrentDate());
                        break;
                    default:
                        break;
                }
            }
        }
    };

    // Xử lý khi submit form chọn ngày tùy chỉnh
    const handleCustomDateSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(customDateRef.current);
        const start = formData.get('startDate');
        const end = formData.get('endDate');

        if (start && end) {
            // Kiểm tra ngày hợp lệ
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (endDate < startDate) {
                alert('Ngày kết thúc phải sau ngày bắt đầu');
                return;
            }

            setStartDate(start);
            setEndDate(end);
            // Trigger refresh
            setRefreshTrigger(prev => prev + 1);
        }
    };

    // Tạo URL ảnh đầy đủ
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;

        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        const imagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

        return `${baseUrl}${imagePath}`;
    };

    // Định dạng tiền tệ
    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
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

    // Định dạng ngày
    const formatShortDate = (dateString) => {
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

    // Lấy nhãn hiển thị cho trạng thái đơn hàng
    const getStatusLabel = (status) => {
        const statusMap = {
            'PENDING': 'Đang chờ xử lý',
            'CONFIRMED': 'Đã xác nhận',
            'SHIPPING': 'Đang giao hàng',
            'DELIVERED': 'Đã giao hàng',
            'COMPLETED': 'Hoàn thành',
            'CANCELLED': 'Đã hủy',
            'RETURNED': 'Hoàn hàng'
        };
        return statusMap[status] || 'Không xác định';
    };

    // Lấy thời gian hiển thị
    const getTimeRangeTitle = () => {
        switch (timeRange) {
            case 'daily':
                return 'hôm nay';
            case 'weekly':
                return 'tuần này';
            case 'monthly':
                return 'tháng này';
            case 'custom':
                return `từ ${formatShortDate(startDate)} đến ${formatShortDate(endDate)}`;
            default:
                return '';
        }
    };

    // Màu cho biểu đồ
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#a4de6c'];

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Đang tải dữ liệu thống kê...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-product-list-page">
            <div className="admin-card-header">
                <div className="d-flex align-items-center">
                    <h3 className="admin-card-title">Dashboard</h3>
                    <span className="ml-2 time-range-info">(Thống kê {getTimeRangeTitle()})</span>
                </div>
                <div className="d-flex">
                    {customTimeRange && (
                        <form ref={customDateRef} onSubmit={handleCustomDateSubmit} className="custom-date-form">
                            <div className="form-row">
                                <div className="form-group mb-0">
                                    <label className="date-label mb-0" htmlFor="startDate">Từ ngày</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className="form-control"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="date-label mb-0" htmlFor="endDate">Đến ngày</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        className="form-control"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                    <div className="d-flex ml-4">
                        <select
                            className="admin-form-control" // Sử dụng class form-control có sẵn trong CSS
                            value={timeRange}
                            onChange={(e) => handleTimeRangeChange(e.target.value)}
                            style={{ minWidth: '150px' }} // Thêm style để select có độ rộng tối thiểu
                        >
                            <option value="daily">Hôm nay</option>
                            <option value="weekly">Tuần này</option>
                            <option value="monthly">Tháng này</option>
                            <option value="custom">Tùy chọn</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="status-section-container">
                <div className="status-cards-grid">
                    <div className="status-card-item">
                        <div className="icon-wrapper blue-icon">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="info-content">
                            <div className="label">Tổng doanh thu</div>
                            <div className="value">{formatCurrency(stats.totalRevenue || 0)}</div>
                        </div>
                    </div>
                    <div className="status-card-item">
                        <div className="icon-wrapper blue-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div className="info-content">
                            <div className="label">Tổng đơn hàng</div>
                            <div className="value">{stats.totalOrders || 0}</div>
                        </div>
                    </div>
                    <div className="status-card-item">
                        <div className="icon-wrapper blue-icon">
                            <i className="fas fa-box"></i>
                        </div>
                        <div className="info-content">
                            <div className="label">Sản phẩm đã bán</div>
                            <div className="value">{stats.totalSoldProducts || 0}</div>
                        </div>
                    </div>
                    <div className="status-card-item">
                        <div className="icon-wrapper blue-icon">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="info-content">
                            <div className="label">Người dùng mới</div>
                            <div className="value">{stats.newUsers || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-layout mt-4">
                {/* Cột chính */}
                <div className="dashboard-main-content">
                    {/* Biểu đồ doanh thu */}
                    <div className="address-card-container">
                        <h2 className="section-title-main">Doanh thu {getTimeRangeTitle()}</h2>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart
                                    data={stats.revenueByTime}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={14} padding={{ left: 10, right: 10 }} />
                                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        notation: 'compact',
                                        compactDisplay: 'short',
                                        minimumFractionDigits: 0
                                    }).format(value)} fontSize={14} padding={{ top: 10, bottom: 10 }} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name="Doanh thu"
                                        stroke="#3498db"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Biểu đồ sản phẩm bán ra */}
                    <div className="address-card-container">
                        <h2 className="section-title-main">Sản phẩm bán ra {getTimeRangeTitle()}</h2>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={stats.soldProductsByTime}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={14} padding={{ left: 5, right: 5 }} />
                                    <YAxis fontSize={14} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Số lượng" fill="#1e37c2" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Danh sách đơn hàng gần đây */}
                    <div className="address-card-container">
                        <h2 className="section-title-main">Đơn hàng gần đây</h2>
                        <div className="table-responsive">
                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>Mã ĐH</th>
                                        <th>Khách hàng</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày đặt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.map((order) => (
                                            <tr key={order.orderId}>
                                                <td>#{order.orderId}</td>
                                                <td>
                                                    <Link to={`/admin/orders/${order.orderId}`} className="product-name">
                                                        {order.fullName}
                                                    </Link>
                                                </td>
                                                <td>{formatCurrency(order.totalAmount)}</td>
                                                <td>
                                                    <span className={`admin-badge ${getStatusBadgeClass(order.status)}`}>
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </td>
                                                <td>{formatDate(order.createdAt)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">Không có đơn hàng nào trong khoảng thời gian này</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="view-all-link">
                            <Link to="/admin/orders" className="admin-btn admin-btn-sm admin-btn-secondary">
                                Xem tất cả đơn hàng <i className="fa fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="dashboard-sidebar">
                    {/* Biểu đồ trạng thái đơn hàng */}
                    <div className="address-card-container">
                        <h2 className="section-title-main mb-0">Đơn hàng theo trạng thái {getTimeRangeTitle()}</h2>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={360}>
                                <PieChart>
                                    <Pie
                                        data={stats.ordersByStatus && stats.ordersByStatus.length > 0 ? stats.ordersByStatus.filter(item => item.value > 0) : []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        innerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        fontSize={14}
                                    >
                                        {(stats.ordersByStatus && stats.ordersByStatus.length > 0 ? stats.ordersByStatus.filter(item => item.value > 0) : []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => value} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Biểu đồ sản phẩm theo danh mục */}
                    <div className="address-card-container">
                        <h2 className="section-title-main mb-0">Sản phẩm bán ra theo danh mục {getTimeRangeTitle()}</h2>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={340}>
                                <PieChart>
                                    <Pie
                                        data={stats.productsByCategory && stats.productsByCategory.length > 0 ? stats.productsByCategory : []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        innerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        fontSize={14}
                                    >
                                        {(stats.productsByCategory && stats.productsByCategory.length > 0 ? stats.productsByCategory : []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => `${name}: ${value} sản phẩm`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sản phẩm bán chạy */}
                    <div className="address-card-container">
                        <h2 className="section-title-main">Sản phẩm bán chạy {getTimeRangeTitle()}</h2>
                        <div className="top-products-list">
                            {stats.topProducts && stats.topProducts.length > 0 ? (
                                stats.topProducts.map((product, index) => (
                                    <div className="top-product-item" key={product.productId}>
                                        <div className="rank-badge">{index + 1}</div>
                                        <div className="product-thumbnail">
                                            <img src={getImageUrl(product.productImage)} alt={product.productName} className="product-image" />
                                        </div>
                                        <div className="product-info">
                                            <div>
                                                <Link to={`/admin/products/${product.productId}`} className="product-name">
                                                    {product.productName}
                                                </Link>
                                            </div>
                                            <div className="product-price">Giá bán: {formatCurrency(product.price)}</div>
                                            <div className="product-sold">{product.soldQuantity} sản phẩm đã bán ra</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Không có dữ liệu sản phẩm bán chạy trong khoảng thời gian này</p>
                            )}
                        </div>
                        <div className="view-all-link">
                            <Link to="/admin/products" className="admin-btn admin-btn-sm admin-btn-secondary">
                                Xem tất cả sản phẩm <i className="fa fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Sản phẩm có doanh thu cao nhất */}
                    <div className="address-card-container">
                        <h2 className="section-title-main">Doanh thu cao nhất {getTimeRangeTitle()}</h2>
                        <div className="top-products-list">
                            {stats.topRevenueProducts && stats.topRevenueProducts.length > 0 ? (
                                stats.topRevenueProducts.map((product, index) => (
                                    <div className="top-product-item" key={product.productId}>
                                        <div className="rank-badge">{index + 1}</div>
                                        <div className="product-thumbnail">
                                            <img src={getImageUrl(product.productImage)} alt={product.productName} className="product-image" />
                                        </div>
                                        <div className="product-info">
                                            <div>
                                                <Link to={`/admin/products/${product.productId}`} className="product-name">
                                                    {product.productName}
                                                </Link>
                                            </div>
                                            <div className="product-price">Doanh thu: {formatCurrency(product.revenue)}</div>
                                            <div className="product-sold">{product.soldQuantity} sản phẩm đã hoàn thành đơn hàng</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Không có dữ liệu sản phẩm doanh thu cao trong khoảng thời gian này</p>
                            )}
                        </div>
                        <div className="view-all-link">
                            <Link to="/admin/products" className="admin-btn admin-btn-sm admin-btn-secondary">
                                Xem tất cả sản phẩm <i className="fa fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 