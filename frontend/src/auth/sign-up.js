import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/global-components/navbar-v2';
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
            error: '',
            success: '',
            loading: false
        };
    }

    handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [e.target.id]: value,
            error: ''
        });
    }

    validateForm = () => {
        const { fullName, email, password, confirmPassword, agreeTerms } = this.state;

        if (!fullName || !email || !password || !confirmPassword) {
            this.setState({ error: 'Vui lòng điền đầy đủ thông tin' });
            return false;
        }

        if (password !== confirmPassword) {
            this.setState({ error: 'Mật khẩu xác nhận không khớp' });
            return false;
        }

        if (!agreeTerms) {
            this.setState({ error: 'Vui lòng đồng ý với điều khoản của chúng tôi' });
            return false;
        }

        return true;
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setState({ loading: true, error: '', success: '' });

        try {
            const response = await axios.post('/api/auth/register', {
                fullName: this.state.fullName,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            });

            this.setState({
                success: 'Đăng ký thành công! Vui lòng đăng nhập.',
                loading: false,
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                agreeTerms: false
            });

            // Chuyển đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);

        } catch (error) {
            this.setState({
                error: error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.',
                loading: false
            });
        }
    }

    render() {
        const { fullName, email, password, confirmPassword, agreeTerms, error, success, loading } = this.state;

        return (
            <div>
                <div className="sign-in-page">
                    <div className="sign-in-page-container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-6 col-md-8 sign-in-area-container">
                                <div className="sign-in-area-wrap">
                                    <div className="sign-in-area">
                                        <h3>Đăng ký tài khoản</h3>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        {success && <div className="alert alert-success">{success}</div>}
                                        <form className="signin-form" onSubmit={this.handleSubmit}>
                                            <div className="single-input-wrap">
                                                <label htmlFor="fullName">Họ và tên</label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    placeholder="Họ và tên"
                                                    value={fullName}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
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
                                            <div className="single-input-wrap">
                                                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    placeholder="Xác nhận mật khẩu"
                                                    value={confirmPassword}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="single-category-product-info">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-checkbox"
                                                        id="agreeTerms"
                                                        checked={agreeTerms}
                                                        onChange={this.handleChange}
                                                    />
                                                    <div className="details ml-2">
                                                        <p>Tôi đồng ý với các điều khoản</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-base w-100"
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                                            </button>
                                            {/* <p>Hoặc đăng ký với</p>
                                            <div className="row social-login-row">
                                                <div className="col-6">
                                                    <button className="btn btn-g w-100" type="button">Google</button>
                                                </div>
                                                <div className="col-6">
                                                    <button className="btn btn-f w-100" type="button">Facebook</button>
                                                </div>
                                            </div> */}
                                            <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp