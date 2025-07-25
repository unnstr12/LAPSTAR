import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './utils/protectedRoute';
import setupAxiosInterceptors from './utils/axiosConfig';
import Chatbot from './components/global-components/chatbot';
import HomeV1 from './client/homepage/home-v1';
import HomeV2 from './components/home-v2';
import Product from './client/products/product';
import ProductDetails from './client/product-detail/product-details';
import Vendor from './components/vendor';
import Category from './components/category';
import Faq from './components/faq';
import Policy from './client/policy/policy';
import Error from './client/error/error';
import SignIn from './auth/sign-in';
import SignUp from './auth/sign-up';
import ResetPassword from './auth/reset-password';
import Contact from './client/contact/contact';
import Blog from './components/blog';
import BlogDetails from './components/blog-details';
import Cart from './client/cart/cart';
import Checkout from './client/checkout/checkout';
import Profile from './client/profile/profile';
import SearchPage from './client/search/search-page';
import OrderStatus from './client/checkout/order-status';

import AdminLayout from './admin/admin-layout';
import Dashboard from './admin/dashboard/dashboard';
import ProductListAdmin from './admin/products/product-list-admin';
import ProductDetailAdmin from './admin/products/product-detail-admin';
import ProductAddAdmin from './admin/products/product-add-admin';
import UserListAdmin from './admin/users/user-list-admin';
import UserDetailAdmin from './admin/users/user-detail-admin';
import OrderListAdmin from './admin/order/order-list-admin';
import OrderDetailAdmin from './admin/order/order-detail-admin';
import CouponListAdmin from './admin/coupons/coupon-list-admin';
import CouponDetailAdmin from './admin/coupons/coupon-detail-admin';
// Thiết lập Axios interceptors
setupAxiosInterceptors();

class Root extends Component {
	render() {
		return (
			<AuthProvider>
				<CartProvider>
					<Router basename="/">
						<div>
							<Switch>
								{/* Client Routes */}
								<Route exact path="/" component={HomeV1} />
								<Route path="/home-v2" component={HomeV2} />
								<Route exact path="/product" component={Product} />
								<Route path="/product-details/:variantId" component={ProductDetails} />
								<Route path="/vendor" component={Vendor} />
								<Route path="/category" component={Category} />
								<Route path="/faq" component={Faq} />
								<Route path="/policy" component={Policy} />
								<Route path="/search" component={SearchPage} />
								<Route path="/error" component={Error} />
								<Route path="/login" component={SignIn} />
								<Route path="/register" component={SignUp} />
								<Route path="/reset-password" component={ResetPassword} />
								<Route path="/contact" component={Contact} />
								<Route path="/blog" component={Blog} />
								<Route path="/blog-details" component={BlogDetails} />
								<Route path="/cart" component={Cart} />
								<Route path="/checkout" component={Checkout} />
								<Route path="/order-status" component={OrderStatus} />
								<Route path="/profile" component={Profile} />
								<ProtectedRoute path="/admin" roles={['ADMIN', 'SELLER']}>
									<AdminLayout>
										<Switch>
											<Route exact path="/admin">
												<Redirect to="/admin/products" />
											</Route>
											
											{/* Dashboard - chỉ ADMIN */}
											<ProtectedRoute exact path="/admin/dashboard" roles={['ADMIN']}>
												<Dashboard />
											</ProtectedRoute>
											
											{/* Products - ADMIN và SELLER */}
											<ProtectedRoute exact path="/admin/products" roles={['ADMIN', 'SELLER']}>
												<ProductListAdmin />
											</ProtectedRoute>
											<ProtectedRoute exact path="/admin/products/add" roles={['ADMIN']}>
												<ProductAddAdmin />
											</ProtectedRoute>
											<ProtectedRoute exact path="/admin/products/:id" roles={['ADMIN', 'SELLER']}>
												<ProductDetailAdmin />
											</ProtectedRoute>
											
											{/* Users - chỉ ADMIN */}
											<ProtectedRoute exact path="/admin/users" roles={['ADMIN']}>
												<UserListAdmin />
											</ProtectedRoute>
											<ProtectedRoute exact path="/admin/users/:id" roles={['ADMIN']}>
												<UserDetailAdmin />
											</ProtectedRoute>
											
											{/* Orders - ADMIN và SELLER */}
											<ProtectedRoute exact path="/admin/orders" roles={['ADMIN', 'SELLER']}>
												<OrderListAdmin />
											</ProtectedRoute>
											<ProtectedRoute exact path="/admin/orders/:id" roles={['ADMIN', 'SELLER']}>
												<OrderDetailAdmin />
											</ProtectedRoute>
											
											{/* Coupons - ADMIN và SELLER có thể xem, chỉ ADMIN có thể thêm */}
											<ProtectedRoute exact path="/admin/coupons" roles={['ADMIN', 'SELLER']}>
												<CouponListAdmin />
											</ProtectedRoute>
											<ProtectedRoute exact path="/admin/coupons/add" roles={['ADMIN']}>
												<CouponDetailAdmin />
											</ProtectedRoute>
											<ProtectedRoute exact path="/admin/coupons/:id" roles={['ADMIN', 'SELLER']}>
												<CouponDetailAdmin />
											</ProtectedRoute>
										</Switch>
									</AdminLayout>
								</ProtectedRoute>
								<Route path="/:categorySlug" component={Product} />
								<Route path="*" component={Error} />
							</Switch>
							<Chatbot />
						</div>
					</Router>
				</CartProvider>
			</AuthProvider>
		)
	}
}

export default Root;

ReactDOM.render(<Root />, document.getElementById('laptop-world'));
