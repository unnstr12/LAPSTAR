import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class ContactInfo extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL+'/'

	return <section className="contact-page-area pd-top-100 pd-bottom-70 mt-5">
			<div className="container">
				<div className="row justify-content-center">
				<div className="col-lg-4 col-md-6">
					<div className="single-contact-wrap text-center">
					<div className="thumb">
						<img src={publicUrl+"assets/img/icon/map-marker.png"} alt="img" />
					</div>
					<h4>Địa chỉ cửa hàng</h4>
					<p>Số 298 Đ. Cầu Diễn</p>
					<p>Minh Khai, Bắc Từ Liêm, Hà Nội</p>
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="single-contact-wrap text-center">
					<div className="thumb">
						<img src={publicUrl+"assets/img/icon/phone-pad.png"} alt="img" />
					</div>
					<h4>Hotline tư vấn</h4>
					<p>Điện thoại: 0816558837</p>
					<p>Zalo: 0816558837</p>
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="single-contact-wrap text-center">
					<div className="thumb">
						<img src={publicUrl+"assets/img/icon/envelope.png"} alt="img" />
					</div>
					<h4>Email liên hệ</h4>
					<p>Email chính: son12092004@gmail.com</p>
					<p>Hỗ trợ kỹ thuật: son12092004@gmail.com</p>
					</div>
				</div>
				</div>
			</div>
			</section>

		}
}

export default ContactInfo