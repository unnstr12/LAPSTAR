import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';

class BlogDetails extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/';

		return (

			<section className="blog-page-area pd-top-100 pd-bottom-100">

				<div className="container">

					<div className="row">

						<div className="col-lg-8">

							<div className="blog-details-page-inner">

								<div className="single-blog-inner m-0">

									{/* Thumbnail */}
									<div className="thumb">
										<img
											src={publicUrl + "assets/img/blog/4b.png"}
											alt="blog"
										/>
									</div>

									{/* Blog Details */}
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
											Cách Chọn Laptop Phù Hợp Với Nhu Cầu
										</h3>

										<p>
											Việc lựa chọn laptop phù hợp giúp người dùng tối ưu hiệu quả
											học tập, làm việc và giải trí. Trước khi mua laptop,
											người dùng cần xác định rõ nhu cầu sử dụng để lựa chọn
											cấu hình phù hợp và tránh lãng phí chi phí.
										</p>

										<p>
											Đối với sinh viên và nhân viên văn phòng,
											các dòng laptop sử dụng Intel Core i5 hoặc AMD Ryzen 5,
											RAM từ 8GB và SSD 256GB đã đáp ứng tốt nhu cầu sử dụng cơ bản.
											Trong khi đó, người dùng chuyên về thiết kế đồ họa,
											lập trình hoặc chơi game nên ưu tiên cấu hình mạnh hơn.
										</p>

										<blockquote
											className="blockquote"
											style={{
												background:
													'url(' + publicUrl + 'assets/img/blog/bg.png)'
											}}
										>
											<p>
												“Một chiếc laptop phù hợp không chỉ mạnh về cấu hình
												mà còn phải đáp ứng đúng nhu cầu sử dụng thực tế.”
											</p>

											<footer className="blockquote-footer">
												Nguyễn Hải Sơn
											</footer>
										</blockquote>

									</div>

									{/* Content */}
									<h4>
										<i className="far fa-check-circle" />
										Những Tiêu Chí Quan Trọng Khi Chọn Laptop
									</h4>

									<p>
										Người dùng nên quan tâm đến các yếu tố như CPU,
										RAM, ổ cứng SSD, card đồ họa, màn hình,
										thời lượng pin và trọng lượng thiết bị.
										Ngoài ra, nên ưu tiên các dòng laptop có khả năng nâng cấp RAM
										và SSD để sử dụng lâu dài hơn.
									</p>

									<p>
										Đối với laptop gaming hoặc đồ họa,
										card đồ họa rời và hệ thống tản nhiệt là yếu tố rất quan trọng.
										Trong khi đó, laptop văn phòng cần ưu tiên thiết kế mỏng nhẹ,
										pin lâu và bàn phím thoải mái.
									</p>

									{/* Tags & Share */}
									<div className="meta">

										<div className="tags">

											<span>Tags:</span>

											<a href="#">Laptop,</a>

											<a href="#">Công nghệ,</a>

											<a href="#">Gaming</a>

										</div>

										<div className="blog-share">

											<span>Chia sẻ:</span>

											<ul className="social-area social-area-2">

												<li>
													<a href="#">
														<i className="fab fa-facebook-f" />
													</a>
												</li>

												<li>
													<a href="#">
														<i className="fab fa-twitter" />
													</a>
												</li>

												<li>
													<a href="#">
														<i className="fab fa-instagram" />
													</a>
												</li>

												<li>
													<a href="#">
														<i className="fab fa-youtube" />
													</a>
												</li>

											</ul>

										</div>

									</div>

									{/* Author */}
									<div className="author-area">

										<div className="media">

											<img
												src={publicUrl + "assets/img/author/blog-author.png"}
												alt="author"
											/>

											<div className="media-body align-self-center">

												<h4>Nguyễn Hải Sơn</h4>

												<p>
													Chuyên chia sẻ kiến thức công nghệ,
													tư vấn lựa chọn laptop và cập nhật xu hướng
													thiết bị điện tử mới nhất dành cho học tập,
													làm việc và giải trí.
												</p>

												<ul className="social-area social-area-2">

													<li>
														<a href="#">
															<i className="fab fa-facebook-f" />
														</a>
													</li>

													<li>
														<a href="#">
															<i className="fab fa-twitter" />
														</a>
													</li>

													<li>
														<a href="#">
															<i className="fab fa-instagram" />
														</a>
													</li>

													<li>
														<a href="#">
															<i className="fab fa-youtube" />
														</a>
													</li>

												</ul>

											</div>
										</div>
									</div>

									{/* Related Post */}
									<div className="related-post">

										<div className="section-title">
											<h3>Bài Viết Liên Quan</h3>
										</div>

										<div className="row justify-content-center">

											<div className="col-md-6">

												<div className="recent-post-wrap">

													<img
														src={publicUrl + "assets/img/blog/5.png"}
														alt="blog"
													/>

													<div className="post-details">

														<div className="meta">

                                                            <span>
                                                                <i className="far fa-calendar-alt" />
                                                                05 Th05 2026
                                                            </span>

														</div>

														<h5>
															<Link to="/blog-details">
																RAM Bao Nhiêu Là Đủ Cho Laptop?
															</Link>
														</h5>

														<Link to="/blog-details">
															Xem thêm
															<i className="la la-arrow-right" />
														</Link>

													</div>
												</div>
											</div>

											<div className="col-md-6">

												<div className="recent-post-wrap">

													<img
														src={publicUrl + "assets/img/blog/6.png"}
														alt="blog"
													/>

													<div className="post-details">

														<div className="meta">

                                                            <span>
                                                                <i className="far fa-calendar-alt" />
                                                                02 Th05 2026
                                                            </span>

														</div>

														<h5>
															<Link to="/blog-details">
																So Sánh Laptop Dell, ASUS Và Lenovo
															</Link>
														</h5>

														<Link to="/blog-details">
															Xem thêm
															<i className="la la-arrow-right" />
														</Link>

													</div>
												</div>
											</div>

										</div>
									</div>

									{/* Comments */}
									<div className="blog-comment">

										<div className="section-title">
											<h3>Bình Luận</h3>
										</div>

										<div className="media">

											<a href="#">
												<img
													src={publicUrl + "assets/img/author/7.png"}
													alt="comment"
												/>
											</a>

											<div className="media-body">

												<h5>
													<a href="#">Trần Minh Quân</a>
												</h5>

												<span className="date">
                                                    06 Th05 2026
                                                </span>

												<p>
													Bài viết rất hữu ích,
													giúp mình hiểu rõ hơn về cách chọn laptop phù hợp.
												</p>

												<a href="#">
													Trả lời
													<i className="la la-arrow-right" />
												</a>

											</div>
										</div>

									</div>

									{/* Comment Form */}
									<div className="comment-form">

										<div className="section-title">
											<h3>Để Lại Bình Luận</h3>
										</div>

										<form className="contact-form-wrap">

											<div className="row">

												<div className="col-lg-6">

													<div className="single-input-wrap input-group">

														<input
															type="text"
															className="form-control"
															placeholder="Họ và tên"
														/>

														<div className="input-group-prepend">

															<div className="input-group-text">
																<i className="far fa-user" />
															</div>

														</div>

													</div>
												</div>

												<div className="col-lg-6">

													<div className="single-input-wrap input-group">

														<input
															type="email"
															className="form-control"
															placeholder="Email"
														/>

														<div className="input-group-prepend">

															<div className="input-group-text">
																<i className="far fa-envelope" />
															</div>

														</div>

													</div>
												</div>

												<div className="col-12">

													<div className="single-input-wrap input-group">

                                                        <textarea
															className="form-control"
															rows={4}
															placeholder="Nhập nội dung bình luận"
														/>

														<div className="input-group-prepend">

															<div className="input-group-text">
																<i className="fas fa-pencil-alt" />
															</div>

														</div>

													</div>

													<div className="submit-area">

														<button
															type="submit"
															className="btn btn-base"
														>
															Gửi Bình Luận
														</button>

													</div>

												</div>

											</div>

										</form>

									</div>

								</div>
							</div>
						</div>

						<Sidebar />

					</div>
				</div>

			</section>
		)
	}
}

export default BlogDetails;