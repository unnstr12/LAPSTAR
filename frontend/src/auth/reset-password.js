import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/global-components/navbar-v2';
import AuthContext from '../context/AuthContext';

class ResetPassword extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        
        // Kiểm tra xem có token trong query params không
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get('token');
        
        this.state = {
            email: '',
            newPassword: '',
            confirmPassword: '',
            token: token || '',
            error: '',
            success: '',
            loading: false,
            step: token ? 'reset' : 'request' // Nếu có token thì hiển thị form reset, ngược lại hiển thị form request
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            error: ''
        });
    }

    handleRequestReset = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: '', success: '' });

        try {
            const response = await axios.post('/api/auth/forgot-password', {
                email: this.state.email
            });

            console.log("Forgot password response:", response.data);

            this.setState({
                success: 'Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
                loading: false
            });
        } catch (error) {
            console.error("Lỗi khi yêu cầu đặt lại mật khẩu:", error);
            this.setState({
                error: error.response?.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.',
                loading: false
            });
        }
    }

    handleResetPassword = async (e) => {
        e.preventDefault();
        
        // Kiểm tra mật khẩu và mật khẩu xác nhận
        if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ error: 'Mật khẩu và mật khẩu xác nhận không khớp.' });
            return;
        }
        
        this.setState({ loading: true, error: '', success: '' });

        try {
            const response = await axios.post('/api/auth/reset-password', {
                token: this.state.token,
                newPassword: this.state.newPassword
            });

            console.log("Reset password response:", response.data);

            // Sử dụng context để đăng nhập với response hoàn chỉnh nếu có
            if (response.data.data) {
                this.context.login(response.data);
                
                // Lấy thông tin người dùng từ response
                const userInfo = response.data.data.user;
                
                // Chuyển hướng dựa theo role
                if (userInfo.roleName === 'ADMIN' || userInfo.roleName === 'SELLER') {
                    this.props.history.push('/admin');
                } else {
                    this.props.history.push('/');
                }
            } else {
                this.setState({
                    success: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.',
                    loading: false
                });
                
                // Chuyển hướng đến trang đăng nhập sau 2 giây
                setTimeout(() => {
                    this.props.history.push('/login');
                }, 2000);
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            this.setState({
                error: error.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.',
                loading: false
            });
        }
    }

    render() {
        const { email, newPassword, confirmPassword, error, success, loading, step } = this.state;

        return (
            <div>
                <div className="sign-in-page">
                    <div className="sign-in-page-container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-6 col-md-8 sign-in-area-container">
                                <div className="sign-in-area-wrap">
                                    <div className="sign-in-area">
                                        <h3>{step === 'request' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}</h3>
                                        
                                        {step === 'request' ? (
                                            <form className="signin-form" onSubmit={this.handleRequestReset}>
                                                <div className="single-input-wrap">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        placeholder="Nhập email của bạn"
                                                        value={email}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </div>
                                                {error && <div className="alert alert-danger">{error}</div>}
                                                {success && <div className="alert alert-success">{success}</div>}
                                                <button
                                                    className="btn btn-base w-100"
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Đang xử lý...' : 'Gửi yêu cầu đặt lại mật khẩu'}
                                                </button>
                                                <p className="mt-3">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                                                <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                                            </form>
                                        ) : (
                                            <form className="signin-form" onSubmit={this.handleResetPassword}>
                                                <div className="single-input-wrap">
                                                    <label htmlFor="newPassword">Mật khẩu mới</label>
                                                    <input
                                                        type="password"
                                                        id="newPassword"
                                                        placeholder="Nhập mật khẩu mới"
                                                        value={newPassword}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="single-input-wrap">
                                                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        placeholder="Nhập lại mật khẩu mới"
                                                        value={confirmPassword}
                                                        onChange={this.handleChange}
                                                        required
                                                    />
                                                </div>
                                                {error && <div className="alert alert-danger">{error}</div>}
                                                {success && <div className="alert alert-success">{success}</div>}
                                                <button
                                                    className="btn btn-base w-100"
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                                </button>
                                                <p className="mt-3">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ResetPassword);
