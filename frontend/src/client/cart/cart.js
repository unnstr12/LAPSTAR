import React, { Component } from 'react';
import axios from 'axios';
import Footer from '../../components/global-components/footer';
import NavbarV2 from '../../components/global-components/navbar-v2';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { withRouter } from 'react-router-dom';

// Tạo component dạng functional để sử dụng hook
const CartWithHooks = (props) => {
    const { cart, loading, error, updateQuantity, removeItem, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [toasts, setToasts] = React.useState([]);
    const [productDetails, setProductDetails] = React.useState({});

    React.useEffect(() => {
        // Lấy thông tin chi tiết cho từng sản phẩm
        const fetchProductDetails = async () => {
            if (cart && cart.items && cart.items.length > 0) {
                for (const item of cart.items) {
                    // Nếu đã có đủ thông tin thì bỏ qua
                    if (productDetails[item.productId]?.productName && productDetails[item.productId]?.productImage) continue;
                    try {
                        const response = await axios.get(`/api/products/${item.productId}`);
                if (response.data && response.data.success) {
                            const productData = response.data.data;
                            const mainImage = productData.images && productData.images.length > 0 ? productData.images[0].imageUrl : null;
                            
                            setProductDetails(prev => ({
                                ...prev,
                                [item.productId]: {
                                    ...productData,
                                    productImage: mainImage
                                }
                            }));
                            
                            // Nếu là khách vãng lai và item thiếu tên/ảnh, cập nhật lại cart/localStorage
                            if (!isAuthenticated) {
                                const updatedItems = cart.items.map(ci => {
                                    if (ci.productId === item.productId) {
                                        return {
                                            ...ci,
                                            productName: productData.productName,
                                            productImage: mainImage
                                        };
                                    }
                                    return ci;
            });
                                const totalAmount = updatedItems.reduce((total, it) => total + (it.price * it.quantity), 0);
                                const totalItems = updatedItems.reduce((total, it) => total + it.quantity, 0);
                                const newCart = {
                                    ...cart,
                                    items: updatedItems,
                                    totalAmount,
                                    totalItems
                                };
                                localStorage.setItem('guestCart', JSON.stringify(newCart));
                            }
                        }
                    } catch (error) {
                        // Bỏ log lỗi chi tiết sản phẩm để tránh console spam
                    }
                }
            }
        };
        fetchProductDetails();
    }, [cart]);

    // Toast
    const showToast = (message, type = 'success') => {
        const newToast = { id: Date.now(), message, type, show: true };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
        }, 2000);
    };

    // Lấy thuộc tính sản phẩm
    const getProductAttributes = (productId) => {
        const productDetail = productDetails[productId];
        if (!productDetail || !productDetail.attributeValues) return '-';
        return productDetail.attributeValues.slice(0, 5).map(attr => attr.value).join(', ');
    };

    // Lấy tên sản phẩm (ưu tiên từ productDetails, fallback sang item)
    const getProductName = (item) => {
        return productDetails[item.productId]?.name || item.productName || 'Sản phẩm';
    };
    // Lấy ảnh sản phẩm (ưu tiên từ productDetails, fallback sang item)
    const getProductImage = (item) => {
        const img = productDetails[item.productId]?.mainImage || item.productImage;
        if (!img) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
        if (img.startsWith('http')) return img;
        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
    };

    // Thay đổi số lượng
    const decreaseQuantity = async (productId) => {
        const item = cart.items.find(item => item.productId === productId);
        if (!item || item.quantity <= 1) return;
        const result = await updateQuantity(productId, item.quantity - 1);
        showToast(result.success ? 'Đã cập nhật số lượng sản phẩm' : result.message, result.success ? 'success' : 'error');
    };
    const increaseQuantity = async (productId) => {
        const item = cart.items.find(item => item.productId === productId);
        if (!item) return;
        if (!isAuthenticated) {
            // Lấy tồn kho mới nhất
            try {
                const res = await axios.get(`/api/products/${productId}`);
                if (res.data && res.data.success) {
                    const stock = res.data.data.stockQuantity || 0;
                    if (item.quantity + 1 > stock) {
                        showToast('Không đủ hàng trong kho để tăng số lượng!', 'error');
                        return;
                }
                }
            } catch (e) {
                showToast('Không kiểm tra được tồn kho sản phẩm!', 'error');
                return;
            }
        }
        const result = await updateQuantity(productId, item.quantity + 1);
        showToast(result.success ? 'Đã cập nhật số lượng sản phẩm' : result.message, result.success ? 'success' : 'error');
    };

    // Xóa sản phẩm
    const handleRemoveItem = async (productId) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
        const result = await removeItem(productId);
        showToast(result.success ? 'Đã xóa sản phẩm khỏi giỏ hàng' : result.message, result.success ? 'success' : 'error');
    };
    // Xóa toàn bộ giỏ hàng
    const handleClearCart = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) return;
        const result = await clearCart();
        showToast(result.success ? 'Đã xóa toàn bộ giỏ hàng' : result.message, result.success ? 'success' : 'error');
    };

    // Định dạng giá
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);
    // Chuyển sang trang thanh toán
    const proceedToCheckout = () => { props.history.push('/checkout'); };

        const items = cart?.items || [];
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

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
                            {/* Cart Header */}
                            <div className="cart-header">
                                <h2>Giỏ hàng <span>{totalItems} sản phẩm</span></h2>
                                        {items.length > 0 && (
                                            <button 
                                        className="admin-btn btn-sm btn-outline-danger"
                                        onClick={handleClearCart}
                                            >
                                                <i className="fa fa-trash mr-1"></i> Xóa tất cả
                                            </button>
                                        )}
                                    </div>

                            <div className="row">
                                <div className="col-lg-8">
                                    {/* Product Items */}
                                        {items.length === 0 ? (
                                        <div className="empty-cart">
                                            <i className="fa fa-shopping-cart"></i>
                                                <h5>Giỏ hàng của bạn đang trống</h5>
                                            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                                            <a href="/" className="admin-btn admin-btn-primary">
                                                Tiếp tục mua sắm
                                            </a>
                                            </div>
                                        ) : (
                                        <>
                                                        {items.map(item => (
                                                <div className="cart-item" key={item.cartItemId || item.productId}>
                                                    <div className="item-image">
                                                                        <img 
                                                            src={getProductImage(item)}
                                                            alt={getProductName(item)}
                                                                        />
                                                                    </div>
                                                    <div className="item-details">
                                                        <a href={`/product-details/${item.productId}`}><h3 className="item-title">{getProductName(item)}</h3></a>
                                                        <a href={`/product-details/${item.productId}`} className="item-specs">
                                                            {getProductAttributes(item.productId)}
                                                        </a>
                                                        <div className="d-flex align-items-center mt-2">
                                                            <div className="quantity-control">
                                                                        <button 
                                                                    onClick={() => decreaseQuantity(item.productId)}
                                                                            disabled={item.quantity <= 1}
                                                                        >
                                                                    -
                                                                        </button>
                                                                        <input
                                                                            type="text"
                                                                            value={item.quantity}
                                                                            readOnly
                                                                        />
                                                                        <button 
                                                                    onClick={() => increaseQuantity(item.productId)}
                                                                        >
                                                                    +
                                                                        </button>
                                                                    </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-price">
                                                        <div className='item-specs'>
                                                            {formatPrice(item.price)} đ x {item.quantity}
                                                        </div>
                                                        {formatPrice(item.price * item.quantity)} đ
                                                    </div>
                                                                    <button 
                                                        className="item-delete"
                                                        onClick={() => handleRemoveItem(item.productId)}
                                                        title="Xóa sản phẩm"
                                                                    >
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>
                                                </div>
                                                        ))}
                                        </>
                                        )}
                                </div>
                            <div className="col-lg-4">
                                    <div className="cart-summary">
                                        <div className="summary-header">
                                            <h3>Tóm tắt đơn hàng</h3>
                                        </div>
                                        <div className="summary-body">
                                            <div className="summary-row">
                                                <div className="summary-label">Tạm tính</div>
                                                <div className="summary-value">{formatPrice(cart.totalAmount)} đ</div>
                                            </div>
                                            <div className="summary-row total">
                                                <div className="summary-label">Tổng cộng</div>
                                                <div className="summary-value price total">{formatPrice(cart.totalAmount)} đ</div>
                                        </div>
                                        <button 
                                                className="btn-order"
                                            disabled={items.length === 0 || loading}
                                                onClick={proceedToCheckout}
                                        >
                                                Đặt hàng
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                </div>
                <Footer />
            </div>
        );
};

// Bọc component với withRouter để có thể sử dụng this.props.history
export default withRouter(CartWithHooks);