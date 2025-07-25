-- Cấu hình charset và collation
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu cho bảng brands
INSERT INTO brands (brand_name, image, description)
VALUES 
    ('Apple', 'https://example.com/logos/apple.png', N'Công ty công nghệ hàng đầu thế giới'),
    ('Dell', 'https://example.com/logos/dell.png', N'Nhà sản xuất máy tính và thiết bị điện tử'),
    ('HP', 'https://example.com/logos/hp.png', N'Hewlett-Packard - Công ty công nghệ đa quốc gia'),
    ('Lenovo', 'https://example.com/logos/lenovo.png', N'Nhà sản xuất máy tính hàng đầu thế giới'),
    ('Asus', 'https://example.com/logos/asus.png', N'Công ty công nghệ và điện tử Đài Loan'),
    ('Acer', 'https://example.com/logos/acer.png', N'Nhà sản xuất thiết bị điện tử và máy tính'),
    ('MSI', 'https://example.com/logos/msi.png', N'Nhà sản xuất phần cứng và thiết bị gaming'),
    ('Razer', 'https://example.com/logos/razer.png', N'Thương hiệu gaming cao cấp'),
    ('Microsoft', 'https://example.com/logos/microsoft.png', N'Công ty phần mềm và phần cứng hàng đầu'),
    ('Samsung', 'https://example.com/logos/samsung.png', N'Tập đoàn công nghệ đa quốc gia'),
    ('Toshiba', 'https://example.com/logos/toshiba.png', N'Công ty điện tử Nhật Bản'),
    ('Sony', 'https://example.com/logos/sony.png', N'Tập đoàn công nghệ và giải trí'),
    ('JBL', 'https://example.com/logos/jbl.png', N'Thương hiệu âm thanh nổi tiếng thế giới'),
    ('Logitech', 'https://example.com/logos/logitech.png', N'Nhà sản xuất thiết bị ngoại vi máy tính');

-- Thêm dữ liệu mẫu cho bảng categories
-- Danh mục cha: Laptop
INSERT INTO categories (category_name)
VALUES (N'Laptop');

-- Lấy ID của danh mục Laptop
SET @laptop_id = LAST_INSERT_ID();

-- Danh mục con của Laptop
INSERT INTO categories (category_name, parent_id)
VALUES 
    (N'Laptop Cao Cấp', @laptop_id),
    (N'Laptop Văn Phòng', @laptop_id),
    (N'Laptop Gaming', @laptop_id),
    (N'Laptop Đồ Họa', @laptop_id);

-- Danh mục cha: Tai Nghe
INSERT INTO categories (category_name)
VALUES (N'Tai Nghe');

-- Lấy ID của danh mục Tai Nghe
SET @headphone_id = LAST_INSERT_ID();

-- Danh mục con của Tai Nghe
INSERT INTO categories (category_name, parent_id)
VALUES 
    (N'Tai Nghe Có Dây', @headphone_id),
    (N'Tai Nghe Không Dây', @headphone_id);

-- Lấy ID của một số danh mục con để sử dụng sau này
SELECT @gaming_laptop_id := category_id FROM categories WHERE category_name = N'Laptop Gaming';
SELECT @wireless_headphone_id := category_id FROM categories WHERE category_name = N'Tai Nghe Không Dây';

-- Tạo dữ liệu mẫu cho bảng attributes (thuộc tính sản phẩm)
INSERT INTO attributes (attribute_name, attribute_unit)
VALUES
    (N'CPU', NULL),
    (N'RAM', 'GB'),
    (N'Ổ cứng', 'GB'),
    (N'Màn hình', 'inch'),
    (N'Card đồ họa', NULL),
    (N'Pin', 'mAh'),
    (N'Hệ điều hành', NULL),
    (N'Cân nặng', 'kg'),
    (N'Màu sắc', NULL),
    (N'Kết nối', NULL),
    (N'Tần số đáp ứng', 'Hz'),
    (N'Trở kháng', 'Ohm'),
    (N'Kích thước driver', 'mm');

-- Liên kết các thuộc tính với danh mục Laptop Gaming
INSERT INTO category_attributes (category_id, attribute_id)
SELECT @gaming_laptop_id, attribute_id FROM attributes
WHERE attribute_name IN (N'CPU', N'RAM', N'Ổ cứng', N'Màn hình', N'Card đồ họa', N'Pin', N'Hệ điều hành', N'Cân nặng', N'Màu sắc');

