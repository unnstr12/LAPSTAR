import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../utils/axiosConfig';
import '../css/product-list-admin.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [rootCategories, setRootCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('productId');
  const [sortDir, setSortDir] = useState('asc');
  const [toasts, setToasts] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const fetchRootCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/categories/root');
      if (response.data && response.data.data) {
        setRootCategories(response.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục gốc:', err);
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/products/paged', {
        params: {
          pageNo: currentPage,
          pageSize,
          sortBy,
          sortDir,
          searchKeyword: activeSearchTerm
        }
      });
      
      console.log('Đã gọi API getAllProductsPaged:', response);
      
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setProducts(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCurrentPage(pageData.pageNo);
      } else {
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Lỗi khi lấy tất cả sản phẩm:', err);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, activeSearchTerm]);

  const fetchProductsByCategory = useCallback(async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/products/root-category/${selectedCategory}`, {
        params: {
          pageNo: currentPage,
          pageSize,
          sortBy,
          sortDir,
          searchKeyword: activeSearchTerm
        }
      });
      
      console.log('Đã gọi API getProductsByRootCategory:', response);
      
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setProducts(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCurrentPage(pageData.pageNo);
      } else {
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm theo danh mục:', err);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, pageSize, sortBy, sortDir, activeSearchTerm]);

  useEffect(() => {
    fetchRootCategories();
    fetchAllProducts();
  }, [fetchRootCategories, fetchAllProducts]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory();
    } else {
      fetchAllProducts();
    }
  }, [selectedCategory, currentPage, pageSize, sortBy, sortDir, activeSearchTerm, fetchProductsByCategory, fetchAllProducts]);

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

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value ? parseInt(value) : null);
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

  const openConfirmModal = (product) => {
    setSelectedProduct(product);
    setConfirmAction(product.isEnabled ? 'disable' : 'enable');
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedProduct(null);
    setConfirmAction(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedProduct) return;
    
    try {
      const endpoint = confirmAction;
      const response = await axios.put(`/api/admin/products/${selectedProduct.productId}/${endpoint}`);
      
      if (response.data && response.data.message) {
        showToast(response.data.message);
      }
      
      closeConfirmModal();
      
      if (selectedCategory) {
        fetchProductsByCategory();
      } else {
        fetchAllProducts();
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái sản phẩm:', err);   
      if (err.response && err.response.data && err.response.data.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Không thể cập nhật trạng thái sản phẩm', 'error');
      }
      closeConfirmModal();
    }
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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
    
    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    return `${baseUrl}/${imagePath}`;
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-product-list-page">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quản lý Sản phẩm</h3>
          <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
            <i className="fa fa-plus"></i> Thêm Sản phẩm
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
                Bạn có chắc chắn muốn {confirmAction === 'disable' ? 'ẩn' : 'hiển thị'} sản phẩm{' '}
                <strong>{selectedProduct?.productName}</strong> không?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={closeConfirmModal}>
                Hủy
              </button>
              <button 
                className={`admin-btn ${confirmAction === 'disable' ? 'admin-btn-danger' : 'admin-btn-success'}`}
                onClick={handleConfirmStatusChange}
              >
                {confirmAction === 'disable' ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card-header">
        <h3 className="admin-card-title">Quản lý Sản phẩm</h3>
        <div className="d-flex">
          <div className="search-container mr-3 d-flex">
            <input
              type="text"
              className="admin-form-control"
              placeholder="Tìm kiếm theo tên sản phẩm..."
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
          <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
            <i className="fa fa-plus"></i> Thêm Sản phẩm
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <select 
                className="admin-form-control"
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
              >
                <option value="">Tất cả sản phẩm</option>
                {rootCategories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex align-items-center">
                <select
                  className="admin-form-control"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10 sản phẩm</option>
                  <option value="20">20 sản phẩm</option>
                  <option value="30">30 sản phẩm</option>
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

          {!loading && products.length === 0 ? (
            <div className="text-center p-5">
              <p>Không tìm thấy sản phẩm nào.</p>
              <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
                Thêm sản phẩm mới
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="admin-table product-table">
                  <thead>
                    <tr>
                      <th className="text-center sortable" onClick={() => handleSort('productId')}>
                        ID {renderSortIcon('productId')}
                      </th>
                      <th className="text-center">Ảnh</th>
                      <th className="sortable" onClick={() => handleSort('productName')}>
                        Tên sản phẩm {renderSortIcon('productName')}
                      </th>
                      <th className="sortable" onClick={() => handleSort('price')}>
                        Giá bán {renderSortIcon('price')}
                      </th>
                      <th className="text-center">Danh mục</th>
                      <th className="text-center">Thương hiệu</th>
                      <th className="text-center sortable" onClick={() => handleSort('stockQuantity')}>
                        Tồn kho {renderSortIcon('stockQuantity')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('isEnabled')}>
                        Trạng thái {renderSortIcon('isEnabled')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('updatedAt')}>
                        Cập nhật cuối {renderSortIcon('updatedAt')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const firstImage = product.images && product.images.length > 0 ? product.images[0].imageUrl : null;
                      
                      return (
                        <tr key={product.productId}>
                          <td className="text-center">{product.productId}</td>
                          <td className="text-center image-cell">
                            <Link to={`/admin/products/${product.productId}`}>
                              <div className="product-thumbnail">
                                <img 
                                  src={getImageUrl(firstImage)} 
                                  alt={product.productName} 
                                  className="product-image"
                                />
                              </div>
                            </Link>
                          </td>
                          <td>
                            <Link to={`/admin/products/${product.productId}`} className="product-name">
                              {product.productName}
                            </Link>
                          </td>
                          <td>
                            {new Intl.NumberFormat('vi-VN').format(product.price)} đ <br/>
                            {product.discountPrice && (
                              <span className="text-danger">
                                {new Intl.NumberFormat('vi-VN').format(product.discountPrice)} đ
                              </span>
                            )}
                          </td>
                          <td className="text-center">{product.category ? product.category.categoryName : '-'}</td>
                          <td className="text-center">{product.brand ? product.brand.brandName : '-'}</td>
                          <td className="text-center">{product.stockQuantity}</td>
                          <td className="text-center">
                            <span 
                              className={`admin-badge ${product.isEnabled ? 'admin-badge-success' : 'admin-badge-danger'}`}
                              onClick={() => openConfirmModal(product)}
                              style={{ cursor: 'pointer' }}
                              title={product.isEnabled ? 'Click để ẩn sản phẩm' : 'Click để hiển thị sản phẩm'}
                            >
                              {product.isEnabled ? 'Hiển thị' : 'Ẩn'}
                            </span>
                          </td>
                          <td className="text-center">{formatDate(product.updatedAt)}</td>
                        </tr>
                      );
                    })}
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

export default ProductList;
