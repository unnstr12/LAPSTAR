import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import axiosConfig from '../../utils/axiosConfig';
import './product-page.css';

class ProductPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			currentPage: 0,
			totalPages: 0,
			totalItems: 0,
			loading: true,
			error: null,
			categoryName: '',
			categoryData: {},
			categories: [],
			// Thêm state cho bộ lọc
			subCategories: [],
			brands: [],
			// Applied filters (thực tế được áp dụng)
			selectedBrands: [],
			selectedCategories: [],
			priceRange: {
				min: 0,
				max: 50000000,
				current: [0, 50000000],
				noMaxLimit: false
			},
			// Temporary filters (chưa áp dụng)
			tempSelectedBrands: [],
			tempSelectedCategories: [],
			tempPriceRange: {
				min: 0,
				max: 50000000,
				current: [0, 50000000],
				noMaxLimit: false
			},
			sortBy: 'productId',
			sortDir: 'desc',
			currentRootCategoryId: null,
			filtersApplied: false
		};
	}

	componentDidMount() {
		// Đọc URL params trước
		this.readURLParams();
		// Tải danh sách danh mục
		this.loadCategories();
	}

	componentDidUpdate(prevProps) {
		// Nếu category thay đổi (URL thay đổi), load lại sản phẩm
		if (prevProps.categorySlug !== this.props.categorySlug) {
			this.setState({
				currentPage: 0,
				selectedBrands: [],
				selectedCategories: [],
				tempSelectedBrands: [],
				tempSelectedCategories: [],
				priceRange: { min: 0, max: 50000000, current: [0, 50000000], noMaxLimit: false },
				tempPriceRange: { min: 0, max: 50000000, current: [0, 50000000], noMaxLimit: false },
				sortBy: 'productId',
				sortDir: 'desc'
			}, () => {
				this.updateURL();
				this.loadProductsByCategory();
			});
		}
	}

	// Đọc URL parameters
	readURLParams = () => {
		const urlParams = new URLSearchParams(window.location.search);

		const page = parseInt(urlParams.get('page')) || 0;
		const sortBy = urlParams.get('sortBy') || 'productId';
		const sortDir = urlParams.get('sortDir') || 'desc';
		const brandIds = urlParams.get('brandIds') ? urlParams.get('brandIds').split(',').map(id => parseInt(id)) : [];
		const categoryIds = urlParams.get('categoryIds') ? urlParams.get('categoryIds').split(',').map(id => parseInt(id)) : [];
		const minPrice = parseInt(urlParams.get('minPrice')) || 0;
		const maxPrice = urlParams.get('maxPrice') ? parseInt(urlParams.get('maxPrice')) : 50000000;
		const noMaxLimit = !urlParams.get('maxPrice') || parseInt(urlParams.get('maxPrice')) >= 50000000;

		this.setState({
			currentPage: page,
			sortBy,
			sortDir,
			selectedBrands: brandIds,
			selectedCategories: categoryIds,
			tempSelectedBrands: brandIds,
			tempSelectedCategories: categoryIds,
			priceRange: {
				min: minPrice,
				max: noMaxLimit ? null : maxPrice,
				current: [minPrice, maxPrice],
				noMaxLimit
			},
			tempPriceRange: {
				min: minPrice,
				max: noMaxLimit ? null : maxPrice,
				current: [minPrice, maxPrice],
				noMaxLimit
			},
			filtersApplied: brandIds.length > 0 || categoryIds.length > 0 || minPrice > 0 || (!noMaxLimit && maxPrice < 50000000)
		});
	};

	// Cập nhật URL parameters
	updateURL = () => {
		const {
			currentPage,
			sortBy,
			sortDir,
			selectedBrands,
			selectedCategories,
			priceRange
		} = this.state;

		const urlParams = new URLSearchParams();

		if (currentPage > 0) urlParams.set('page', currentPage.toString());
		if (sortBy !== 'productId') urlParams.set('sortBy', sortBy);
		if (sortDir !== 'desc') urlParams.set('sortDir', sortDir);
		if (selectedBrands.length > 0) urlParams.set('brandIds', selectedBrands.join(','));
		if (selectedCategories.length > 0) urlParams.set('categoryIds', selectedCategories.join(','));
		if (priceRange.min > 0) urlParams.set('minPrice', priceRange.min.toString());
		if (priceRange.max !== null && priceRange.max < 50000000) urlParams.set('maxPrice', priceRange.max.toString());

		const newURL = urlParams.toString() ? `${window.location.pathname}?${urlParams.toString()}` : window.location.pathname;
		window.history.replaceState({}, '', newURL);
	};

	// Tải danh sách danh mục
	loadCategories = () => {
		axios.get('/api/categories')
			.then(response => {
				if (response.data && response.data.data) {
					const categories = response.data.data;

					// Tạo mapping từ slug đến ID và tên danh mục
					const categoryMap = {};

					// Hàm đệ quy để xử lý các danh mục
					const processCategory = (category) => {
						// Tạo slug từ tên danh mục
						const slug = this.createSlug(category.categoryName);

						// Lưu thông tin mapping
						categoryMap[slug] = {
							id: category.categoryId,
							name: category.categoryName,
							parentId: category.parentId
						};

						// Xử lý danh mục con nếu có
						if (category.children && category.children.length > 0) {
							category.children.forEach(child => processCategory(child));
						}
					};

					// Xử lý tất cả danh mục
					categories.forEach(category => processCategory(category));

					this.setState({
						categories,
						categoryData: categoryMap
					}, () => {
						// Sau khi đã có dữ liệu danh mục, tải sản phẩm
							this.loadProductsByCategory();
					});
				}
			})
			.catch(error => {
				console.error('Lỗi khi tải danh mục:', error);
			});
	};

	// Tải danh sách danh mục con
	loadSubCategories = (categoryId) => {
		axios.get(`/api/categories/${categoryId}/subcategories`)
			.then(response => {
				if (response.data && response.data.data) {
					this.setState({ subCategories: response.data.data });
				}
			})
			.catch(error => {
				console.error('Lỗi khi tải danh mục con:', error);
			});
	};

	// Tải danh sách thương hiệu theo danh mục
	loadBrandsByCategory = (categoryId) => {
		axios.get(`/api/brands/by-category/${categoryId}`)
			.then(response => {
				if (response.data && response.data.data) {
					this.setState({ brands: response.data.data });
				}
			})
			.catch(error => {
				console.error('Lỗi khi tải thương hiệu:', error);
			});
	};

	// Tạo slug từ chuỗi tiếng Việt
	createSlug = (str) => {
		// Loại bỏ dấu tiếng Việt
		str = str.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd');

		// Thay thế các ký tự đặc biệt và khoảng trắng
		return str
			.replace(/[^a-z0-9 -]/g, '') // Loại bỏ ký tự đặc biệt
			.replace(/\s+/g, '-')        // Thay khoảng trắng bằng dấu gạch ngang
			.replace(/-+/g, '-');        // Loại bỏ dấu gạch ngang liên tiếp
	};

	loadProductsByCategory = () => {
		const { categorySlug } = this.props;
		const {
			currentPage,
			categoryData,
			selectedBrands,
			selectedCategories,
			priceRange,
			sortBy,
			sortDir
		} = this.state;

		this.setState({ loading: true, error: null });

		// API URL dựa vào category slug
		let apiUrl;
		let categoryNameVi = 'Tất cả sản phẩm';
		let rootCategoryId = null;

		if (categorySlug && Object.keys(categoryData).length > 0) {
			// Lấy categoryId dựa trên slug
			const categoryInfo = categoryData[categorySlug];

			if (categoryInfo) {
				rootCategoryId = categoryInfo.id;

				// Tạo URL cơ bản
				apiUrl = `/api/products/root-category/${rootCategoryId}?pageNo=${currentPage}&pageSize=12&sortBy=${sortBy}&sortDir=${sortDir}`;

				// Thêm các tham số lọc
				if (selectedBrands.length > 0) {
					apiUrl += `&brandIds=${selectedBrands.join(',')}`;
				}

				if (selectedCategories.length > 0) {
					apiUrl += `&categoryIds=${selectedCategories.join(',')}`;
				}

				if (priceRange.min > 0) {
					apiUrl += `&minPrice=${priceRange.min}`;
				}

				if (priceRange.max !== null && priceRange.max < 50000000) {
					apiUrl += `&maxPrice=${priceRange.max}`;
				}

				categoryNameVi = categoryInfo.name;

				// Tải danh mục con và thương hiệu nếu categoryId thay đổi
				if (rootCategoryId !== this.state.currentRootCategoryId) {
					this.loadSubCategories(rootCategoryId);
					this.loadBrandsByCategory(rootCategoryId);
					this.setState({ currentRootCategoryId: rootCategoryId });
				}
			} else {
				this.setState({
					loading: false,
					error: 'Không tìm thấy danh mục',
					products: [],
					categoryName: 'Không tìm thấy'
				});
				return;
			}
		} else {
			// Nếu không có slug hoặc chưa tải được dữ liệu danh mục, lấy tất cả sản phẩm
			apiUrl = `/api/products/paged?pageNo=${currentPage}&pageSize=12&sortBy=${sortBy}&sortDir=${sortDir}`;
		}

		axios.get(apiUrl)
			.then(response => {
				if (response.data && response.data.data) {
					const { content, totalPages, totalElements } = response.data.data;
					this.setState({
						products: content,
						totalPages,
						totalItems: totalElements,
						loading: false,
						categoryName: categoryNameVi
					});
				}
			})
			.catch(error => {
				console.error('Lỗi khi tải sản phẩm:', error);
				this.setState({
					loading: false,
					error: 'Có lỗi xảy ra khi tải sản phẩm',
					products: []
				});
			});
	};

	// Xử lý thay đổi trang
	handlePageChange = (pageNumber) => {
		this.setState({ currentPage: pageNumber }, () => {
			this.updateURL();
			this.loadProductsByCategory();
		});
	};

	// Xử lý thay đổi thương hiệu (temporary)
	handleTempBrandChange = (brandId) => {
		const { tempSelectedBrands } = this.state;
		let newTempSelectedBrands;

		if (tempSelectedBrands.includes(brandId)) {
			newTempSelectedBrands = tempSelectedBrands.filter(id => id !== brandId);
		} else {
			newTempSelectedBrands = [...tempSelectedBrands, brandId];
		}

		this.setState({
			tempSelectedBrands: newTempSelectedBrands
		});
	};

	// Xử lý thay đổi danh mục (temporary)
	handleTempCategoryChange = (categoryId) => {
		const { tempSelectedCategories } = this.state;
		let newTempSelectedCategories;

		if (tempSelectedCategories.includes(categoryId)) {
			newTempSelectedCategories = tempSelectedCategories.filter(id => id !== categoryId);
		} else {
			newTempSelectedCategories = [...tempSelectedCategories, categoryId];
		}

		this.setState({
			tempSelectedCategories: newTempSelectedCategories
		});
	};

	// Xử lý thay đổi khoảng giá qua slider (temporary)
	handleTempPriceChange = (value) => {
		// Làm tròn giá trị đến bội số của 100.000
		let roundedValues = value.map(val => Math.round(val / 100000) * 100000);

		// Đảm bảo min <= max
		if (roundedValues[0] > roundedValues[1]) {
			roundedValues[0] = roundedValues[1];
		}

		const noMaxLimit = roundedValues[1] >= 50000000;

		this.setState({
			tempPriceRange: {
				...this.state.tempPriceRange,
				current: roundedValues,
				noMaxLimit: noMaxLimit
			}
		});
	};

	// Xử lý thay đổi khoảng giá qua input (temporary)
	handleTempPriceInputChange = (index, value) => {
		const newValue = value === '' ? 0 : parseInt(value);
		const current = [...this.state.tempPriceRange.current];
		current[index] = newValue;

		// Đảm bảo min <= max
		if (index === 0 && current[0] > current[1]) {
			current[0] = current[1];
		} else if (index === 1 && current[1] < current[0]) {
			current[1] = current[0];
		}

		// Cập nhật trạng thái không giới hạn giá tối đa
		const noMaxLimit = current[1] >= 50000000;

		this.setState({
			tempPriceRange: {
				...this.state.tempPriceRange,
				current,
				noMaxLimit
			}
		});
	};

	// Xử lý chuyển đổi trạng thái không giới hạn giá tối đa (temporary)
	toggleTempMaxLimitState = () => {
		const { tempPriceRange } = this.state;
		const newNoMaxLimit = !tempPriceRange.noMaxLimit;
		const newCurrent = [...tempPriceRange.current];

		if (newNoMaxLimit) {
			newCurrent[1] = 50000000;
		}

		this.setState({
			tempPriceRange: {
				...tempPriceRange,
				current: newCurrent,
				noMaxLimit: newNoMaxLimit
			}
		});
	};

	// Áp dụng tất cả bộ lọc
	applyAllFilters = () => {
		const { tempSelectedBrands, tempSelectedCategories, tempPriceRange } = this.state;

		this.setState({
			currentPage: 0,
			selectedBrands: tempSelectedBrands,
			selectedCategories: tempSelectedCategories,
			priceRange: {
				...tempPriceRange,
				min: tempPriceRange.current[0],
				max: tempPriceRange.noMaxLimit ? null : tempPriceRange.current[1]
			},
			filtersApplied: true
		}, () => {
			this.updateURL();
			this.loadProductsByCategory();
		});
	};

	// Xóa tất cả bộ lọc
	clearAllFilters = () => {
		this.setState({
			selectedBrands: [],
			selectedCategories: [],
			tempSelectedBrands: [],
			tempSelectedCategories: [],
			priceRange: {
				min: 0,
				max: 50000000,
				current: [0, 50000000],
				noMaxLimit: false
			},
			tempPriceRange: {
				min: 0,
				max: 50000000,
				current: [0, 50000000],
				noMaxLimit: false
			},
			currentPage: 0,
			filtersApplied: false
		}, () => {
			this.updateURL();
			this.loadProductsByCategory();
		});
	};

	// Xử lý thay đổi sắp xếp
	handleSortChange = (sortBy, sortDir) => {
		this.setState({
			sortBy,
			sortDir,
			currentPage: 0
		}, () => {
			this.updateURL();
			this.loadProductsByCategory();
		});
	};

	// Hàm tạo đường dẫn ảnh đầy đủ
	getImageUrl = (imageUrl) => {
		const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
		// Nếu không có ảnh, trả về ảnh mặc định
		if (!imageUrl) {
			return `${process.env.PUBLIC_URL}/assets/img/product/default-product.jpg`;
		}

		// Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / để tránh lặp
		const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

		return `${baseUrl}/${imagePath}`;
	}

	// Lấy tối đa 5 thuộc tính quan trọng để hiển thị
	getTopAttributes = (attributeValues) => {
		if (!attributeValues || attributeValues.length === 0) {
			return [];
		}

		// Sắp xếp thuộc tính theo thứ tự ưu tiên (CPU, RAM, Storage, Display, GPU)
		const priorityOrder = {
			'CPU': 1,
			'Processor': 1,
			'RAM': 2,
			'Memory': 2,
			'Storage': 3,
			'Hard Drive': 3,
			'SSD': 3,
			'Display': 4,
			'Screen': 4,
			'Monitor': 4,
			'GPU': 5,
			'Graphics': 5,
			'Graphics Card': 5
		};

		// Sắp xếp theo thứ tự ưu tiên
		const sortedAttributes = [...attributeValues].sort((a, b) => {
			const priorityA = priorityOrder[a.attributeName] || 999;
			const priorityB = priorityOrder[b.attributeName] || 999;
			return priorityA - priorityB;
		});

		// Trả về tối đa 5 thuộc tính
		return sortedAttributes.slice(0, 5);
	}

	// Định dạng giá tiền
	formatCurrency = (value) => {
		return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
	};

	// Kiểm tra nếu có bộ lọc nào đang được áp dụng
	hasActiveFilters = () => {
		const { selectedBrands, selectedCategories, priceRange } = this.state;
		return selectedBrands.length > 0 ||
			selectedCategories.length > 0 ||
			priceRange.min > 0 ||
			(priceRange.max !== null && priceRange.max < 50000000);
	};

	// Kiểm tra nếu có thay đổi filter chưa áp dụng
	hasUnappliedChanges = () => {
		const {
			selectedBrands, selectedCategories, priceRange,
			tempSelectedBrands, tempSelectedCategories, tempPriceRange
		} = this.state;

		return JSON.stringify(selectedBrands) !== JSON.stringify(tempSelectedBrands) ||
			JSON.stringify(selectedCategories) !== JSON.stringify(tempSelectedCategories) ||
			priceRange.current[0] !== tempPriceRange.current[0] ||
			priceRange.current[1] !== tempPriceRange.current[1] ||
			priceRange.noMaxLimit !== tempPriceRange.noMaxLimit;
	};

	render() {
		const {
			products,
			currentPage,
			totalPages,
			loading,
			error,
			categoryName,
			brands,
			subCategories,
			tempSelectedBrands,
			tempSelectedCategories,
			tempPriceRange,
			sortBy,
			sortDir,
			filtersApplied
		} = this.state;

		let publicUrl = process.env.PUBLIC_URL + '/';

		if (loading) {
			return (
				<section className="all-item-area all-item-area-2 pd-top-100 pd-bottom-100">
					<div className="container text-center">
						<h3>Đang tải sản phẩm...</h3>
					</div>
				</section>
			);
		}

		if (error) {
			return (
				<section className="all-item-area all-item-area-2 pd-top-100 pd-bottom-100">
					<div className="container text-center">
						<h3>Lỗi: {error}</h3>
					</div>
				</section>
			);
		}

		return (
			<section className="all-item-area all-item-area-2 pd-top-100 pd-bottom-100">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="lt-breadcrumb">
								<Link to="/" className="breadcrumb-link-home">Trang chủ</Link>
								{categoryName && categoryName.trim() !== '' && (
									<>
										<span className="separator">/</span>
										<span className="lt-breadcrumb-current">{categoryName}</span>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="header-shadow-inner d-flex justify-content-between align-items-center">
						<h3 className="section-title">{categoryName}</h3>
						<div className="sorting-options">
							<span className="sort-label">Sắp xếp theo: </span>
							<button
								className={`sort-btn ${sortBy === 'productId' && sortDir === 'desc' ? 'active' : ''}`}
								onClick={() => this.handleSortChange('productId', 'desc')}
							>
								Nổi bật
							</button>
							<button
								className={`sort-btn ${sortBy === 'price' && sortDir === 'asc' ? 'active' : ''}`}
								onClick={() => this.handleSortChange('price', 'asc')}
							>
								Giá thấp đến cao
							</button>
							<button
								className={`sort-btn ${sortBy === 'price' && sortDir === 'desc' ? 'active' : ''}`}
								onClick={() => this.handleSortChange('price', 'desc')}
							>
								Giá cao đến thấp
							</button>
						</div>
					</div>

					<div className="all-item-section go-top">
						<div className="row">
							{/* Cột bộ lọc */}
							<div className="col-lg-3 col-md-4">
								<div className="filter-container">
									<div className="filter-section">
										<h5 className="filter-title">Thương hiệu</h5>
										<div className="row">
											{brands.length > 0 ? (
												brands.map(brand => (
													<div className="col-6 filter-option mb-2" key={`brand-${brand.brandId}`}>
														<input
															type="checkbox"
															id={`brand-${brand.brandId}`}
															checked={tempSelectedBrands.includes(brand.brandId)}
															onChange={() => this.handleTempBrandChange(brand.brandId)}
														/>
														<label htmlFor={`brand-${brand.brandId}`}>{brand.brandName}</label>
													</div>
												))
											) : (
												<p>Không có thương hiệu nào</p>
											)}
										</div>
									</div>

									<div className="filter-section">
										<h5 className="filter-title">Danh mục</h5>
										<div className="filter-options">
											{subCategories.length > 0 ? (
												subCategories.map(category => (
													<div className="filter-option" key={`category-${category.categoryId}`}>
														<input
															type="checkbox"
															id={`category-${category.categoryId}`}
															checked={tempSelectedCategories.includes(category.categoryId)}
															onChange={() => this.handleTempCategoryChange(category.categoryId)}
														/>
														<label htmlFor={`category-${category.categoryId}`}>{category.categoryName}</label>
													</div>
												))
											) : (
												<p>Không có danh mục con nào</p>
											)}
										</div>
									</div>

									<div className="filter-section">
										<h5 className="filter-title">Khoảng giá</h5>
										<div className="price-filter">
											<div className="price-input-group">
												<div className="price-input-container">
													<input
														type="text"
														value={tempPriceRange.current[0].toLocaleString('vi-VN')}
														onChange={(e) => this.handleTempPriceInputChange(0, e.target.value.replace(/\D/g, ''))}
														className="price-input"
													/>
													<span className="price-currency">đ</span>
												</div>
												<span className="price-separator">-</span>
												<div className="price-input-container">
													<input
														type="text"
														value={tempPriceRange.noMaxLimit ? "" : tempPriceRange.current[1].toLocaleString('vi-VN')}
														onChange={(e) => this.handleTempPriceInputChange(1, e.target.value.replace(/\D/g, ''))}
														className="price-input"
														placeholder={tempPriceRange.noMaxLimit ? "Không giới hạn" : ""}
														disabled={tempPriceRange.noMaxLimit}
													/>
													<span className="price-currency">đ</span>
												</div>
											</div>

											<div className="price-range-container">
												<div
													className="price-range-track"
													style={{
														backgroundImage: `linear-gradient(
															to right, 
															#ddd ${(tempPriceRange.current[0] / 50000000) * 100}%, 
rgb(21, 169, 255) ${(tempPriceRange.current[0] / 50000000) * 100}%, 
rgb(14, 28, 219) ${(tempPriceRange.current[1] / 50000000) * 100}%, 
															#ddd ${(tempPriceRange.current[1] / 50000000) * 100}%
														)`
													}}
												></div>
												<input
													type="range"
													min="0"
													max="50000000"
													step="100000"
													value={tempPriceRange.current[0]}
													onChange={(e) => {
														const newValue = parseInt(e.target.value);
														const maxValue = tempPriceRange.current[1];
														const adjustedValue = newValue > maxValue ? maxValue : newValue;
														this.handleTempPriceChange([adjustedValue, maxValue]);
													}}
													className="price-slider price-slider-min"
												/>
												<input
													type="range"
													min="0"
													max="50000000"
													step="100000"
													value={tempPriceRange.current[1]}
													onChange={(e) => {
														const newValue = parseInt(e.target.value);
														const minValue = tempPriceRange.current[0];
														const adjustedValue = newValue < minValue ? minValue : newValue;
														this.handleTempPriceChange([minValue, adjustedValue]);
													}}
													className="price-slider price-slider-max"
												/>
											</div>

											<div className="filter-buttons">
												<button
													className={`admin-btn admin-btn-primary btn-sm ${this.hasUnappliedChanges() ? 'pulse' : ''}`}
													onClick={this.applyAllFilters}
												>
													<i className="fa fa-filter"></i> Áp dụng
												</button>
												{this.hasActiveFilters() && (
													<button className="admin-btn admin-btn-secondary btn-sm" onClick={this.clearAllFilters}>
														<i className="fa fa-times"></i> Xóa tất cả bộ lọc
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Cột hiển thị sản phẩm */}
							<div className="col-lg-9 col-md-8">
								<div className="row">
									{products.length > 0 ? (
										products.map(product => {
								// Lấy tối đa 5 thuộc tính quan trọng
								const topAttributes = this.getTopAttributes(product.attributeValues);
								// Lấy ảnh đầu tiên hoặc ảnh mặc định
								const firstImage = product.images && product.images.length > 0 ? product.images[0].imageUrl : null;

								return (
												<div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.productId}>
										<div className="all-isotope-item" key={product.productId}>
											<div className="thumb">
												<a href={`/product-details/${product.productId}`}>
													<img src={this.getImageUrl(firstImage)} alt={product.productName} />
													<div className="specs-overlay">
														{topAttributes.map((attr, index) => (
															<p key={index}>
																{attr.attributeName}: {attr.value} {attr.attributeUnit}
															</p>
														))}
													</div>
												</a>
											</div>
											<div className="item-details">
															{product.discountPrice ? (
																<>
																	<div>
																		<s className='discount-price'>{new Intl.NumberFormat('vi-VN').format(product.price)} đ</s>
																	</div>
																	<div className='d-flex align-items-center mb-2'>
																		<span className="price">{new Intl.NumberFormat('vi-VN').format(product.discountPrice)} đ</span>
																		<span className="discount-percent ml-1">-{product.discountPercent}%</span>
																	</div>
																</>
															) : (
																<div>
																	<span className="price mb-2">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</span>
																</div>
															)}
												<h6><a href={`/product-details/${product.productId}`}>{product.productName}</a></h6>
												<p className="short-desc">{product.brand.brandName} - {product.category.categoryName}</p>
											</div>
										</div>
									</div>
								);
										})
									) : (
										<div className="col-12 text-center">
											<p>Không tìm thấy sản phẩm nào</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				{totalPages > 1 && (
					<nav className="admin-pagination-wrapper mt-4 d-flex justify-content-center">
						<ul className="admin-pagination">
								<li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
									<button
										className="page-link"
										onClick={() => this.handlePageChange(currentPage - 1)}
										disabled={currentPage === 0}
									>
									&laquo;
									</button>
								</li>
							{Array.from({ length: totalPages }, (_, i) => i).map(page => (
								<li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
										<button
											className="page-link"
										onClick={() => this.handlePageChange(page)}
										>
										{page + 1}
										</button>
									</li>
								))}
								<li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
									<button
										className="page-link"
										onClick={() => this.handlePageChange(currentPage + 1)}
										disabled={currentPage === totalPages - 1}
									>
									&raquo;
									</button>
								</li>
							</ul>
					</nav>
				)}
			</section>
		);
	}
}

export default ProductPage;