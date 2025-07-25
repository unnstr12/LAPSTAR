import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
	const publicUrl = process.env.PUBLIC_URL + '/';
	const { isAuthenticated, currentUser, logout } = useAuth();
	const history = useHistory();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	// Tải danh mục từ API khi component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get('/api/categories');
				if (response.data && response.data.data) {
					// Lọc chỉ lấy danh mục gốc (không có parentId)
					const rootCategories = response.data.data.filter(cat => !cat.parentId);
					setCategories(rootCategories);
				}
			} catch (error) {
				console.error('Lỗi khi tải danh mục:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	// Hàm tạo slug từ tên danh mục
	const createSlug = (name) => {
		return name.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/[^a-z0-9 -]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	};

	const handleLogout = async () => {
		await logout();
		history.push('/login');
	};

	const navigateTo = (path) => {
		history.push(path);
	};

	return (
		<div>
			<div className="dkt-sitebar-menu">
				<div className="dkt-sitebar-menu">
					<span className="dkt-sitebar-close"><i className="fa fa-times" /></span>
					<div className="dkt-details-inner">
						<div className="logo go-top">
							<a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
								<img src={publicUrl + "assets/img/logo-3.png"} alt="logo" />
							</a>
						</div>
						<p className="details">Donsectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua. </p>
						<div className="address-inner">
							<h5>Address</h5>
							<p>3538 Cambridge Place Laurel, MD 20707</p>
						</div>
						<div className="address-inner">
							<h5>Phone</h5>
							<p>410-565-2575</p>
						</div>
						<div className="address-inner mb-0">
							<h5>Email</h5>
							<p>JohnPMills@dmarket.com</p>
						</div>
					</div>
					<div className="dkt-market-earn">
						<div className="address-inner">
							<h5>Market Earning</h5>
							<p>online store with lots of digital product and exclusive Item</p>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<div className="earn-inner">
									<p>Item Sold</p>
									<h5>12501</h5>
								</div>
							</div>
							<div className="col-lg-6">
								<div className="earn-inner">
									<p>Total Earning</p>
									<h5>25804</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="navbar-area go-top">
				<nav className="navbar navbar-expand-lg">
					<div className="container nav-container">
						<div className="responsive-mobile-menu">
							<button className="menu toggle-btn d-block d-lg-none" data-target="#dkt_main_menu" aria-expanded="false" aria-label="Toggle navigation">
								<span className="icon-left" />
								<span className="icon-right" />
							</button>
						</div>
						<div className="logo">
							<a className="main-logo-h1 main-logo-border" href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
								<img src={publicUrl + "assets/img/logo.png"} alt="logo" />
							</a>
						</div>
						<div className="collapse navbar-collapse" id="dkt_main_menu">
							<ul className="navbar-nav menu-open">
								<li>
									<a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>Trang chủ</a>
								</li>
								<li className="menu-item-has-children">
									<a href="#">Sản phẩm</a>
									<ul className="sub-menu">
										{loading ? (
											<li><span>Đang tải...</span></li>
										) : (
											categories.map(category => (
												<li key={category.categoryId}>
													<a href={`/${createSlug(category.categoryName)}`} onClick={(e) => { 
														e.preventDefault(); 
														navigateTo(`/${createSlug(category.categoryName)}`); 
													}}>
														{category.categoryName}
													</a>
												</li>
											))
										)}
									</ul>
								</li>
								<li className="menu-item-has-children">
									<a href="#">Khám phá</a>
									<ul className="sub-menu">
										<li>
											<a href="/category" onClick={(e) => { e.preventDefault(); navigateTo('/category'); }}>Danh mục</a>
										</li>
										<li>
											<a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }}>Bài viết</a>
										</li>
										<li>
											<a href="/faq" onClick={(e) => { e.preventDefault(); navigateTo('/faq'); }}>FAQ</a>
										</li>
										<li>
											<a href="/policy" onClick={(e) => { e.preventDefault(); navigateTo('/policy'); }}>Chính sách</a>
										</li>
									</ul>
								</li>
								<li>
									<a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }}>Liên hệ</a>
								</li>
							</ul>
						</div>
						<div className="nav-right-part nav-right-part-desktop">
							<ul>
								<li>
									<a href="/cart" onClick={(e) => { e.preventDefault(); navigateTo('/cart'); }}>
										<img src={publicUrl + "assets/img/icon/2.png"} alt="cart" /> Giỏ hàng
									</a>
								</li>
								<li><a className="search" href="#"><img src={publicUrl + "assets/img/icon/1.png"} alt="search" /></a></li>
								{isAuthenticated ? (
									<li className="menu-item-has-children user-dropdown">
										<a href="#">
											<i className="fa fa-user-circle mr-1"></i>
											{currentUser?.fullName || currentUser?.email}
										</a>
										<ul className="sub-menu">
											<li>
												<a href="/profile" onClick={(e) => { e.preventDefault(); navigateTo('/profile'); }}>
													Thông tin tài khoản
												</a>
											</li>
											<li>
												<a href="/my-orders" onClick={(e) => { e.preventDefault(); navigateTo('/my-orders'); }}>
													Đơn hàng của tôi
												</a>
											</li>
											<li><button onClick={handleLogout} className="btn-logout">Đăng xuất</button></li>
										</ul>
									</li>
								) : (
									<li>
										<a href="/login" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }} className="btn btn-base">
											Đăng nhập
										</a>
									</li>
								)}
								<li className="menu-bar dropdown-menu-btn"><a href="#"><i className="fa fa-bars"></i></a></li>
							</ul>
						</div>
						<div className="nav-right-part nav-right-part-mobile">
							{isAuthenticated ? (
								<a href="/profile" onClick={(e) => { e.preventDefault(); navigateTo('/profile'); }} className="user-icon-mobile">
									<i className="fa fa-user"></i>
								</a>
							) : (
								<a href="/login" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }} className="btn btn-base">
									Đăng nhập
								</a>
							)}
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;