import axios from 'axios';

// Biến để kiểm soát nếu đang refresh token
let isRefreshing = false;
// Hàng đợi các request đang chờ refresh token
let failedQueue = [];

// Xử lý các request đang đợi sau khi refresh token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Chuyển hướng người dùng đến trang login
const redirectToLogin = () => {
  // Đảm bảo rằng đường dẫn hiện tại không phải là /login để tránh reload vòng lặp
  if (window.location.pathname !== '/login') {
    console.log('Redirecting to login page');
    window.location.href = '/login';
  }
};

// Hàm cấu hình interceptors cho axios
const setupAxiosInterceptors = () => {
  // Thiết lập URL cơ sở cho axios
  axios.defaults.baseURL = 'http://localhost:8082';
  
  // Interceptor cho request
  axios.interceptors.request.use(
    config => {
      // Trích xuất token từ localStorage
      const token = localStorage.getItem('accessToken');
      
      // Log để debug
      console.log(`Request to ${config.url}`, { method: config.method });
      
      // Thêm token vào header nếu có
      if (token) {
        // Log để debug
        console.log('Using token:', token.substring(0, 20) + '...');
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No token available');
        
        // Nếu không có token và không phải là request login hoặc register
        // có thể chuyển hướng người dùng đến trang login nếu truy cập vào các API bảo mật
        const nonAuthUrls = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh-token', '/api/products', '/api/categories'];
        const isAuthRequired = !nonAuthUrls.some(url => config.url.includes(url));
        
        if (isAuthRequired && window.location.pathname.startsWith('/admin')) {
          redirectToLogin();
          return Promise.reject(new Error('Authentication required'));
        }
      }
      
      return config;
    },
    error => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor cho response
  axios.interceptors.response.use(
    response => response,
    async error => {
      // Debug thông tin lỗi
      console.error('Response error:', error.response?.status, error.config?.url);
      
      const originalRequest = error.config;
      
      // Nếu lỗi không phải 401 hoặc request đã được thử lại, return error
      if (!error.response || error.response.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }
      
      // Nếu là request refresh-token hoặc logout gây ra lỗi, đăng xuất user
      if (originalRequest.url === '/api/auth/refresh-token' || originalRequest.url === '/api/auth/logout') {
        console.log('Failed to refresh token or logout error, logging out');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        redirectToLogin();
        return Promise.reject(error);
      }
      
      // Đánh dấu request đã thử lại
      originalRequest._retry = true;
      
      // Nếu đang refresh token, thêm request hiện tại vào hàng đợi
      if (isRefreshing) {
        console.log('Another refresh in progress, queuing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            console.log('Using new token from queue');
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      isRefreshing = true;
      console.log('Starting token refresh');
      
      // Lấy refresh token từ localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.log('No refresh token available');
        // Không có refresh token, chuyển đến trang đăng nhập
        redirectToLogin();
        return Promise.reject(error);
      }
      
      try {
        // Gọi API refresh token
        console.log('Calling refresh token API');
        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken
        }, {
          headers: {
            'Authorization': null // Xóa header authorization cho request này
          },
          _retry: true
        });
        
        // Lấy token mới từ response
        console.log('Received new tokens');
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Lưu token mới vào localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken || refreshToken);
        
        // Cập nhật header cho axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Cập nhật header cho request ban đầu
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Xử lý hàng đợi
        console.log('Processing queued requests');
        processQueue(null, accessToken);
        
        // Trả về request ban đầu với token mới
        return axios(originalRequest);
      } catch (err) {
        // Xử lý lỗi refresh token
        console.error('Failed to refresh token:', err);
        processQueue(err, null);
        
        // Xóa thông tin đăng nhập và chuyển đến trang đăng nhập
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Chuyển đến trang đăng nhập
        redirectToLogin();
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );
};

// Tự động gọi hàm này khi import module
setupAxiosInterceptors();

export default setupAxiosInterceptors; 