import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ProductCategory extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/';

		return (

			<section className="blog-page-area pd-top-100 pd-bottom-100">

				<div className="container">

					<div className="row">

						{/* Product Area */}
						<div className="col-lg-8 order-lg-last go-top">

							<div className="all-item-section all-item-area-2">

								<div className="row">

									{/* Product 1 */}
									<div className="all-isotope-item col-lg-6 col-sm-6">

										<div className="thumb">

											<Link to="/product-details">
												<img
													src={publicUrl + "assets/img/item/7.png"}
													alt="laptop"
												/>
											</Link>

											<Link
												className="btn btn-white"
												to="/product-details"
											>
												Xem chi tiết
											</Link>

										</div>

										<div className="item-details">

											<h4>
												<Link to="/product-details">
													ASUS ROG Strix G16
												</Link>
											</h4>

											<p>
												Laptop gaming hiệu năng cao dành cho game thủ
											</p>

											<span className="ratting">

                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star-half-alt" />

                                                <span>(25)</span>

                                            </span>

											<Link
												to="/product-details"
												className="author-details align-item-center"
											>

												<img
													src={publicUrl + "assets/img/author/1.png"}
													alt="brand"
												/>

												<span>ASUS</span>

											</Link>

											<span className="price bg-white float-right">
                                                32.990.000đ
                                            </span>

										</div>
									</div>

									{/* Product 2 */}
									<div className="all-isotope-item col-lg-6 col-sm-6">

										<div className="thumb">

											<Link to="/product-details">
												<img
													src={publicUrl + "assets/img/item/8.png"}
													alt="laptop"
												/>
											</Link>

											<Link
												className="btn btn-white"
												to="/product-details"
											>
												Xem chi tiết
											</Link>

										</div>

										<div className="item-details">

											<h4>
												<Link to="/product-details">
													Dell XPS 15
												</Link>
											</h4>

											<p>
												Laptop cao cấp cho công việc và đồ họa
											</p>

											<span className="ratting">

                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />

                                                <span>(18)</span>

                                            </span>

											<Link
												to="/product-details"
												className="author-details align-item-center"
											>

												<img
													src={publicUrl + "assets/img/author/2.png"}
													alt="brand"
												/>

												<span>Dell</span>

											</Link>

											<span className="price bg-white float-right">
                                                41.500.000đ
                                            </span>

										</div>
									</div>

									{/* Product 3 */}
									<div className="all-isotope-item col-lg-6 col-sm-6">

										<div className="thumb">

											<Link to="/product-details">
												<img
													src={publicUrl + "assets/img/item/9.png"}
													alt="laptop"
												/>
											</Link>

											<Link
												className="btn btn-white"
												to="/product-details"
											>
												Xem chi tiết
											</Link>

										</div>

										<div className="item-details">

											<h4>
												<Link to="/product-details">
													Lenovo Legion 5
												</Link>
											</h4>

											<p>
												Laptop gaming mạnh mẽ với tản nhiệt tốt
											</p>

											<span className="ratting">

                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star-half-alt" />

                                                <span>(30)</span>

                                            </span>

											<Link
												to="/product-details"
												className="author-details align-item-center"
											>

												<img
													src={publicUrl + "assets/img/author/3.png"}
													alt="brand"
												/>

												<span>Lenovo</span>

											</Link>

											<span className="price bg-white float-right">
                                                28.900.000đ
                                            </span>

										</div>
									</div>

									{/* Product 4 */}
									<div className="all-isotope-item col-lg-6 col-sm-6">

										<div className="thumb">

											<Link to="/product-details">
												<img
													src={publicUrl + "assets/img/item/10.png"}
													alt="laptop"
												/>
											</Link>

											<Link
												className="btn btn-white"
												to="/product-details"
											>
												Xem chi tiết
											</Link>

										</div>

										<div className="item-details">

											<h4>
												<Link to="/product-details">
													HP Pavilion 15
												</Link>
											</h4>

											<p>
												Laptop văn phòng phù hợp học tập và làm việc
											</p>

											<span className="ratting">

                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star-o" />

                                                <span>(15)</span>

                                            </span>

											<Link
												to="/product-details"
												className="author-details align-item-center"
											>

												<img
													src={publicUrl + "assets/img/author/4.png"}
													alt="brand"
												/>

												<span>HP</span>

											</Link>

											<span className="price bg-white float-right">
                                                19.990.000đ
                                            </span>

										</div>
									</div>

								</div>

							</div>

							{/* Pagination */}
							<div className="pagination-wrap text-center mt-2">

								<ul className="pagination pagination-2">

									<li className="page-item">
										<a className="page-link" href="#">
											<i className="la la-angle-left" />
										</a>
									</li>

									<li className="page-item active">
										<a className="page-link" href="#">
											01
										</a>
									</li>

									<li className="page-item">
										<a className="page-link" href="#">
											02
										</a>
									</li>

									<li className="page-item">
										<a className="page-link" href="#">
											03
										</a>
									</li>

									<li className="page-item">
										<a className="page-link" href="#">
											<i className="la la-angle-right" />
										</a>
									</li>

								</ul>

							</div>

						</div>

						{/* Sidebar */}
						<div className="col-lg-4 order-lg-first go-top">

							<div className="sidebar-area">

								{/* Category */}
								<div className="widget widget-category widget-border">

									<h5 className="widget-title">
										Danh mục sản phẩm
									</h5>

									<ul>

										<li>
											<Link to="/product">
												Laptop Gaming
												<i className="la la-angle-right" />
											</Link>
										</li>

										<li>
											<Link to="/product">
												Laptop Văn Phòng
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
												Laptop Sinh Viên
												<i className="la la-angle-right" />
											</Link>
										</li>

										<li>
											<Link to="/product">
												Phụ Kiện Laptop
												<i className="la la-angle-right" />
											</Link>
										</li>

									</ul>

								</div>

								{/* Filter */}
								<div className="widget widget-product-sorting widget-border">

									<h5 className="widget-title">
										Lọc theo giá
									</h5>

									<div className="slider-product-sorting" />

									<div className="product-range-detail">

										<button>
											Lọc
										</button>

										<input
											className="float-right"
											type="text"
											id="amount"
											readOnly
										/>

										<label
											className="float-right"
											htmlFor="amount"
										>
											Giá:
										</label>

									</div>

								</div>

							</div>

						</div>

					</div>

				</div>

			</section>
		)
	}
}

export default ProductCategory;