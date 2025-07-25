import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import parse from 'html-react-parser';
import axios from 'axios';
import './product-details.css';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { variantId } = useParams();
    const history = useHistory();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [brandDetails, setBrandDetails] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);

    const publicUrl = process.env.PUBLIC_URL + '/';

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

    // Hàm tạo slug từ tên danh mục
    const createSlug = (str) => {
        if (!str) return '';
        // Loại bỏ dấu tiếng Việt
        str = str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd');

        // Thay thế các ký tự đặc biệt và khoảng trắng
        return str
            .replace(/[^a-z0-9 -]/g, '') // Loại bỏ ký tự đặc biệt
            .replace(/\s+/g, '-')        // Thay khoảng trắng bằng dấu gạch ngang
            .replace(/-+/g, '-');        // Loại bỏ dấu gạch ngang liên tiếp
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // Lấy thông tin chi tiết sản phẩm
                const response = await axios.get(`/api/products/${variantId}`);
                if (response.data && response.data.success) {
                    const productData = response.data.data;
                    setProduct(productData);
                    console.log("Thông tin sản phẩm:", productData);

                    // Lấy thông tin danh mục cha nếu có
                    if (productData.category && productData.category.parentId) {
                        try {
                            const parentCategoryResponse = await axios.get(`/api/categories/${productData.category.parentId}`);
                            if (parentCategoryResponse.data && parentCategoryResponse.data.success) {
                                setParentCategory(parentCategoryResponse.data.data);
                                console.log("Thông tin danh mục cha:", parentCategoryResponse.data.data);
                            }
                        } catch (categoryError) {
                            console.error("Lỗi khi tải thông tin danh mục cha:", categoryError);
                        }
                    }

                    // Nếu sản phẩm có thông tin thương hiệu, lấy chi tiết thương hiệu
                    if (productData.brand && productData.brand.brandId) {
                        try {
                            const brandResponse = await axios.get(`/api/brands/${productData.brand.brandId}`);
                            if (brandResponse.data && brandResponse.data.success) {
                                setBrandDetails(brandResponse.data.data);
                                console.log("Thông tin thương hiệu:", brandResponse.data.data);
                            }
                        } catch (brandError) {
                            console.error("Lỗi khi tải thông tin thương hiệu:", brandError);
                        }
                    }
                } else {
                    throw new Error("Không thể tải thông tin sản phẩm");
                }

                // Lấy các sản phẩm tương tự (các phiên bản khác)
                const similarResponse = await axios.get(`/api/products/${variantId}/similar`);
                if (similarResponse.data && similarResponse.data.success) {
                    setSimilarProducts(similarResponse.data.data || []);
                    console.log("Sản phẩm tương tự:", similarResponse.data.data);
                }
            } catch (e) {
                console.error("Lỗi khi tải thông tin sản phẩm:", e);
                if (e.response) {
                    setError(`Lỗi ${e.response.status}: ${e.response.data.message || 'Không thể tải chi tiết sản phẩm.'}`);
                } else if (e.request) {
                    setError('Lỗi mạng. Vui lòng kiểm tra kết nối.');
                } else {
                    setError(`Lỗi: ${e.message}`);
                }
                setProduct(null);
                setSimilarProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (variantId) {
            fetchProductDetails();
        } else {
            setError("Không có ID sản phẩm.");
            setLoading(false);
            setProduct(null);
            setSimilarProducts([]);
        }
    }, [variantId]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            const result = await addToCart(variantId, 1);
            if (result.success) {
                showToast(result.message || 'Đã thêm vào giỏ hàng!');
            } else {
                throw new Error(result.message || 'Không thể thêm vào giỏ hàng');
            }
        } catch (e) {
            console.error("Lỗi khi thêm vào giỏ hàng:", e);
            showToast(e.message || 'Lỗi khi thêm vào giỏ hàng.', 'error');
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;
        try {
            const result = await addToCart(variantId, 1);
            if (result.success) {
                // Chuyển hướng đến trang giỏ hàng
                history.push('/cart');
            } else {
                throw new Error(result.message || 'Không thể thêm vào giỏ hàng');
            }
        } catch (e) {
            console.error("Lỗi khi thêm vào giỏ hàng:", e);
            showToast(e.message || 'Lỗi khi thêm vào giỏ hàng.', 'error');
        }
    };

    const handleVariantSelect = (selectedVariantId) => {
        if (selectedVariantId !== variantId) {
            history.push(`/product-details/${selectedVariantId}`);
        }
    };

    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return `${publicUrl}assets/img/product/default-product.jpg`;

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        return imagePath.startsWith('/')
            ? `${baseUrl}${imagePath}`
            : `${baseUrl}/${imagePath}`;
    };

    const openLightbox = () => {
        setLightboxOpen(true);
        // Disable scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        if (!product?.images || product.images.length === 0) return;
        setActiveImageIndex(prevIndex =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        if (!product?.images || product.images.length === 0) return;
        setActiveImageIndex(prevIndex =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    // Handle keydown events for lightbox navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxOpen, product]);

    if (loading) {
        return (
            <div className="container pd-top-100 pd-bottom-100 text-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container pd-top-100 pd-bottom-100 text-center">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container pd-top-100 pd-bottom-100 text-center">
                <p>Dữ liệu sản phẩm không khả dụng.</p>
            </div>
        );
    }

    // Lấy danh sách hình ảnh của sản phẩm
    const images = product.images?.map(img => img.imageUrl) || [];
    const defaultImage = "default-product.jpg";

    return (
        <section className="product-details pd-top-100">
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
                <div className="row">
                    <div className="col-lg-12">
                        <div className="lt-breadcrumb">
                            <a href="/" className="breadcrumb-link-home">Trang chủ</a>
                            <span className="separator">/</span>
                            {parentCategory ? (
                                <>
                                    <a
                                        href={`/${createSlug(parentCategory.categoryName)}`}
                                        className="breadcrumb-link-home"
                                    >
                                        {parentCategory.categoryName}
                                    </a>
                                </>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="single-product-wrap">

                            <div className="product-gallery-main" onClick={openLightbox}>
                                <img
                                    src={images.length > 0 ? getImageUrl(images[activeImageIndex]) : `${publicUrl}assets/img/product/${defaultImage}`}
                                    alt={product.productName}
                                    className="main-image"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="product-gallery-thumbs">
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`thumb-item ${index === activeImageIndex ? 'active' : ''}`}
                                            onClick={() => handleThumbnailClick(index)}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`${product.productName} - ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="product-tab">
                            <ul className="nav nav-pills">
                                <li className="nav-item">
                                    <a className="nav-link active" data-toggle="pill" href="#pills-description">Mô tả</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="pill" href="#pills-specs">Thông số kỹ thuật</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane fade show active" id="pills-description">
                                    {product.description ? parse(product.description) : <p>Chưa có mô tả chi tiết.</p>}
                                </div>
                                <div className="tab-pane fade" id="pills-specs">
                                    <h5 className="title">Thông số kỹ thuật</h5>
                                    <ul className="specs-list">
                                        {product.attributeValues && product.attributeValues.map(attr => (
                                            <li key={attr.productAttributeValueId} className="spec-item">
                                                <span className="spec-key">{attr.attributeName}:</span>
                                                <span className="spec-value">
                                                    {attr.value} {attr.attributeUnit ? attr.attributeUnit : ''}
                                                </span>
                                            </li>
                                        ))}
                                        {product.brand && (
                                            <li className="spec-item">
                                                <span className="spec-key">Thương hiệu:</span>
                                                <span className="spec-value">{product.brand.brandName}</span>
                                            </li>
                                        )}
                                        {product.category && (
                                            <li className="spec-item">
                                                <span className="spec-key">Danh mục:</span>
                                                <span className="spec-value">{product.category.categoryName}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area product-sidebar">
                            <h5 className="product-main-name">{product.productName}</h5>
                            <span className="info-item mb-1">SKU: {product.sku}</span>

                            <div className="widget-cart-content">
                                {product.discountPrice ? (
                                    <>
                                        <div>
                                            <s className='info-item'>{new Intl.NumberFormat('vi-VN').format(product.price)} đ</s>
                                        </div>
                                        <div className='d-flex align-items-center mb-2'>
                                            <h5 className="price mb-0">{new Intl.NumberFormat('vi-VN').format(product.discountPrice)} đ</h5>
                                            <span className="discount-percent ml-1">-{product.discountPercent}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <h5 className="price">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</h5>
                                    </div>
                                )}

                                <div className="stock-status mb-3">
                                    <span className={`admin-badge ${product.stockQuantity > 0 ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                                        Tình trạng: {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </div>
                                {similarProducts && similarProducts.length >= 1 && (
                                    <div className="variant-selector-container">
                                        <h6>Chọn phiên bản khác:</h6>
                                        <div className="variant-options">
                                            {similarProducts.map(variant => (
                                                <button
                                                    key={variant.productId}
                                                    className={`variant-option ${variant.productId == variantId ? 'active' : ''}`}
                                                    onClick={() => handleVariantSelect(variant.productId)}
                                                    title={`${variant.productName} - ${variant.price.toLocaleString('vi-VN')}₫`}
                                                >
                                                    <span className="variant-info">{variant.sku || "-"}</span>
                                                    <span className="variant-price">{variant.price.toLocaleString('vi-VN')}₫</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="product-buttons-container">
                                    <button
                                        className="btn add-to-cart-btn"
                                        onClick={handleAddToCart}
                                        disabled={product.stockQuantity <= 0}
                                    >
                                        Thêm vào giỏ
                                    </button>
                                    <button
                                        className="btn btn-red buy-now-btn"
                                        onClick={handleBuyNow}
                                        disabled={product.stockQuantity <= 0}
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>

                            <div className="product-extra-info">
                                <div className="row">
                                    <div className="col-6 info-item">
                                        <span className="info-icon">🚚</span>
                                        <span className="info-text">Miễn phí vận chuyển toàn quốc</span>
                                    </div>
                                    <div className="col-6 info-item">
                                        <span className="info-icon">🛡️</span>
                                        <span className="info-text">Bảo hành chính hãng 12 tháng</span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6 info-item">
                                        <span className="info-icon">💸</span>
                                        <span className="info-text">Hoàn tiền 100% nếu sản phẩm lỗi</span>
                                    </div>
                                    <div className="col-6 info-item">
                                        <span className="info-icon">🔄</span>
                                        <span className="info-text">Đổi trả trong vòng 30 ngày</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-area product-sidebar mt-4">
                            {brandDetails && (
                                <div className="brand-info-section">
                                    <h5 className="brand-section-title text-center">Thông tin thương hiệu</h5>
                                    <div className="brand-content">
                                        <div className="brand-logo text-center">
                                            <img
                                                src={brandDetails.image ? getImageUrl(brandDetails.image) : `${publicUrl}assets/img/brand/default-brand.jpg`}
                                                alt={brandDetails.brandName || 'Thương hiệu'}
                                            />
                                        </div>
                                        <h5 className="brand-name text-center">{brandDetails.brandName}</h5>
                                        <div className="brand-description">
                                            {brandDetails.description
                                                ? parse(brandDetails.description)
                                                : <p>Không có thông tin mô tả cho thương hiệu này.</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Lightbox for image viewing */}
            {
                lightboxOpen && (
                    <div className={`lightbox ${lightboxOpen ? 'active' : ''}`}>
                        <button className="close-btn" onClick={closeLightbox}>×</button>
                        <button className="prev-btn" onClick={prevImage}>‹</button>
                        <img
                            src={images.length > 0 ? getImageUrl(images[activeImageIndex]) : `${publicUrl}assets/img/product/${defaultImage}`}
                            alt={`${product.productName} - Large View`}
                        />
                        <button className="next-btn" onClick={nextImage}>›</button>
                    </div>
                )
            }
        </section >
    );
};

export default ProductDetails;