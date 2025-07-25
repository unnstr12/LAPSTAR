import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import '../../client/homepage/css/product.css';
import '../../utils/axiosConfig'; // Import cấu hình axios

class ProductV1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestProducts: []
    };
  }

  componentDidMount() {
    // Sử dụng endpoint getLatestProducts từ ProductController
    axios.get('/api/products/latest')
      .then(response => {
        console.log('Latest products response:', response.data);
        // Kiểm tra cấu trúc response đúng và có dữ liệu
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.setState({ latestProducts: response.data.data });
        } else {
          console.error('Dữ liệu sản phẩm không đúng định dạng:', response.data);
          this.setState({ latestProducts: [] });
        }
      })
      .catch(error => {
        console.error('Lỗi khi load sản phẩm mới nhất:', error);
        this.setState({ latestProducts: [] });
      });
  }

  // Hàm tạo đường dẫn ảnh đầy đủ
  getImageUrl = (imageUrl) => {
    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    // Nếu không có ảnh, trả về ảnh mặc định
    if (!imageUrl) {
      return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
    }
    
    // Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / để tránh lặp
    const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    return `${baseUrl}/${imagePath}`;
  }

  // Lấy tối đa 5 thuộc tính quan trọng để hiển thị
  getTopAttributes = (attributeValues) => {
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

  render() {
    const { latestProducts } = this.state;
    let publicUrl = process.env.PUBLIC_URL + '/';

    // Cấu hình cho Slider
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1399,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ],
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };

    return (
      <section className="all-item-area pd-bottom-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h3>Sản phẩm mới</h3>
              </div>
            </div>
          </div>

          <div className="all-item-section">
            <Slider {...settings}>
              {latestProducts.map(product => {
                // Lấy tối đa 5 thuộc tính quan trọng
                const topAttributes = this.getTopAttributes(product.attributeValues);
                // Lấy ảnh đầu tiên hoặc ảnh mặc định
                const firstImage = product.images && product.images.length > 0 ? product.images[0].imageUrl : null;
                
                return (
                  <div className="all-isotope-item product-slide-item" key={product.productId}>
                    <div className="thumb">
                      <a href={`/product-details/${product.productId}`}>
                        <img src={this.getImageUrl(firstImage)} alt={product.productName} />
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
                );
              })}
            </Slider>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <a className="btn btn-base" href="/laptop">Xem tất cả sản phẩm</a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

// Component Arrow tùy chỉnh
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " custom-next-arrow"}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <i className="fa fa-angle-right"></i>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className + " custom-prev-arrow"}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <i className="fa fa-angle-left"></i>
    </div>
  );
}

export default ProductV1;