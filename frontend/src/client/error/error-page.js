import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class Error extends Component {

	render() {

		let publicUrl = process.env.PUBLIC_URL+'/'

	return  <section className="error-page-area pd-top-100 pd-bottom-100">
			<div className="container">
				<div className="row justify-content-center">
				<div className="col-lg-8 col-md-10">
					<div className="error-inner text-center">
					<img src={publicUrl+"assets/img/404.png"} alt="Trang không tìm thấy" />
					<h2>Oops! Trang không tồn tại</h2>
					<p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. <br /> 
						Hãy kiểm tra lại đường link hoặc <span>liên hệ với chúng tôi</span> nếu bạn cần hỗ trợ.</p>
					
					<div className="error-actions mt-4">
						<Link className="admin-btn admin-btn-primary mr-3" to="/">
						<i className="fa fa-home mr-2"></i>Về trang chủ
						</Link>
						<Link className="admin-btn admin-btn-secondary mr-3" to="/product">
						<i className="fa fa-laptop mr-2"></i>Xem laptop
						</Link>
						<Link className="admin-btn admin-btn-secondary" to="/contact">
						<i className="fa fa-phone mr-2"></i>Liên hệ
						</Link>
					</div>
					
					<div className="error-support mt-4">
						<p className="mb-2">Cần hỗ trợ? Liên hệ ngay:</p>
						<p className="mb-0">
						<i className="fa fa-phone mr-2" style={{color: 'var(--main-color)'}}></i>
						<strong>Hotline: 0816557837</strong> |
						<i className="fa fa-envelope ml-2 mr-2" style={{color: 'var(--main-color)'}}></i>
						<strong>haison12092004@gmail.com</strong>
						</p>
					</div>
					</div>
				</div>
				</div>
			</div>
			
			<style jsx>{`
				.error-actions .btn {
				margin-bottom: 10px;
				}
				
				.category-link {
				text-decoration: none;
				color: inherit;
				}
				
				.category-card {
				background: #fff;
				border: 1px solid #e5e7eb;
				border-radius: 15px;
				padding: 20px 10px;
				transition: all 0.3s ease;
				box-shadow: 0 2px 5px rgba(0,0,0,0.05);
				}
				
				.category-card:hover {
				transform: translateY(-5px);
				box-shadow: 0 8px 20px rgba(0,0,0,0.1);
				border-color: var(--main-color);
				}
				
				.category-card p {
				font-weight: 500;
				color: var(--heading-color);
				}
				
				.error-support {
				background: #f8f9fa;
				padding: 15px;
				border-radius: 15px;
				border: 1px solid #e9ecef;
				}
				
				@media (max-width: 768px) {
				.error-actions .btn {
					display: block;
					width: 100%;
					margin-bottom: 10px;
					margin-right: 0 !important;
				}
				}
			`}</style>
			</section>

		}
}

export default Error