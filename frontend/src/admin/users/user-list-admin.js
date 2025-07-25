import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../utils/axiosConfig';
import '../css/product-list-admin.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('userId');
  const [sortDir, setSortDir] = useState('asc');
  const [toasts, setToasts] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const history = useHistory();

  // Danh sách trường có thể sắp xếp
  const sortableFields = {
    'userId': 'ID',
    'email': 'Email',
    'fullName': 'Họ tên',
    'createdAt': 'Ngày tạo',
    'isDeleted': 'Trạng thái'
  };

  // Danh sách roles
  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Seller' },
    { id: 3, name: 'User' }
  ];

  const showToast = (message, type = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      type,
      show: true
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id));
    }, 2000);
  };

  // Lấy tất cả người dùng với phân trang
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/admin/users/paged', {
        params: {
          pageNo: currentPage,
          pageSize,
          sortBy,
          sortDir,
          searchKeyword: activeSearchTerm,
          roleId: selectedRoleId
        }
      });
      
      console.log('Đã gọi API getAllUsersPaged:', response);
      
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setUsers(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCurrentPage(pageData.pageNo);
      } else {
        setUsers([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, activeSearchTerm, selectedRoleId]);

  // Khi component được tải
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Xử lý khi người dùng nhấn Enter trong ô tìm kiếm
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearch = () => {
    // Cập nhật từ khóa tìm kiếm hiện tại
    setActiveSearchTerm(searchTerm);
    // Đặt lại trang về 0 và gọi API
    setCurrentPage(0);
    // fetchAllUsers() sẽ được gọi tự động do useEffect khi activeSearchTerm thay đổi
  };

  // Xử lý thay đổi role
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSelectedRoleId(value ? parseInt(value) : null);
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  // Xử lý thay đổi trong ô tìm kiếm - chỉ cập nhật state, không gọi API
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý sort khi click vào header
  const handleSort = (field) => {
    // Nếu đang sort theo field này, đổi chiều sort
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // Nếu sort theo field mới, mặc định sort asc
      setSortBy(field);
      setSortDir('asc');
    }
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  // Thêm xử lý thay đổi kích thước trang
  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi số lượng hiển thị
  };

  // Hiển thị biểu tượng sắp xếp
  const renderSortIcon = (field) => {
    if (sortBy !== field) return <i className="fa fa-sort text-muted"></i>;
    return sortDir === 'asc' ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>;
  };

  const openConfirmModal = (user) => {
    // Nếu là Admin và đang hoạt động, không được khóa
    if (user.roleName === 'Admin' && !user.isDeleted) {
      showToast('Không thể vô hiệu hóa tài khoản Admin', 'error');
      return;
    }

    setSelectedUser(user);
    setConfirmAction(user.isDeleted ? 'enable' : 'delete');
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    
    try {
      if (confirmAction === 'delete') {
        await axios.delete(`/api/admin/users/${selectedUser.userId}`);
        showToast('Đã vô hiệu hóa tài khoản thành công');
      } else {
        await axios.put(`/api/admin/users/${selectedUser.userId}/enable`);
        showToast('Đã mở khóa tài khoản thành công');
      }
      
      closeConfirmModal();
      fetchAllUsers();
    } catch (err) {
      console.error('Lỗi khi thay đổi trạng thái người dùng:', err);
      if (err.response && err.response.data && err.response.data.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Không thể thay đổi trạng thái người dùng', 'error');
      }
      closeConfirmModal();
    }
  };

  // Xóa hàm cũ và thay bằng hàm mở modal
  const handleToggleUserStatus = (userId, isAdmin, isDeleted) => {
    const user = users.find(u => u.userId === userId);
    openConfirmModal(user);
  };

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Tạo URL ảnh đầy đủ
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `${process.env.PUBLIC_URL}/assets/img/user/default-avatar.jpg`;
    
    const baseUrl = axios.defaults.baseURL || 'http://localhost:8082';
    // Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / để tránh lặp
    const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    return `${baseUrl}/${imagePath}`;
  };

  // Hiển thị loading
  if (loading && users.length === 0) {
    return (
      <div className="admin-product-list-page">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quản lý Người dùng</h3>
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            <div className="text-center p-5">
              <div className="admin-spinner"></div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-list-page">
      {/* Hiển thị nhiều toast */}
      <div className="admin-toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`admin-toast ${toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {showConfirmModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h6 className='mb-0'>Xác nhận thay đổi trạng thái</h6>
              <button className="admin-modal-close" onClick={closeConfirmModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Bạn có chắc chắn muốn {confirmAction === 'delete' ? 'vô hiệu hóa' : 'mở khóa'} tài khoản{' '}
                <strong>{selectedUser?.email}</strong> không?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={closeConfirmModal}>
                Hủy
              </button>
              <button 
                className={`admin-btn ${confirmAction === 'delete' ? 'admin-btn-danger' : 'admin-btn-success'}`}
                onClick={handleConfirmStatusChange}
              >
                {confirmAction === 'delete' ? 'Vô hiệu hóa' : 'Mở khóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card-header">
        <h3 className="admin-card-title">Quản lý Người dùng</h3>
        <div className="d-flex">
          <div className="search-container mr-3 d-flex">
            <input
              type="text"
              className="admin-form-control"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              style={{ minWidth: '250px', borderTopRightRadius: '0', borderBottomRightRadius: '0', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' }}
            />
            <button 
              className="admin-btn admin-btn-secondary" 
              onClick={handleSearch}
              style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          {/* Filter và tìm kiếm */}
          <div className="row">
            <div className="col-md-3 mb-3">
              <select 
                className="admin-form-control"
                value={selectedRoleId || ''}
                onChange={handleRoleChange}
              >
                <option value="">Tất cả vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex align-items-center">
                <select
                  className="admin-form-control"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="10">10 người dùng</option>
                  <option value="20">20 người dùng</option>
                  <option value="30">30 người dùng</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="admin-alert admin-alert-danger">{error}</div>}

          {loading && (
            <div className="text-center p-5">
              <div className="admin-spinner"></div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          )}

          {!loading && users.length === 0 ? (
            <div className="text-center p-5">
              <p>Không tìm thấy người dùng nào.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="admin-table product-table">
                  <thead>
                    <tr>
                      <th className="text-center sortable" onClick={() => handleSort('userId')}>
                        ID {renderSortIcon('userId')}
                      </th>
                      <th className="text-center">Ảnh</th>
                      <th className="sortable" onClick={() => handleSort('email')}>
                        Email {renderSortIcon('email')}
                      </th>
                      <th className="sortable" onClick={() => handleSort('fullName')}>
                        Họ tên {renderSortIcon('fullName')}
                      </th>
                      <th>Số điện thoại</th>
                      <th className="text-center">Quyền</th>
                      <th className="text-center sortable" onClick={() => handleSort('createdAt')}>
                        Ngày tạo {renderSortIcon('createdAt')}
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('isDeleted')}>
                        Trạng thái {renderSortIcon('isDeleted')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.userId}>
                        <td className="text-center">{user.userId}</td>
                        <td className="text-center image-cell">
                          <Link to={`/admin/users/${user.userId}`}>
                            <div className="product-thumbnail">
                              <img 
                                src={getImageUrl(user.avatar)} 
                                alt={user.fullName} 
                                className="product-image"
                              />
                            </div>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/admin/users/${user.userId}`} className="product-name">
                            {user.email}
                          </Link>
                        </td>
                        <td>{user.fullName || '-'}</td>
                        <td>{user.phoneNumber || '-'}</td>
                        <td className="text-center">{user.roleName || '-'}</td>
                        <td className="text-center">{formatDate(user.createdAt)}</td>
                        <td className="text-center">
                          <span 
                            className={`admin-badge ${!user.isDeleted ? 'admin-badge-success' : 'admin-badge-danger'}`}
                            onClick={() => handleToggleUserStatus(user.userId, user.roleName === 'Admin', user.isDeleted)}
                            style={{ cursor: 'pointer' }}
                            title={!user.isDeleted ? 
                              (user.roleName === 'Admin' ? 'Tài khoản Admin không thể vô hiệu hóa' : 'Click để vô hiệu hóa tài khoản') : 
                              'Tài khoản đã bị vô hiệu hóa'}
                          >
                            {!user.isDeleted ? 'Hoạt động' : 'Đã khóa'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <nav className="admin-pagination-wrapper mt-4 d-flex justify-content-center">
                  <ul className="admin-pagination">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
