import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductSlider = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}/related`);
      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm liên quan:', error);
      setError('Không thể tải sản phẩm liên quan');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo đường dẫn ảnh đầy đủ (copy từ product-page.js)
  const getImageUrl = (imageUrl) => {
    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    // Nếu không có ảnh, trả về ảnh mặc định
    if (!imageUrl) {
      return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
    }

    // Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / để tránh lặp
    const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

    return `${baseUrl}/${imagePath}`;
  };

  // Lấy tối đa 5 thuộc tính quan trọng để hiển thị (copy từ product-page.js)
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
  };

  if (loading) {
    return (
      <section className="product-slider-area pd-bottom-40">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title">
                <h3>Sản phẩm liên quan</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <p>Đang tải sản phẩm liên quan...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="product-slider-area pd-bottom-40">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title">
                <h3>Sản phẩm liên quan</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <p>{error || 'Không có sản phẩm liên quan'}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-slider-area pd-bottom-40">
      <div className="container">
        <div className="row mb-3">
          <div className="col-lg-6">
            <div className="section-title">
              <h4>Sản phẩm liên quan</h4>
            </div>
          </div>
        </div>
        <div className="row">
          {products.map(product => {
            // Lấy tối đa 5 thuộc tính quan trọng
            const topAttributes = getTopAttributes(product.attributeValues);
            // Lấy ảnh đầu tiên hoặc ảnh mặc định
            const firstImage = product.images && product.images.length > 0 ? product.images[0].imageUrl : null;

            return (
              <div className="col-lg-3 col-md-6 col-sm-6 mb-4" key={product.productId}>
                <div className="all-isotope-item">
                  <div className="thumb">
                    <Link to={`/product-details/${product.productId}`}>
                      <img src={getImageUrl(firstImage)} alt={product.productName} />
                      <div className="specs-overlay">
                        {topAttributes.map((attr, index) => (
                          <p key={index}>
                            {attr.attributeName}: {attr.value} {attr.attributeUnit}
                          </p>
                        ))}
                      </div>
                    </Link>
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
                    <h6><Link to={`/product-details/${product.productId}`}>{product.productName}</Link></h6>
                    <p className="short-desc">{product.brand.brandName} - {product.category.categoryName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;