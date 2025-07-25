import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../utils/axiosConfig';
import '../css/product-detail-admin.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { hasRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    productName: '',
    sku: '',
    price: 0,
    discountPrice: null,
    description: '',
    stockQuantity: 0,
    isEnabled: true,
    brand: { brandId: null },
    category: { categoryId: null, parentId: null },
    images: [],
    attributeValues: []
  });
  const [productStats, setProductStats] = useState({
    revenue: [],
    sales: []
  });

  const [hasDiscount, setHasDiscount] = useState(false);
  const [formattedDiscountPrice, setFormattedDiscountPrice] = useState('0');

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formattedPrice, setFormattedPrice] = useState('0');

  const [toasts, setToasts] = useState([]);

  const [editableAttributeValues, setEditableAttributeValues] = useState([]);

  const [showStockInModal, setShowStockInModal] = useState(false);
  const [stockInQuantity, setStockInQuantity] = useState(1);

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

  const fetchRootCategories = async () => {
    console.log("Fetching root categories...");
    try {
      const response = await axios.get('/api/admin/categories/root');
      if (response.data && response.data.data) {
        setFilteredCategories(response.data.data);
      } else {
        console.warn("No root categories found or API error.");
        setFilteredCategories([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục gốc:', error);
      setFilteredCategories([]);
    }
  };

  const fetchSiblingCategories = async (parentId) => {
    console.log(`Fetching sibling categories for parentId: ${parentId}`);
    if (!parentId) {
      console.warn("Attempted to fetch siblings with null parentId. Fetching roots instead.");
      fetchRootCategories();
      return;
    }
    try {
      const response = await axios.get(`/api/admin/categories/${parentId}/subcategories`);
      if (response.data && response.data.data) {
        setFilteredCategories(response.data.data);
      } else {
        console.warn(`No subcategories found for parentId ${parentId} or API error.`);
        setFilteredCategories([]);
      }
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục con cho parentId ${parentId}:`, error);
      setFilteredCategories([]);
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        console.log('Product data:', response.data);

        if (response.data && response.data.data) {
          const productData = response.data.data;
          setProduct(productData);

          setHasDiscount(productData.discountPrice !== null);

          if (productData.images && productData.images.length > 0) {
            setPreviewImages(productData.images.map(image => ({
              id: image.productImageId,
              url: image.imageUrl,
              isExisting: true
            })));
          }

          if (productData.category?.parentId) {
            fetchSiblingCategories(productData.category.parentId);
          } else {
            fetchRootCategories();
          }

          if (productData.attributeValues && productData.attributeValues.length > 0) {
            setEditableAttributeValues(productData.attributeValues.map(attr => ({ ...attr })));
          } else {
            setEditableAttributeValues([]);
          }
        } else {
          console.warn("Product data not found, fetching root categories as default.");
          fetchRootCategories();
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        console.warn("Error fetching product, fetching root categories as default.");
        fetchRootCategories();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    } else {
      setIsLoading(false);
      fetchRootCategories();
    }
  }, [id]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('/api/brands');
        if (response.data && response.data.data) {
          setBrands(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thương hiệu:', error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (typeof product.price === 'number' && !isNaN(product.price)) {
      setFormattedPrice(product.price.toLocaleString('de-DE'));
    } else {
      setFormattedPrice('0');
    }
  }, [product.price]);

  useEffect(() => {
    if (product.discountPrice !== null && typeof product.discountPrice === 'number' && !isNaN(product.discountPrice)) {
      setFormattedDiscountPrice(product.discountPrice.toLocaleString('de-DE'));
    } else {
      setFormattedDiscountPrice('0');
    }
  }, [product.discountPrice]);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await axios.get(`/api/admin/stats/product-stats?productId=${id}`);
        if (response.data && response.data.success) {
          setProductStats(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê sản phẩm:', error);
      }
    };

    if (id && hasRole('ADMIN')) {
      fetchProductStats();
    }
  }, [id, hasRole]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'price') {
      const rawValue = value.replace(/\./g, '');
      const numericValue = Number(rawValue);
      if (!isNaN(numericValue)) {
        setProduct(prev => ({ ...prev, price: numericValue }));
      } else if (value === '') {
        setProduct(prev => ({ ...prev, price: 0 }));
      }
    } else if (name === 'discountPrice') {
      const rawValue = value.replace(/\./g, '');
      const numericValue = Number(rawValue);
      if (!isNaN(numericValue)) {
        setProduct(prev => ({ ...prev, discountPrice: numericValue }));
      } else if (value === '') {
        setProduct(prev => ({ ...prev, discountPrice: 0 }));
      }
    } else if (name === 'hasDiscount') {
      setHasDiscount(checked);
      if (checked) {
        const initialDiscountPrice = Math.round(product.price * 0.75);
        setProduct(prev => ({ ...prev, discountPrice: initialDiscountPrice }));
      } else {
        setProduct(prev => ({ ...prev, discountPrice: null }));
      }
    } else {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setProduct(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: name === 'category.categoryId'
              ? (Number(value) || null)
              : (type === 'number' ? Number(value) : value)
          }
        }));
      } else {
        setProduct(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked :
            (type === 'number' ? Number(value) : value)
        }));
      }
    }
  };

  const handleAttributeChange = (index, newValue) => {
    setEditableAttributeValues(prevAttributes => {
      const updatedAttributes = prevAttributes.map((attr, i) => {
        if (i === index) {
          return { ...attr, value: newValue };
        }
        return attr;
      });
      return updatedAttributes;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviews = files.map(file => ({
      id: null,
      url: URL.createObjectURL(file),
      isExisting: false,
      file
    }));

    setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = async (index) => {
    const imageToRemove = previewImages[index];
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    if (!imageToRemove.isExisting) {
      if (imageToRemove.file) {
        setImageFiles(prevImageFiles => prevImageFiles.filter(f => f !== imageToRemove.file));
      }
      URL.revokeObjectURL(imageToRemove.url);
    } else {
      try {
        await axios.delete(`/api/admin/product-images/${imageToRemove.id}`);
        showToast('Xóa ảnh thành công');
      } catch (error) {
        console.error('Lỗi khi xóa ảnh:', error);
        showToast('Không thể xóa ảnh. Vui lòng thử lại.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        productName: product.productName,
        sku: product.sku,
        price: product.price,
        discountPrice: hasDiscount ? product.discountPrice : null,
        description: product.description,
        stockQuantity: product.stockQuantity,
        isEnabled: product.isEnabled,
        categoryId: product.category.categoryId,
        brandId: product.brand.brandId
      };

      const response = await axios.put(`/api/admin/products/${id}`, productData);

      if (editableAttributeValues.length > 0) {
        const attributePayload = {
          productId: parseInt(id),
          attributeValues: editableAttributeValues.map(attr => ({
            attributeId: attr.attributeId,
            value: attr.value,
            productAttributeValueId: attr.productAttributeValueId
          }))
        };

        console.log("Submitting attributes:", attributePayload);
        await axios.post(`/api/admin/product-attributes/batch`, attributePayload);
      } else {
        console.log("No attributes to update.");
      }

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(file => {
          formData.append('files', file);
        });

        await axios.post(`/api/admin/product-images/upload/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      showToast('Cập nhật sản phẩm thành công');

      setTimeout(() => {
        history.push('/admin/products');
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại.';
      showToast(errorMessage, 'error');
    }
  };

  const handleStockIn = async () => {
    if (stockInQuantity <= 0) {
      showToast('Số lượng nhập phải lớn hơn 0', 'error');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/admin/products/${id}/stock`, { quantity: stockInQuantity });
      if (response.data && response.data.success) {
        setProduct(prevProduct => ({
          ...prevProduct,
          stockQuantity: response.data.data.stockQuantity
        }));
        showToast('Nhập hàng thành công');
        setShowStockInModal(false);
        setStockInQuantity(1);
      } else {
        showToast(response.data.message || 'Lỗi khi nhập hàng', 'error');
      }
    } catch (error) {
      console.error('Lỗi khi nhập hàng:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Không thể nhập hàng. Vui lòng thử lại.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = !product.isEnabled;
      const endpoint = newStatus ? 'enable' : 'disable';

      await axios.put(`/api/admin/products/${id}/${endpoint}`);

      setProduct({
        ...product,
        isEnabled: newStatus
      });

      showToast(`Sản phẩm đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công`);
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái sản phẩm:', error);
      showToast('Không thể thay đổi trạng thái sản phẩm. Vui lòng thử lại.', 'error');
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;

    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

    return `${baseUrl}/${imagePath}`;
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
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => history.push('/admin/products')}>
          Quay lại danh sách sản phẩm
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
            <button type="button" className="back-button" onClick={() => history.push('/admin/products')}>
              <i className="fas fa-chevron-left"></i> Sản phẩm
            </button>
            <h1>Chi tiết sản phẩm</h1>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-success"
              onClick={() => setShowStockInModal(true)}
            >
              <i className="fas fa-plus-circle"></i> Nhập hàng
            </button>
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-save"></i> Cập nhật
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => history.push('/admin/products')}
            >
              <i className="fas fa-times"></i> Hủy
            </button>
          </div>
        </div>
        <div className="product-detail-body">
          <div className="main-content">
            <div className="card product-info-card">
              <h2 className="card-title">Thông tin sản phẩm</h2>
              <div className="form-group-row">
                <div className="form-group w-75">
                  <label htmlFor="productName">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={product.productName || ''}
                    onChange={handleInputChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sku">Mã SKU</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={product.sku || ''}
                    onChange={handleInputChange}
                    placeholder="Nhập mã SKU"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="brand.brandId">Thương hiệu</label>
                  <div className="select-wrapper">
                    <select
                      id="brand.brandId"
                      name="brand.brandId"
                      value={product.brand?.brandId || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category.categoryId">Danh mục</label>
                  <div className="select-wrapper">
                    <select
                      id="category.categoryId"
                      name="category.categoryId"
                      value={product.category?.categoryId || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {filteredCategories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="stockQuantity">Số lượng tồn kho</label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={product.stockQuantity || 0}
                    onChange={handleInputChange}
                    min="0"
                    required
                    disabled
                    className="disabled-input"
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="price">Giá bán</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="price"
                    name="price"
                    value={formattedPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="discount-checkbox">
                    <label className='mr-2' htmlFor="hasDiscount">Giá khuyến mãi</label>
                    <input
                      type="checkbox"
                      id="hasDiscount"
                      name="hasDiscount"
                      className='mb-2'
                      checked={hasDiscount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="discount-checkbox">
                    <input
                      type="text"
                      inputMode="numeric"
                      id="discountPrice"
                      name="discountPrice"
                      value={formattedDiscountPrice}
                      onChange={handleInputChange}
                      disabled={!hasDiscount}
                      className={!hasDiscount ? 'disabled-input' : ''}
                    />
                    {hasDiscount && product.price > 0 && product.discountPrice > 0 && (
                      <span className="admin-badge admin-badge-danger ml-2">
                        Giảm {Math.round((1 - product.discountPrice / product.price) * 100)}%
                      </span>
                  )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description || ''}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Mô tả chi tiết sản phẩm"
                />
              </div>
            </div>

            <div className="card attributes-card">
              <h2 className="card-title">Thuộc tính sản phẩm</h2>
              <div className="attributes-list">
                {editableAttributeValues && editableAttributeValues.length > 0 ? (
                  <table className="attributes-table">
                    <tbody>
                      {editableAttributeValues.map((attribute, index) => (
                        <tr key={attribute.productAttributeValueId || `attr-${index}`}>
                          <td>{attribute.attributeName}</td>
                          <td>
                            <div className="attribute-input-group">
                              <input
                                type="text"
                                className="admin-form-control admin-form-control-sm"
                                value={attribute.value || ''}
                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                              />
                            </div>
                          </td>
                          <td>{attribute.attributeUnit && <span className="attribute-unit">{attribute.attributeUnit}</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-attributes">Sản phẩm chưa có thuộc tính nào hoặc không thể tải.</p>
                )}
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="card history-card">
              <h2 className="card-title">Thông tin chung</h2>
              <div className="history-item">
                <div className="label">ID sản phẩm</div>
                <div className="value">{product.productId || 'Chưa có'}</div>
              </div>
              <div className="history-item">
                <div className="label">Ngày tạo</div>
                <div className="value">{formatDate(product.createdAt)}</div>
              </div>
              <div className="history-item">
                <div className="label">Cập nhật cuối</div>
                <div className="value">{formatDate(product.updatedAt)}</div>
              </div>
              <div className="history-item">
                <div className="label">Trạng thái</div>
                <div className="value status-toggle">
                  <span
                    className={`admin-badge ${product.isEnabled ? 'admin-badge-success' : 'admin-badge-danger'}`}
                    onClick={handleToggleStatus}
                    style={{ cursor: 'pointer' }}
                    title={product.isEnabled ? 'Click để ẩn sản phẩm' : 'Click để hiển thị sản phẩm'}
                  >
                    {product.isEnabled ? 'Đang hiển thị' : 'Đã ẩn'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card image-card">
              <h2 className="card-title">Hình ảnh</h2>
              <div className="image-gallery">
                {previewImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <img
                      src={image.isExisting ? getImageUrl(image.url) : image.url}
                      alt={`Sản phẩm ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                      title="Xóa ảnh"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                <div className="image-upload">
                  <label htmlFor="upload-image">
                    <div className="upload-placeholder">
                      <i className="fas fa-plus"></i>
                      <span className="text-center text-xl">Thêm ảnh</span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="upload-image"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="image-info">
                <p>Kích thước tối đa: 2 MB</p>
                <p>Định dạng: JPG, PNG, GIF</p>
              </div>
            </div>

            {/* Chỉ hiển thị thống kê bán hàng cho ADMIN */}
            {hasRole('ADMIN') && (
              <div className="card stats-card">
                <h2 className="card-title">Thống kê bán hàng</h2>
                <div className="chart-container" style={{ height: '300px', marginTop: '20px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={productStats.revenue.map((item, index) => ({
                        name: item.name,
                        doanhthu: item.value,
                        soluong: productStats.sales[index]?.value || 0,
                      }))}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={14} padding={{ left: 10, right: 10 }}/>
                      <YAxis yAxisId="left" orientation="left" stroke="#1e37c2" fontSize={14} padding={{ top: 10, bottom: 10 }}/>
                      <YAxis yAxisId="right" orientation="right" stroke="#F22970" tickFormatter={(value) => new Intl.NumberFormat('vi-VN', {
                                              style: 'currency',
                                              currency: 'VND',
                                              notation: 'compact',
                                              compactDisplay: 'short',
                                              minimumFractionDigits: 0
                                          }).format(value)} fontSize={14} padding={{ top: 10, bottom: 10 }}/>
                      <Tooltip 
                        formatter={(value) => {
                          return [value];
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="doanhthu"
                        name="Doanh thu"
                        stroke="#F22970"
                        strokeWidth={1.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="soluong"
                        name="Số lượng"
                        stroke="#1e37c2"
                        strokeWidth={1.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {productStats.revenue.length === 0 && (
                  <p className="text-center mt-3 mb-0">Chưa có dữ liệu bán hàng cho sản phẩm này</p>
                )}
              </div>
            )}
          </div>
        </div>
      </form>

      {showStockInModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h6 className='mb-0'>Nhập hàng cho sản phẩm</h6>
              <button className="admin-modal-close" onClick={() => setShowStockInModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Tên sản phẩm: <strong>{product.productName}</strong>
              </p>
              <div className="quantity-input-group mt-2 mb-2">
                <p>Số lượng: </p>
                <input
                  type="number"
                  id="stockInQuantity"
                  name="stockInQuantity"
                  className="admin-form-control"
                  value={stockInQuantity}
                  onChange={(e) => setStockInQuantity(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <small>Tồn kho hiện tại: {product.stockQuantity}</small>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowStockInModal(false)}>
                Hủy
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleStockIn}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
