import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../../utils/axiosConfig';
import '../css/product-detail-admin.css';

const ProductAddPage = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
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
    category: { categoryId: null },
  });

  const [hasDiscount, setHasDiscount] = useState(false);
  const [formattedDiscountPrice, setFormattedDiscountPrice] = useState('0');

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [rootCategories, setRootCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedRootCategoryId, setSelectedRootCategoryId] = useState('');
  const [attributesForCategory, setAttributesForCategory] = useState([]);
  const [formattedPrice, setFormattedPrice] = useState('0');

  const [toasts, setToasts] = useState([]);

  const [editableAttributeValues, setEditableAttributeValues] = useState([]);

  const showToast = (message, type = 'success') => {
    const newToast = { id: Date.now(), message, type, show: true };
    setToasts(prevToasts => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id));
    }, 2000);
  };

  const fetchRootCategories = async () => {
    try {
      const response = await axios.get('/api/admin/categories/root');
      if (response.data && response.data.data) {
        setRootCategories(response.data.data);
      } else {
        console.warn("No root categories found or API error.");
        setRootCategories([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục gốc:', error);
      setRootCategories([]);
    }
  };

  const fetchSubcategories = async (rootCategoryId) => {
    if (!rootCategoryId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/categories/${rootCategoryId}/subcategories`);
      if (response.data && response.data.data) {
        setSubcategories(response.data.data);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục con cho rootCategoryId ${rootCategoryId}:`, error);
      setSubcategories([]);
      showToast('Không thể tải danh mục con.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAttributes = async () => {
      if (!selectedRootCategoryId) {
        setAttributesForCategory([]);
        setEditableAttributeValues([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/admin/attributes/category/${selectedRootCategoryId}`);
        if (response.data && response.data.data) {
          setAttributesForCategory(response.data.data);
          setEditableAttributeValues(response.data.data.map(attr => ({
            attributeId: attr.attributeId,
            attributeName: attr.attributeName,
            attributeUnit: attr.attributeUnit || '',
            value: ''
          })));
        } else {
          console.warn(`No attributes found for category ID ${selectedRootCategoryId}`);
          setAttributesForCategory([]);
          setEditableAttributeValues([]);
        }
      } catch (error) {
        console.error(`Lỗi khi lấy thuộc tính cho danh mục ${selectedRootCategoryId}:`, error);
        setAttributesForCategory([]);
        setEditableAttributeValues([]);
        showToast('Không thể tải thuộc tính cho danh mục.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttributes();
  }, [selectedRootCategoryId]);

  useEffect(() => {
    fetchRootCategories();

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'rootCategoryId') {
      const rootCatId = value ? Number(value) : '';
      setSelectedRootCategoryId(rootCatId);
      fetchSubcategories(rootCatId);
      setProduct(prev => ({
        ...prev,
        category: { categoryId: null }
      }));
    } else if (name === 'price') {
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
    } else if (name === "category.categoryId") {
      const newCategoryId = value ? Number(value) : '';
      setProduct(prev => ({
        ...prev,
        category: { ...prev.category, categoryId: newCategoryId }
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProduct(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? (value ? Number(value) : null) : value
        }
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked :
          (type === 'number' ? (value ? Number(value) : null) : value)
      }));
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
      id: null, url: URL.createObjectURL(file), isExisting: false, file
    }));
    setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const imageToRemove = previewImages[index];
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    if (!imageToRemove.isExisting) {
      if (imageToRemove.file) {
        setImageFiles(prevImageFiles => prevImageFiles.filter(f => f !== imageToRemove.file));
      }
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!product.category.categoryId) {
      showToast('Vui lòng chọn danh mục sản phẩm.', 'error');
      setIsLoading(false);
      return;
    }
    if (!product.brand.brandId) {
      showToast('Vui lòng chọn thương hiệu sản phẩm.', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const productData = {
        productName: product.productName,
        sku: product.sku,
        price: product.price,
        discountPrice: hasDiscount ? product.discountPrice : null,
        description: product.description,
        stockQuantity: 0,
        isEnabled: true,
        categoryId: product.category.categoryId,
        brandId: product.brand.brandId
      };

      const response = await axios.post('/api/admin/products', productData);
      const newProduct = response.data.data;
      const newProductId = newProduct.productId;

      if (!newProductId) {
        throw new Error("Không nhận được ID sản phẩm mới sau khi tạo.");
      }

      showToast('Thêm sản phẩm thành công!', 'success');

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(file => {
          formData.append('files', file);
        });
        await axios.post(`/api/admin/product-images/upload/${newProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Tải ảnh lên thành công!', 'success');
      }

      const attributesToSubmit = editableAttributeValues.filter(attr => attr.value.trim() !== '');
      if (attributesToSubmit.length > 0) {
        const attributePayload = {
          productId: newProductId,
          attributeValues: attributesToSubmit.map(attr => ({
            attributeId: attr.attributeId,
            value: attr.value,
          }))
        };
        await axios.post(`/api/admin/product-attributes/batch`, attributePayload);
        showToast('Lưu thuộc tính thành công!', 'success');
      }

      setTimeout(() => {
        history.push('/admin/products');
      }, 1500);

    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error.response?.data?.message || error.message);
      showToast(error.response?.data?.message || 'Không thể thêm sản phẩm. Vui lòng thử lại.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
    return imageUrl;
  };

  if (isLoading && !selectedRootCategoryId) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Đang tải dữ liệu...</p>
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
            <h1>Thêm sản phẩm mới</h1>
          </div>
          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading}>
              <i className="fas fa-save"></i> {isLoading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => history.push('/admin/products')}
              disabled={isLoading}
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
                  <label htmlFor="rootCategoryId">Loại sản phẩm</label>
                  <div className="select-wrapper">
                    <select
                      id="rootCategoryId"
                      name="rootCategoryId"
                      value={selectedRootCategoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn loại sản phẩm</option>
                      {rootCategories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
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
                      disabled={!selectedRootCategoryId || subcategories.length === 0}
                    >
                      <option value="">Chọn danh mục</option>
                      {subcategories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
          </div>

          <div className="sidebar-add-product">
            <div className="card image-card">
              <h2 className="card-title">Hình ảnh</h2>
              <div className="image-gallery">
                {previewImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <img
                      src={image.url}
                      alt={`Xem trước ${index + 1}`}
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

            {selectedRootCategoryId && (
              <div className="card attributes-card">
                <h2 className="card-title">Thuộc tính sản phẩm ({rootCategories.find(c => c.categoryId === selectedRootCategoryId)?.categoryName})</h2>
                {isLoading && selectedRootCategoryId ? (
                  <div className="admin-loading"><div className="admin-spinner-small"></div><p>Đang tải thuộc tính...</p></div>
                ) : editableAttributeValues.length > 0 ? (
                  <table className="attributes-table">
                    <tbody>
                      {editableAttributeValues.map((attribute, index) => (
                        <tr key={attribute.attributeId || `attr-${index}`}>
                          <td>{attribute.attributeName}</td>
                          <td>
                            <div className="attribute-input-group">
                              <input
                                type="text"
                                className="admin-form-control admin-form-control-sm"
                                value={attribute.value || ''}
                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                                placeholder={`Nhập ${attribute.attributeName}`}
                              />
                            </div>
                          </td>
                          <td>{attribute.attributeUnit && <span className="attribute-unit">{attribute.attributeUnit}</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-attributes">Danh mục này không có thuộc tính nào hoặc không thể tải thuộc tính.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAddPage;
