import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/global-components/navbar-v2';
import AuthContext from '../context/AuthContext';

class SignIn extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            error: ''
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: '' });

        try {
            const response = await axios.post('/api/auth/login', {
                email: this.state.email,
                password: this.state.password
            });

            // Log thông tin response để debug
            console.log("Login response:", response.data);

            // Sử dụng context để đăng nhập với response hoàn chỉnh
            this.context.login(response.data);

            // Lấy thông tin người dùng từ response
            const userInfo = response.data.data.user;

            // Lấy đường dẫn chuyển hướng từ state (nếu có)
            const { from } = this.props.location.state || { from: { pathname: '/' } };

            // Chuyển hướng dựa theo role
            console.log("Vai trò người dùng:", userInfo.roleName);
            if (userInfo.roleName === 'ADMIN' || userInfo.roleName === 'SELLER') {
                console.log("Đang điều hướng đến trang admin...");
                this.props.history.push('/admin');
            } else {
                console.log("Đang điều hướng đến:", from.pathname);
                this.props.history.push(from.pathname);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            this.setState({
                error: error.response?.data?.message || 'Đăng nhập thất bại, vui lòng thử lại.',
                loading: false
            });
        }
    }

    render() {
        const { email, password, error, loading } = this.state;

        return (
            <div>
                <div className="sign-in-page">
                    <div className="sign-in-page-container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-6 col-md-8 sign-in-area-container">
                                <div className="sign-in-area-wrap">
                                    <div className="sign-in-area">
                                        <h3>Đăng nhập</h3>
                                        <form className="signin-form" onSubmit={this.handleSubmit}>
                                            <div className="single-input-wrap">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder="Email của bạn"
                                                    value={email}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="single-input-wrap">
                                                <label htmlFor="password">Mật khẩu</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    placeholder="Mật khẩu"
                                                    value={password}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            {this.props.location.state?.message && (
                                                <div className="alert alert-info">
                                                    {this.props.location.state.message}
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="single-category-product-info">
                                                    <input type="checkbox" className="custom-checkbox" id="rmb" />
                                                    <div className="details ml-2"><p>Ghi nhớ</p></div>
                                                </div>
                                                <Link className="forget-pass" to="/reset-password">Quên mật khẩu?</Link>
                                            </div>
                                            <button
                                                className="btn btn-base w-100"
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
                                            </button>
                                            {/* <p>Hoặc đăng nhập với</p>
                                            <div className="row social-login-row">
                                                <div className="col-6">
                                                    <button className="btn btn-g w-100" type="button">Google</button>
                                                </div>
                                                <div className="col-6">
                                                    <button className="btn btn-f w-100" type="button">Facebook</button>
                                                </div>
                                            </div> */}
                                            <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default withRouter(SignIn);