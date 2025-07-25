import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './navbar-v2.css';

const NavbarV2 = () => {
	const publicUrl = process.env.PUBLIC_URL + '/';
	const { isAuthenticated, currentUser, logout } = useAuth();
	const history = useHistory();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const searchRef = useRef(null);
	const searchTimeout = useRef(null);

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

		// Thêm event listener để đóng dropdown khi click ra ngoài
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			if (searchTimeout.current) clearTimeout(searchTimeout.current);
		};
	}, []);

	// Xử lý click ra ngoài dropdown
	const handleClickOutside = (event) => {
		if (searchRef.current && !searchRef.current.contains(event.target)) {
			setShowSearchResults(false);
		}
	};

	// Tìm kiếm sản phẩm
	const searchProducts = async (query) => {
		if (!query.trim()) {
			setSearchResults([]);
			setShowSearchResults(false);
			return;
		}

		try {
			setIsSearching(true);
			const response = await axios.get('/api/products/paged', {
				params: {
					pageNo: 0,
					pageSize: 5,
					searchKeyword: query
				}
			});

			if (response.data && response.data.success) {
				setSearchResults(response.data.data.content || []);
				setShowSearchResults(true);
			}
		} catch (error) {
			console.error('Lỗi khi tìm kiếm sản phẩm:', error);
		} finally {
			setIsSearching(false);
		}
	};

	// Xử lý khi người dùng thay đổi input
	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		// Debounce tìm kiếm để tránh gọi API quá nhiều
		if (searchTimeout.current) {
			clearTimeout(searchTimeout.current);
		}

		searchTimeout.current = setTimeout(() => {
			searchProducts(query);
		}, 300);
	};

	// Xử lý khi người dùng click vào kết quả tìm kiếm
	const handleSearchResultClick = (productId) => {
		setShowSearchResults(false);
		setSearchQuery('');
		history.push(`/product-details/${productId}`);
	};

	// Xử lý khi người dùng submit form tìm kiếm
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			setShowSearchResults(false);
			history.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
		}
	};

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

	// Format giá sản phẩm
	const formatPrice = (price) => {
		return price ? price.toLocaleString('vi-VN') + '₫' : '0₫';
	};

	// Lấy URL hình ảnh
	const getImageUrl = (product) => {
		if (!product || !product.images || product.images.length === 0) {
			return `${publicUrl}assets/img/product/default-product.jpg`;
		}

		const imagePath = product.images[0].imageUrl;

		if (imagePath.startsWith('http')) {
			return imagePath;
		}

		const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
		return imagePath.startsWith('/')
			? `${baseUrl}${imagePath}`
			: `${baseUrl}/${imagePath}`;
	};

	const handleLogout = async () => {
		await logout();
		history.push('/');
	};

	return (
		<div>
			<div className="navbar-area navbar-area-2 go-top">
				<nav className="navbar navbar-expand-lg">
					<div className="container nav-container">
						<div className="responsive-mobile-menu">
							<button className="menu toggle-btn d-block d-lg-none" data-target="#dkt_main_menu" aria-expanded="false" aria-label="Toggle navigation">
								<span className="icon-left" />
								<span className="icon-right" />
							</button>
						</div>
						<div className="logo">
							<Link className="main-logo" to="/"><img src={publicUrl + "assets/img/logo.png"} alt="logo" /></Link>
						</div>

						<div className="mobile-search-container d-md-none">
							<form onSubmit={handleSearchSubmit} className="search-form">
								<input
									type="text"
									placeholder="Tìm kiếm sản phẩm..."
									value={searchQuery}
									onChange={handleSearchChange}
									className="search-input"
									onClick={() => searchQuery.trim() && setShowSearchResults(true)}
								/>
								<button type="submit" className="search-button">
									<img src={publicUrl + "assets/img/icon/1b.png"} alt="search" />
								</button>
							</form>
						</div>

						<div className="collapse navbar-collapse" id="dkt_main_menu">
							<ul className="navbar-nav menu-open">
								<li className="menu-item-has-children">
									<Link to="#">Sản phẩm</Link>
									<ul className="sub-menu">
										{loading ? (
											<li><span>Đang tải...</span></li>
										) : (
											categories.map(category => (
												<li key={category.categoryId}>
													<a href={`/${createSlug(category.categoryName)}`}>
														{category.categoryName}
													</a>
												</li>
											))
										)}
									</ul>
								</li>
								<li className="menu-item-has-children">
									<Link to="#">Khám phá</Link>
									<ul className="sub-menu">
										<li><Link to="/contact">Liên hệ</Link></li>
										<li><Link to="/policy">Chính sách</Link></li>
									</ul>
								</li>
								<li>
									<div className="search-container" ref={searchRef}>
										<form onSubmit={handleSearchSubmit} className="search-form">
											<input
												type="text"
												placeholder="Xin chào, bạn đang tìm gì?"
												value={searchQuery}
												onChange={handleSearchChange}
												className="search-input"
												onClick={() => searchQuery.trim() && setShowSearchResults(true)}
											/>
											<button type="submit" className="search-button">
												<img src={publicUrl + "assets/img/icon/1b.png"} alt="search" />
											</button>
										</form>

										{showSearchResults && (
											<div className="search-results-dropdown-wrapper">
												<div className="search-results-dropdown">
													{isSearching ? (
														<div className="search-loading">
															<div className="spinner-border spinner-border-sm" role="status">
																<span className="sr-only">Đang tìm...</span>
															</div>
															<span>Đang tìm kiếm...</span>
														</div>
													) : searchResults.length > 0 ? (
														<>
															<div className="row">
																{searchResults.map(product => (
																	<div className="col-12 search-result-item" key={product.productId} onClick={() => handleSearchResultClick(product.productId)}>
																		<div className="search-result-image">
																			<img src={getImageUrl(product)} alt={product.productName} />
																		</div>
																		<div className="search-result-info">
																			<h5 className="search-result-name">{product.productName} {product.sku}</h5>
																			<p className="search-result-price">{formatPrice(product.price)}</p>
																		</div>
																	</div>
																))}
															</div>
															<div className="search-results-footer">
																<button
																	className="admin-btn search-view-all"
																	onClick={() => {
																		setShowSearchResults(false);
																		history.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
																	}}
																>
																	Xem tất cả kết quả
																</button>
															</div>
														</>
													) : (
														<div className="search-no-results">
															<p>Không tìm thấy sản phẩm phù hợp</p>
														</div>
													)}
												</div>
											</div>
										)}
									</div>
								</li>
							</ul>
						</div>

						<div className="nav-right-part nav-right-part-desktop">
							<ul>
								<li><Link to="/cart"><img src={publicUrl + "assets/img/icon/2m.png"} alt="cart" /></Link></li>
								{isAuthenticated ? (
									<li className="menu-item-has-children user-dropdown">
										<a href="#">
											<i className="fa fa-user-circle mr-1"></i>
											{currentUser?.fullName || currentUser?.email}
										</a>
										<ul className="sub-menu">
											<li><Link to="/profile">Thông tin tài khoản</Link></li>
											<li><Link to="/profile?tab=orders">Đơn hàng của tôi</Link></li>
											<li><button onClick={handleLogout} className="btn-logout">Đăng xuất</button></li>
										</ul>
									</li>
								) : (
									<li><Link to="/login" className="admin-btn admin-btn-primary"><div className='login-text'>Đăng nhập</div></Link></li>
								)}
								<li className="menu-bar dropdown-menu-btn"><i className="fa fa-bars" /></li>
							</ul>
						</div>
						<div className="nav-right-part nav-right-part-mobile">
							{isAuthenticated ? (
								<Link to="/profile" className="user-icon-mobile"><i className="fa fa-user"></i></Link>
							) : (
								<Link to="/login" className="admin-btn admin-btn-primary">Đăng nhập</Link>
							)}
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}

export default NavbarV2;