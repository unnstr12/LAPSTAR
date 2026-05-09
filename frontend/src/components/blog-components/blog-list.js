import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import './blog-list.css';

class BlogList extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/';

		return (

			<section className="blog-page-area pd-top-100 pd-bottom-100">

				<div className="container">

					<div className="row">

						<div className="col-lg-8 go-top">

							{/* Blog 1 */}
							<div className="single-blog-inner">

								<div className="thumb">
									<img
										src={publicUrl + "assets/img/blog/1b.png"}
										alt="blog"
									/>

									<a
										className="video-play-btn"
										href="https://www.youtube.com/watch?v=pnBLTAlpxBU"
										data-effect="mfp-zoom-in"
									>
										<i className="fa fa-play" />
									</a>
								</div>

								<div className="single-blog-details">

									<div className="meta">

                                        <span className="author">
                                            <i className="far fa-user" />
                                            Nguyễn Hải Sơn
                                        </span>

										<span className="date">
                                            <i className="far fa-calendar-alt" />
                                            08 Th05 2026
                                        </span>

										<span className="comments">
                                            <i className="far fa-comments" />
                                            Bình luận (05)
                                        </span>

									</div>

									<h3>
										<Link to="/blog-details">
											Cách Chọn Laptop Phù Hợp Với Nhu Cầu
										</Link>
									</h3>

									<p>
										Hướng dẫn xác định mục đích sử dụng và các tiêu chí
										quan trọng như CPU, RAM, SSD, màn hình, pin và
										trọng lượng để chọn máy phù hợp, tránh lãng phí chi phí.
									</p>

									<Link
										className="btn btn-base"
										to="/blog-details"
									>
										Xem thêm
									</Link>

								</div>
							</div>

							{/* Blog 2 */}
							<div className="single-blog-inner">

								<div className="thumb">
									<img
										src={publicUrl + "assets/img/blog/2b.png"}
										alt="blog"
									/>

									<a
										className="video-play-btn"
										href="https://www.youtube.com/watch?v=kjkFp15GLJg"
										data-effect="mfp-zoom-in"
									>
										<i className="fa fa-play" />
									</a>
								</div>

								<div className="single-blog-details">

									<div className="meta">

                                        <span className="author">
                                            <i className="far fa-user" />
                                            Trần Minh Quân
                                        </span>

										<span className="date">
                                            <i className="far fa-calendar-alt" />
                                            05 Th05 2026
                                        </span>

										<span className="comments">
                                            <i className="far fa-comments" />
                                            Bình luận (03)
                                        </span>

									</div>

									<h3>
										<Link to="/blog-details">
											Nên Mua Hãng Nào? So Sánh Dell, ASUS, Lenovo, HP
										</Link>
									</h3>

									<p>
										Tổng hợp ưu nhược điểm theo từng hãng và phân khúc:
										bền bỉ, mỏng nhẹ, gaming và hiệu năng/giá,
										giúp bạn chọn đúng thương hiệu phù hợp.
									</p>

									<Link
										className="btn btn-base"
										to="/blog-details"
									>
										Xem thêm
									</Link>

								</div>
							</div>

							{/* Blog 3 */}
							<div
								className="single-blog-inner single-blog-inner-2"
								style={{
									background:
										'url(' + publicUrl + 'assets/img/blog/bg.png)'
								}}
							>

								<div className="single-blog-details">

									<div className="meta">

                                        <span className="author">
                                            <i className="far fa-user" />
                                            Lê Anh Thư
                                        </span>

										<span className="date">
                                            <i className="far fa-calendar-alt" />
                                            02 Th05 2026
                                        </span>

										<span className="comments">
                                            <i className="far fa-comments" />
                                            Bình luận (02)
                                        </span>

									</div>

									<h3>
										<Link to="/blog-details">
											RAM Bao Nhiêu Là Đủ? 8GB, 16GB Hay 32GB
										</Link>
									</h3>

								</div>
							</div>

							{/* Blog 4 */}
							<div className="single-blog-inner">

								<div className="thumb">
									<img
										src={publicUrl + "assets/img/blog/3b.png"}
										alt="blog"
									/>

									<a
										className="video-play-btn"
										href="https://www.youtube.com/embed/Wimkqo8gDZ0"
										data-effect="mfp-zoom-in"
									>
										<i className="fa fa-play" />
									</a>
								</div>

								<div className="single-blog-details">

									<div className="meta">

                                        <span className="author">
                                            <i className="far fa-user" />
                                            Phạm Đức Anh
                                        </span>

										<span className="date">
                                            <i className="far fa-calendar-alt" />
                                            30 Th04 2026
                                        </span>

										<span className="comments">
                                            <i className="far fa-comments" />
                                            Bình luận (04)
                                        </span>

									</div>

									<h3>
										<Link to="/blog-details">
											Dung Lượng SSD Hợp Lý Cho Học Tập, Làm Việc, Gaming
										</Link>
									</h3>

									<p>
										Gợi ý dung lượng lưu trữ theo nhu cầu:
										256GB cho cơ bản, 512GB cho đa nhiệm,
										1TB cho đồ họa và game nặng,
										kèm mẹo mở rộng về sau.
									</p>

									<Link
										className="btn btn-base"
										to="/blog-details"
									>
										Xem thêm
									</Link>

								</div>
							</div>

							{/* Blog 5 */}
							<div className="single-blog-inner single-blog-inner-3">

								<div className="single-blog-details">

									<div className="meta">

                                        <span className="author">
                                            <i className="far fa-user" />
                                            Đỗ Khánh Linh
                                        </span>

										<span className="date">
                                            <i className="far fa-calendar-alt" />
                                            28 Th04 2026
                                        </span>

										<span className="comments">
                                            <i className="far fa-comments" />
                                            Bình luận (01)
                                        </span>

									</div>

									<h3>
										<Link to="/blog-details">
											Checklist Mua Laptop: Màn Hình, Pin, Cổng Kết Nối
										</Link>
									</h3>

									<p>
										Danh sách kiểm tra nhanh trước khi mua:
										kích thước, độ phân giải, tần số quét,
										thời lượng pin, cổng USB-C/HDMI
										và chất lượng bàn phím.
									</p>

									<Link
										className="btn btn-base"
										to="/blog-details"
									>
										Xem thêm
									</Link>

								</div>
							</div>

							{/* Pagination */}
							<ul className="pagination pagination-2" >

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

						<Sidebar />

					</div>
				</div>

			</section>
		)
	}
}

export default BlogList;