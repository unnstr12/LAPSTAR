import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class AboutSection extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL+'/'

	return    <section className="about-area text-center pd-top-100 pd-bottom-70">
				<div className="container">
					<div className="row justify-content-center">
					<div className="col-lg-3 col-sm-6">
						<div className="single-about-wrap">
						<div className="thumb icon-shipping">
							<i className="fa fa-truck"></i>
						</div>
						<h5><a href="#">Miễn phí vận chuyển</a></h5>
						<p>Hỏa tốc trong 2h</p>
						</div>
					</div>
					<div className="col-lg-3 col-sm-6">
						<div className="single-about-wrap">
						<div className="thumb icon-payment">
							<i className="fa fa-credit-card"></i>
						</div>
						<h5><a href="#">Thanh toán bảo mật</a></h5>
						<p>Giao dịch an toàn 100%</p>
						</div>
					</div>
					<div className="col-lg-3 col-sm-6">
						<div className="single-about-wrap">
						<div className="thumb icon-return">
							<i className="fa fa-refresh"></i>
						</div>
						<h5><a href="#">Đổi trả miễn phí</a></h5>
						<p>7 ngày đổi trả sản phẩm lỗi</p>
						</div>
					</div>
					<div className="col-lg-3 col-sm-6">
						<div className="single-about-wrap">
						<div className="thumb icon-support">
							<i className="fa fa-headphones"></i>
						</div>
						<h5><a href="#">Hỗ trợ 24/7</a></h5>
						<p>Tư vấn nhiệt tình</p>
						</div>
					</div>
					</div>
				</div>      
				</section>


		}
}

export default AboutSection