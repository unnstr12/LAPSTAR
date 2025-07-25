import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/global-components/navbar-v2';
import Footer from '../../components/global-components/footer';
import './search-page.css';

const SearchPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('keyword') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 12;

    // Fetch sản phẩm theo từ khóa tìm kiếm
    const fetchSearchResults = useCallback(async () => {
        if (!query) {
            setProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/products/paged', {
                params: {
                    pageNo: currentPage,
                    pageSize,
                    searchKeyword: query
                }
            });

            if (response.data && response.data.success) {
                const pageData = response.data.data;
                setProducts(pageData.content);
                setTotalPages(pageData.totalPages);
                setTotalElements(pageData.totalElements);
            } else {
                throw new Error(response.data?.message || 'Không thể tải kết quả tìm kiếm');
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm sản phẩm:', error);
            setError(error.message || 'Đã xảy ra lỗi khi tìm kiếm');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [query, currentPage]);

    // Gọi API khi các tham số thay đổi
    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    const getImageUrl = (imageUrl) => {
        const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
        // Nếu không có ảnh, trả về ảnh mặc định
        if (!imageUrl) {
            return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
        }

        // Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / để tránh lặp
        const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

        return `${baseUrl}/${imagePath}`;
    }

    const getTopAttributes = (attributeValues) => {
        if (!attributeValues || attributeValues.length === 0) {
            return [];
        }

        // Sắp xếp thuộc tính theo thứ tự ưu tiên (CPU, RAM, Storage, Display, GPU)
        const priorityOrder = {
            'CPU': 1,
            'Processor': 1,
            'RAM': 2,
            'Memory': 2,
            'Storage': 3,
            'Hard Drive': 3,
            'SSD': 3,
            'Display': 4,
            'Screen': 4,
            'Monitor': 4,
            'GPU': 5,
            'Graphics': 5,
            'Graphics Card': 5
        };

        // Sắp xếp theo thứ tự ưu tiên
        const sortedAttributes = [...attributeValues].sort((a, b) => {
            const priorityA = priorityOrder[a.attributeName] || 999;
            const priorityB = priorityOrder[b.attributeName] || 999;
            return priorityA - priorityB;
        });

        // Trả về tối đa 5 thuộc tính
        return sortedAttributes.slice(0, 5);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const renderPagination = () => {
        const pages = [];

        // Hiển thị tối đa 5 trang
        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(0, endPage - 4);
        }

        // Nút Previous
        pages.push(
            <li key="prev" className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button
                    className="page-link"
                    onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    &laquo;
                </button>
            </li>
        );

        // Các nút trang
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(i)}
                    >
                        {i + 1}
                    </button>
                </li>
            );
        }

        // Nút Next
        pages.push(
            <li key="next" className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button
                    className="page-link"
                    onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    &raquo;
                </button>
            </li>
        );

        return <ul className="pagination">{pages}</ul>;
    };

    return (
        <div>
            <Navbar />
            <div className="search-results-page pd-top-100 pd-bottom-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="search-header">
                                <div className="search-header-left">
                                    <h2 className="search-title">Kết quả tìm kiếm: "{query}"</h2>
                                    {!loading && (
                                        <p className="search-count">
                                            Tìm thấy {totalElements} sản phẩm
                                        </p>
                                    )}
                                </div>
                            </div>

                            {loading && (
                                <div className="loading-overlay">
                                    <div className="spinner-container">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Đang tải...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && !loading && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {!loading && !error && products.length === 0 && (
                                <div className="no-results">
                                    <div className="no-results-icon">
                                        <i className="fa fa-search"></i>
                                    </div>
                                    <h3>Không tìm thấy sản phẩm nào</h3>
                                    <p>Vui lòng thử lại với từ khóa khác hoặc xem các sản phẩm của chúng tôi</p>
                                    <Link to="/" className="btn btn-primary">Quay lại trang chủ</Link>
                                </div>
                            )}

                            {!loading && !error && products.length > 0 && (
                                <div className="row">
                                    {products.map(product => {
                                        // Lấy tối đa 5 thuộc tính quan trọng
                                        const topAttributes = getTopAttributes(product.attributeValues);
                                        // Lấy ảnh đầu tiên hoặc ảnh mặc định
                                        const firstImage = product.images && product.images.length > 0 ? product.images[0].imageUrl : null;

                                        return (
                                            <div className="col-xl-2-4 col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" key={product.productId}>
                                                <div className="all-isotope-item" key={product.productId}>
                                                    <div className="thumb">
                                                        <a href={`/product-details/${product.productId}`}>
                                                            <img src={getImageUrl(firstImage)} alt={product.productName} />
                                                            <div className="specs-overlay">
                                                                {topAttributes.map((attr, index) => (
                                                                    <p key={index}>
                                                                        {attr.attributeName}: {attr.value} {attr.attributeUnit}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="item-details">
                                                        {product.discountPrice ? (
                                                            <>
                                                                <div>
                                                                    <s className='discount-price'>{new Intl.NumberFormat('vi-VN').format(product.price)} đ</s>
                                                                </div>
                                                                <div className='d-flex align-items-center mb-2'>
                                                                    <span className="price">{new Intl.NumberFormat('vi-VN').format(product.discountPrice)} đ</span>
                                                                    <span className="discount-percent ml-1">-{product.discountPercent}%</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div>
                                                                <span className="price mb-2">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</span>
                                                            </div>
                                                        )}
                                                        <h6><a href={`/product-details/${product.productId}`}>{product.productName}</a></h6>
                                                        <p className="short-desc">{product.brand.brandName} - {product.category.categoryName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {!loading && totalPages > 1 && (
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="pagination-wrap d-flex justify-content-center">
                                            {renderPagination()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchPage; 