-- Liên kết các thuộc tính với danh mục Tai Nghe Không Dây
INSERT INTO category_attributes (category_id, attribute_id)
SELECT @wireless_headphone_id, attribute_id FROM attributes
WHERE attribute_name IN (N'Kết nối', N'Tần số đáp ứng', N'Trở kháng', N'Kích thước driver', N'Pin', N'Màu sắc');

-- ========================= THÊM DỮ LIỆU SẢN PHẨM =========================

-- Lấy ID của một số brand để sử dụng
SELECT @dell_id := brand_id FROM brands WHERE brand_name = 'Dell';
SELECT @asus_id := brand_id FROM brands WHERE brand_name = 'Asus';
SELECT @msi_id := brand_id FROM brands WHERE brand_name = 'MSI';
SELECT @razer_id := brand_id FROM brands WHERE brand_name = 'Razer';
SELECT @jbl_id := brand_id FROM brands WHERE brand_name = 'JBL';

-- Lấy ID của các thuộc tính để sử dụng sau
SELECT @cpu_id := attribute_id FROM attributes WHERE attribute_name = N'CPU';
SELECT @ram_id := attribute_id FROM attributes WHERE attribute_name = N'RAM';
SELECT @storage_id := attribute_id FROM attributes WHERE attribute_name = N'Ổ cứng';
SELECT @display_id := attribute_id FROM attributes WHERE attribute_name = N'Màn hình';
SELECT @graphics_id := attribute_id FROM attributes WHERE attribute_name = N'Card đồ họa';
SELECT @battery_id := attribute_id FROM attributes WHERE attribute_name = N'Pin';
SELECT @os_id := attribute_id FROM attributes WHERE attribute_name = N'Hệ điều hành';
SELECT @weight_id := attribute_id FROM attributes WHERE attribute_name = N'Cân nặng';
SELECT @color_id := attribute_id FROM attributes WHERE attribute_name = N'Màu sắc';
SELECT @connectivity_id := attribute_id FROM attributes WHERE attribute_name = N'Kết nối';
SELECT @frequency_id := attribute_id FROM attributes WHERE attribute_name = N'Tần số đáp ứng';
SELECT @impedance_id := attribute_id FROM attributes WHERE attribute_name = N'Trở kháng';
SELECT @driver_id := attribute_id FROM attributes WHERE attribute_name = N'Kích thước driver';

