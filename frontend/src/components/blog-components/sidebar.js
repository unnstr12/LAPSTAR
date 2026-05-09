import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

class Sidebar extends Component {

  render() {

    let publicUrl = process.env.PUBLIC_URL + '/';

    return (

        <div className="col-lg-4 go-top">

          <div className="sidebar-area">

            {/* Search */}
            <div className="widget widget-search widget-border">

              <h5 className="widget-title">
                Tìm Kiếm
              </h5>

              <div className="modern-search-box">

                <i className="la la-search search-icon" />

                <input
                    type="text"
                    placeholder="Tìm laptop, bài viết..."
                />

                <button>
                  Tìm
                </button>

              </div>

            </div>


            {/* Category */}
            <div className="widget widget-category widget-border">

              <h5 className="widget-title">
                Danh Mục
              </h5>

              <ul>

                <li>
                  <Link to="/product">
                    Laptop Văn Phòng
                    <i className="la la-angle-right" />
                  </Link>
                </li>

                <li>
                  <Link to="/product">
                    Laptop Gaming
                    <i className="la la-angle-right" />
                  </Link>
                </li>

                <li>
                  <Link to="/product">
                    Laptop Đồ Họa
                    <i className="la la-angle-right" />
                  </Link>
                </li>

                <li>
                  <Link to="/product">
                    Phụ Kiện Công Nghệ
                    <i className="la la-angle-right" />
                  </Link>
                </li>

                <li>
                  <Link to="/blog">
                    Kinh Nghiệm Mua Laptop
                    <i className="la la-angle-right" />
                  </Link>
                </li>

              </ul>
            </div>


            {/* Recent News */}
            <div className="widget widget-news widget-border">

              <h5 className="widget-title">
                Bài Viết Mới
              </h5>


              <div className="single-news-wrap media">

                <div className="thumb">
                  <img
                      src={publicUrl + "assets/img/widget/1.png"}
                      alt="img"
                  />
                </div>

                <div className="media-body">

                  <p className="date">
                    <i className="far fa-calendar-alt" />
                    08 Th05 2026
                  </p>

                  <h6>
                    <Link to="/blog-details">
                      Cách Chọn Laptop Phù Hợp
                    </Link>
                  </h6>

                </div>
              </div>


              <div className="single-news-wrap media">

                <div className="thumb">
                  <img
                      src={publicUrl + "assets/img/widget/2.png"}
                      alt="img"
                  />
                </div>

                <div className="media-body">

                  <p className="date">
                    <i className="far fa-calendar-alt" />
                    05 Th05 2026
                  </p>

                  <h6>
                    <Link to="/blog-details">
                      So Sánh Dell, ASUS Và Lenovo
                    </Link>
                  </h6>

                </div>
              </div>


              <div className="single-news-wrap media">

                <div className="thumb">
                  <img
                      src={publicUrl + "assets/img/widget/3.png"}
                      alt="img"
                  />
                </div>

                <div className="media-body">

                  <p className="date">
                    <i className="far fa-calendar-alt" />
                    02 Th05 2026
                  </p>

                  <h6>
                    <Link to="/blog-details">
                      RAM Bao Nhiêu Là Đủ?
                    </Link>
                  </h6>

                </div>
              </div>

            </div>


            {/* Tags */}
            <div className="widget widget-tags widget-border">

              <h5 className="widget-title">
                Từ Khóa Phổ Biến
              </h5>

              <div className="tagcloud">

                <Link to="/blog">Laptop</Link>

                <Link to="/blog">Gaming</Link>

                <Link to="/blog">SSD</Link>

                <Link to="/blog">RAM</Link>

                <Link to="/blog">ASUS</Link>

                <Link to="/blog">Dell</Link>

                <Link to="/blog">Lenovo</Link>

                <Link to="/blog">Công Nghệ</Link>

              </div>

            </div>


            {/* Author */}
            <div className="widget widget-author widget-border text-center">

              <div className="thumb">

                <img
                    src={publicUrl + "assets/img/widget/4.png"}
                    alt="img"
                />

              </div>

              <div className="author-details">

                <h4>
                  Nguyễn Hải Sơn
                </h4>

                <span>
                                Blogger Công Nghệ
                            </span>

                <p>
                  Chia sẻ kiến thức về laptop,
                  công nghệ và kinh nghiệm chọn mua
                  thiết bị phù hợp với học tập,
                  làm việc và giải trí.
                </p>


                <ul className="social-area">

                  <li>
                    <a href="#">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <i className="fa fa-youtube" />
                    </a>
                  </li>

                </ul>

              </div>

            </div>


            {/* Contact */}
            <div className="widget widget-consultation">

              <div className="thumb">

                <img
                    src={publicUrl + "assets/img/widget/5.png"}
                    alt="img"
                />

              </div>

              <div className="consultation-wrap text-center">

                <h2>
                  Cần Tư Vấn Laptop?
                </h2>

                <a
                    className="btn btn-base"
                    href="/contact"
                >
                  Liên Hệ Ngay
                </a>

              </div>

            </div>

          </div>

        </div>

    )
  }
}

export default Sidebar;