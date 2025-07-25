import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer_v1 extends Component {

	componentDidMount() {
		let publicUrl = process.env.PUBLIC_URL + '/'
		const minscript = document.createElement("script");
		minscript.async = true;
		minscript.src = publicUrl + "assets/js/main.js";

		document.body.appendChild(minscript);
	}

	render() {

		let publicUrl = process.env.PUBLIC_URL + '/'
		let imgattr = "Footer logo"

		return (
			<footer className="footer-area pd-top-100">
				<div className="container">
					<div className="row">
						<div className="col-lg-4 col-md-6">
							<div className="footer-widget widget widget_contact">
								<h4 className="widget-title">Liên hệ với chúng tôi</h4>
								<div className="media">
									<div className="thumb">
										<img src={publicUrl + "assets/img/footer/1.png"} alt="img" />
									</div>
									<div className="media-body">
										<p>Số 298 Đ. Cầu Diễn</p>
										<p>Minh Khai, Bắc Từ Liêm, Hà Nội</p>
									</div>
								</div>
								<div className="media">
									<div className="thumb mt-0">
										<img src={publicUrl + "assets/img/footer/2.png"} alt="img" />
									</div>
									<div className="media-body">
										<p className="m-0">nguyenhaison12092004@gmail.com</p>
									</div>
								</div>
								<div className="media">
									<div className="thumb mt-0">
										<img src={publicUrl + "assets/img/footer/3.png"} alt="img" />
									</div>
									<div className="media-body">
										<p className="m-0">0916557837</p>
									</div>
								</div>
								<ul className="social-area">
									<li><a href="https://www.facebook.com/unnstr12"><i className="fab fa-facebook-f" /></a></li>
									<li><a href="https://www.youtube.com/@istarhaui"><i className="fab fa-youtube" /></a></li>
									<li><a href="tel:0396006368"><i className="fas fa-phone" /></a></li>
									<li><a href="mailto:anhuypc147@gmail.com"><i className="fas fa-envelope" /></a></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-2 col-md-6">
							<div className="footer-widget widget widget_nav_menu">
								<h4 className="widget-title">Liên kết hữu ích</h4>
								<ul className="go-top">
									<li><Link to="/cart">Giỏ hàng</Link></li>
									<li><Link to="/sign-in">Đăng nhập</Link></li>
									<li><Link to="/sign-up">Đăng ký</Link></li>
									<li><Link to="/contact">Liên hệ</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-2 col-md-6">
							<div className="footer-widget widget widget widget_products">
								<h4 className="widget-title">Sản phẩm</h4>
								<ul className="go-top">
									<li><Link to="/laptop">Laptop</Link></li>
									<li><Link to="/tai-nghe">Bàn phím</Link></li>
									<li><Link to="/ban-phim">Tai nghe</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 offset-lg-1 col-md-6">
							<div className="footer-widget widget widget_news">
								<h4 className="widget-title">Tin tức mới nhất</h4>
								<div className="widget-news-wrap">
									<div className="date">15/12/2024</div>
									<p> <Link to="/blog-details">Top 5 laptop gaming tốt nhất 2024</Link> </p>
								</div>
								<div className="widget-news-wrap">
									<div className="date">12/12/2024</div>
									<p> <Link to="/blog-details">Hướng dẫn chọn laptop phù hợp</Link> </p>
								</div>
								<div className="widget-news-wrap">
									<div className="date">10/12/2024</div>
									<p> <Link to="/blog-details">Khuyến mãi cuối năm</Link> </p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*Footer bottom*/}
				<div className="container">
					<div className="copyright-area">
						<div className="row">
							<div className="col-lg-6 align-self-center">
								<p>©2025 LaptopVN. Bản quyền thuộc về Nhóm 11. </p>
							</div>
							<div className="col-lg-6 text-lg-right">
								<ul>
									<li>
										<Link to="/">Trang chủ</Link>
									</li>
									<li>
										<Link to="/laptop">Sản phẩm</Link>
									</li>
									<li>
										<Link to="/blog">Tin tức</Link>
									</li>
									<li>
										<Link to="/contact">Liên hệ</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</footer>


		)
	}
}


export default Footer_v1