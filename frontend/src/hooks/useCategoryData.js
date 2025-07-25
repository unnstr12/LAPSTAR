import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook để tải và quản lý dữ liệu danh mục
const useCategoryData = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryMap, setCategoryMap] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/categories');
                if (response.data && response.data.data) {
                    setCategories(response.data.data);
                    
                    // Tạo mapping từ slug đến ID và tên danh mục
                    const slugMap = {};
                    
                    // Hàm đệ quy để xử lý các danh mục con
                    const processCategory = (category) => {
                        // Tạo slug từ tên danh mục
                        const slug = createSlug(category.categoryName);
                        
                        // Lưu thông tin mapping
                        slugMap[slug] = {
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
                    response.data.data.forEach(category => processCategory(category));
                    
                    setCategoryMap(slugMap);
                }
            } catch (err) {
                console.error('Lỗi khi tải danh mục:', err);
                setError('Không thể tải danh mục. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategories();
    }, []);

    // Hàm tạo slug từ chuỗi tiếng Việt
    const createSlug = (str) => {
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

    // Lấy thông tin danh mục từ slug
    const getCategoryFromSlug = (slug) => {
        return categoryMap[slug] || null;
    };

    // Lấy danh sách các danh mục gốc (không có parent)
    const getRootCategories = () => {
        return categories.filter(category => !category.parentId);
    };

    // Chuyển đổi từ tên danh mục sang slug
    const getSlugFromName = (name) => {
        return createSlug(name);
    };

    return {
        categories,
        loading,
        error,
        getCategoryFromSlug,
        getRootCategories,
        getSlugFromName,
        categoryMap
    };
};

export default useCategoryData; 