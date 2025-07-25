import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../client/homepage/css/banner.css';
import '../../utils/axiosConfig';

class Banner extends Component {

	constructor(props) {
		super(props);
		this.state = {
			banners: [],
			currentIndex: 0
		};
		this.intervalId = null;
	}

	componentDidMount() {
		axios.get('/api/banners')
			.then(response => {
				console.log('Banner response:', response.data);
				// Kiểm tra cấu trúc response đúng và có dữ liệu
				if (response.data && response.data.data && Array.isArray(response.data.data)) {
					this.setState({ banners: response.data.data }, () => {
						if (this.state.banners.length > 1) {
							this.startAutoSlide();
						}
					});
				} else {
					console.error('Dữ liệu banner không đúng định dạng:', response.data);
					this.setState({ banners: [] });
				}
			})
			.catch(error => {
				console.error('Lỗi khi load banner:', error);
				this.setState({ banners: [] });
			});
	}

	componentWillUnmount() {
		this.stopAutoSlide();
	}

	startAutoSlide = () => {
		this.stopAutoSlide(); 
		this.intervalId = setInterval(this.goToNext, 5000);
	}

	stopAutoSlide = () => {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	goToPrevious = () => {
		this.stopAutoSlide();
		const { banners, currentIndex } = this.state;
		const isFirstBanner = currentIndex === 0;
		const newIndex = isFirstBanner ? banners.length - 1 : currentIndex - 1;
		this.setState({ currentIndex: newIndex }, this.startAutoSlide);
	};

	goToNext = () => {
		this.stopAutoSlide();
		const { banners, currentIndex } = this.state;
		const isLastBanner = currentIndex === banners.length - 1;
		const newIndex = isLastBanner ? 0 : currentIndex + 1;
		this.setState({ currentIndex: newIndex }, this.startAutoSlide);
	};

	getImageUrl = (imageUrl) => {
		const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
		
		const imagePath = imageUrl && imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
		
		return imagePath ? `${baseUrl}/${imagePath}` : `${process.env.PUBLIC_URL}/assets/img/banner/default-banner.jpg`;
	}

	render() {
		const { banners, currentIndex } = this.state;

		return (
			<div className="banner-area banner-style-2">
				<div className="container">
					<div className="banner-slider"> 
						<div className="banner-image-wrapper"> 
							{banners.map((banner, index) => (
								<Link 
									key={banner.id || index} 
									to={'#'} 
									className={`banner-slide-link ${index === currentIndex ? 'active' : ''}`} 
								>
									<img 
										src={this.getImageUrl(banner.imageUrl)}
										alt={banner.name || 'Banner image'} 
										className={`banner-slide-image ${index === currentIndex ? 'active' : ''}`} 
									/>
								</Link>
							))}
						</div>

						{banners.length > 1 && (
							<>
								<button onClick={this.goToPrevious} className="banner-nav banner-nav-prev">
									&#10094;
								</button>
								<button onClick={this.goToNext} className="banner-nav banner-nav-next">
									&#10095;
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Banner