-- Thêm dữ liệu mẫu cho sản phẩm LAPTOP GAMING
INSERT INTO products (product_name, category_id, brand_id, price, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES
    (N'MSI GF63 Thin', @gaming_laptop_id, @msi_id, 22990000, 
    N'Laptop gaming phổ thông với hiệu năng mạnh mẽ, thiết kế mỏng nhẹ phù hợp cho game thủ di chuyển nhiều', 
    25, true, NOW(), NOW()),
    
    (N'ASUS TUF Gaming F15', @gaming_laptop_id, @asus_id, 24990000, 
    N'Laptop gaming bền bỉ với chuẩn quân đội, hiệu năng cao, tản nhiệt hiệu quả cho các game nặng', 
    18, true, NOW(), NOW()),
    
    (N'Dell G15 5515', @gaming_laptop_id, @dell_id, 23490000, 
    N'Laptop gaming hiệu năng cao với thiết kế đơn giản, hệ thống tản nhiệt tối ưu', 
    15, true, NOW(), NOW()),
    
    (N'Razer Blade 15', @gaming_laptop_id, @razer_id, 59990000, 
    N'Laptop gaming cao cấp với thiết kế unibody, hiệu năng vượt trội, màn hình 144Hz', 
    8, true, NOW(), NOW());

-- Lưu ID của các sản phẩm để sử dụng
SELECT @msi_gf63_id := product_id FROM products WHERE product_name = N'MSI GF63 Thin';
SELECT @asus_tuf_id := product_id FROM products WHERE product_name = N'ASUS TUF Gaming F15';
SELECT @dell_g15_id := product_id FROM products WHERE product_name = N'Dell G15 5515';
SELECT @razer_blade_id := product_id FROM products WHERE product_name = N'Razer Blade 15';

-- Thêm dữ liệu mẫu cho sản phẩm TAI NGHE
INSERT INTO products (product_name, category_id, brand_id, price, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES 
    (N'JBL Tune 510BT', @wireless_headphone_id, @jbl_id, 1290000, 
    N'Tai nghe không dây với âm thanh JBL Pure Bass, thời lượng pin lên đến 40 giờ', 
    30, true, NOW(), NOW()),
    
    (N'JBL Quantum 800', @wireless_headphone_id, @jbl_id, 4990000, 
    N'Tai nghe gaming không dây với công nghệ JBL QuantumSURROUND, khử tiếng ồn chủ động', 
    12, true, NOW(), NOW());

-- Lưu ID của các sản phẩm TAI NGHE để sử dụng
SELECT @jbl_tune_id := product_id FROM products WHERE product_name = N'JBL Tune 510BT';
SELECT @jbl_quantum_id := product_id FROM products WHERE product_name = N'JBL Quantum 800';

-- =============== THÊM DỮ LIỆU CHO THUỘC TÍNH SẢN PHẨM ===============

-- Thêm thuộc tính cho MSI GF63
INSERT INTO product_attribute_values (product_id, attribute_id, value)
VALUES
    (@msi_gf63_id, @cpu_id, N'Intel Core i5-11400H'),
    (@msi_gf63_id, @ram_id, N'8GB DDR4 3200MHz'),
    (@msi_gf63_id, @storage_id, N'512GB SSD NVMe PCIe Gen3'),
    (@msi_gf63_id, @display_id, N'15.6 inch FHD (1920*1080), 144Hz, IPS'),
    (@msi_gf63_id, @graphics_id, N'NVIDIA GeForce GTX 1650 4GB GDDR6'),
    (@msi_gf63_id, @battery_id, N'3 cell, 51Whr'),
    (@msi_gf63_id, @os_id, N'Windows 11 Home'),
    (@msi_gf63_id, @weight_id, N'1.86 kg'),
    (@msi_gf63_id, @color_id, N'Đen');

-- Thêm thuộc tính cho ASUS TUF
INSERT INTO product_attribute_values (product_id, attribute_id, value)
VALUES
    (@asus_tuf_id, @cpu_id, N'Intel Core i7-12700H'),
    (@asus_tuf_id, @ram_id, N'16GB DDR4 3200MHz'),
    (@asus_tuf_id, @storage_id, N'512GB SSD NVMe PCIe Gen4'),
    (@asus_tuf_id, @display_id, N'15.6 inch FHD (1920*1080), 144Hz, IPS'),
    (@asus_tuf_id, @graphics_id, N'NVIDIA GeForce RTX 3060 6GB GDDR6'),
    (@asus_tuf_id, @battery_id, N'4 cell, 90Whr'),
    (@asus_tuf_id, @os_id, N'Windows 11 Home'),
    (@asus_tuf_id, @weight_id, N'2.2 kg'),
    (@asus_tuf_id, @color_id, N'Xám Graphite');

-- Thêm thuộc tính cho JBL Tune 510BT
INSERT INTO product_attribute_values (product_id, attribute_id, value)
VALUES
    (@jbl_tune_id, @connectivity_id, N'Bluetooth 5.0'),
    (@jbl_tune_id, @frequency_id, N'20Hz - 20kHz'),
    (@jbl_tune_id, @battery_id, N'450mAh, 40 giờ phát nhạc'),
    (@jbl_tune_id, @color_id, N'Đen'),
    (@jbl_tune_id, @driver_id, N'32mm');

-- Thêm thuộc tính cho JBL Quantum 800
INSERT INTO product_attribute_values (product_id, attribute_id, value)
VALUES
    (@jbl_quantum_id, @connectivity_id, N'Bluetooth 5.0, 2.4GHz wireless'),
    (@jbl_quantum_id, @frequency_id, N'20Hz - 40kHz'),
    (@jbl_quantum_id, @impedance_id, N'32 Ohm'),
    (@jbl_quantum_id, @battery_id, N'1300mAh, 14 giờ phát nhạc'),
    (@jbl_quantum_id, @color_id, N'Đen'),
    (@jbl_quantum_id, @driver_id, N'50mm');

-- ================ THÊM DỮ LIỆU CHO HÌNH ẢNH SẢN PHẨM ================

-- Thêm hình ảnh cho MSI GF63
INSERT INTO product_images (product_id, image_url)
VALUES
    (@msi_gf63_id, 'https://example.com/images/products/msi_gf63_1.jpg'),
    (@msi_gf63_id, 'https://example.com/images/products/msi_gf63_2.jpg'),
    (@msi_gf63_id, 'https://example.com/images/products/msi_gf63_3.jpg');

-- Thêm hình ảnh cho ASUS TUF
INSERT INTO product_images (product_id, image_url)
VALUES
    (@asus_tuf_id, 'https://example.com/images/products/asus_tuf_f15_1.jpg'),
    (@asus_tuf_id, 'https://example.com/images/products/asus_tuf_f15_2.jpg'),
    (@asus_tuf_id, 'https://example.com/images/products/asus_tuf_f15_3.jpg');

-- Thêm hình ảnh cho Dell G15
INSERT INTO product_images (product_id, image_url)
VALUES
    (@dell_g15_id, 'https://example.com/images/products/dell_g15_1.jpg'),
    (@dell_g15_id, 'https://example.com/images/products/dell_g15_2.jpg'),
    (@dell_g15_id, 'https://example.com/images/products/dell_g15_3.jpg');

-- Thêm hình ảnh cho Razer Blade
INSERT INTO product_images (product_id, image_url)
VALUES
    (@razer_blade_id, 'https://example.com/images/products/razer_blade_1.jpg'),
    (@razer_blade_id, 'https://example.com/images/products/razer_blade_2.jpg'),
    (@razer_blade_id, 'https://example.com/images/products/razer_blade_3.jpg');

-- Thêm hình ảnh cho JBL Tune 510BT
INSERT INTO product_images (product_id, image_url)
VALUES
    (@jbl_tune_id, 'https://example.com/images/products/jbl_tune_510bt_1.jpg'),
    (@jbl_tune_id, 'https://example.com/images/products/jbl_tune_510bt_2.jpg');

-- Thêm hình ảnh cho JBL Quantum 800
INSERT INTO product_images (product_id, image_url)
VALUES
    (@jbl_quantum_id, 'https://example.com/images/products/jbl_quantum_800_1.jpg'),
    (@jbl_quantum_id, 'https://example.com/images/products/jbl_quantum_800_2.jpg'),
    (@jbl_quantum_id, 'https://example.com/images/products/jbl_quantum_800_3.jpg');

-- ====================== THÊM DỮ LIỆU CHO ROLE VÀ USER ======================

-- Thêm dữ liệu mẫu cho bảng roles
INSERT INTO roles (role_name) VALUES
    ('ADMIN'),
    ('SELLER'),
    ('USER');

-- Lấy ID của các roles
SELECT @admin_role_id := role_id FROM roles WHERE role_name = 'ADMIN';
SELECT @seller_role_id := role_id FROM roles WHERE role_name = 'SELLER';
SELECT @user_role_id := role_id FROM roles WHERE role_name = 'USER';

-- Thêm dữ liệu mẫu cho bảng users (mật khẩu là 'password123' được mã hóa bằng BCrypt)
-- Lưu ý: Giá trị hash '$2a$10$...' chỉ là ví dụ, bạn nên tạo hash thực tế từ passwordEncoder
INSERT INTO users (email, password_hash, full_name, phone_number, address, role_id, created_at, updated_at, is_deleted)
VALUES 
    ('admin@example.com', '$2a$10$3g.gR9yXUgkKzQz4Y7QhLOFhMEe..WNt./J.P4nZ6G9.W3XWum4P2', N'Quản Trị Viên', '0900000001', N'123 Admin St, HQ', @admin_role_id, NOW(), NOW(), false),
    ('seller@example.com', '$2a$10$3g.gR9yXUgkKzQz4Y7QhLOFhMEe..WNt./J.P4nZ6G9.W3XWum4P2', N'Người Bán Hàng', '0900000002', N'456 Seller Ave, DN', @seller_role_id, NOW(), NOW(), false),
    ('user@example.com', '$2a$10$3g.gR9yXUgkKzQz4Y7QhLOFhMEe..WNt./J.P4nZ6G9.W3XWum4P2', N'Khách Hàng A', '0900000003', N'789 User Rd, HN', @user_role_id, NOW(), NOW(), false),
    ('disabled@example.com', '$2a$10$3g.gR9yXUgkKzQz4Y7QhLOFhMEe..WNt./J.P4nZ6G9.W3XWum4P2', N'Tài Khoản Vô Hiệu', '0900000004', N'101 Disabled Ln, SG', @user_role_id, NOW(), NOW(), true); -- User bị xóa mềm 