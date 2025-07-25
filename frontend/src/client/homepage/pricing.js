import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class Pricing extends Component {

	render() {
		let publicUrl = process.env.PUBLIC_URL + '/'

		return <section className="pricing-area text-center pd-top-90 pd-bottom-70">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-lg-6">
						<div className="section-title text-center mb-4">
							<h2>Danh mục sản phẩm</h2>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-4">
						<Link to="/laptop" className="single-category-wrap-link laptop-category">
							<div className="single-category-wrap-2 text-center">
								<div className="thumb">
									<img src={`${publicUrl}assets/img/category-icons/laptop.png`} alt="Laptop" className="category-icon" />
								</div>
								<h4>Laptop</h4>
							</div>
						</Link>
					</div>
					<div className="col-4">
						<Link to="/ban-phim" className="single-category-wrap-link keyboard-category">
							<div className="single-category-wrap-2 text-center">
								<div className="thumb">
									<img src={`${publicUrl}assets/img/category-icons/ban-phim.png`} alt="Bàn phím" className="category-icon" />
								</div>
								<h4>Bàn phím</h4>
							</div>
						</Link>
					</div>
					<div className="col-4">
						<Link to="/tai-nghe" className="single-category-wrap-link headphone-category">
							<div className="single-category-wrap-2 text-center">
								<div className="thumb">
									<img src={`${publicUrl}assets/img/category-icons/tai-nghe.png`} alt="Tai nghe" className="category-icon" />
								</div>
								<h4>Tai nghe</h4>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</section>


	}
}

export default Pricing