-- Tạo 20 đơn hàng mẫu từ ngày 1/4/2025 đến 30/4/2025
-- OrderId bắt đầu từ 5

-- Đơn hàng 5 - PENDING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at)
VALUES (5, NULL, 'customer1@gmail.com', 'Nguyễn Văn An', '0901234567', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 
        '123 Đường ABC', 'PENDING', 'CASH', 'NOT_PAID', NULL, NULL, 55000000.00, 0.00, 55000000.00, 
        'Giao hàng giờ hành chính', '2025-04-01 09:30:00', '2025-04-01 09:30:00', '2025-04-01 09:30:00');

-- Đơn hàng 6 - CONFIRMED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at)
VALUES (6, NULL, 'customer2@gmail.com', 'Trần Thị Bình', '0912345678', 'TP.HCM', 'Quận 1', 'Phường Bến Nghé', 
        '456 Đường XYZ', 'CONFIRMED', 'VN_PAY', 'PAID', NULL, NULL, 48000000.00, 0.00, 48000000.00, 
        'Khách hàng VIP', '2025-04-02 10:15:00', '2025-04-02 14:20:00', '2025-04-02 10:15:00', '2025-04-02 14:20:00');

-- Đơn hàng 7 - SHIPPING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at)
VALUES (7, NULL, 'customer3@gmail.com', 'Lê Văn Cường', '0923456789', 'Đà Nẵng', 'Hải Châu', 'Hòa Cường Bắc', 
        '789 Đường DEF', 'SHIPPING', 'CASH', 'NOT_PAID', NULL, NULL, 42000000.00, 0.00, 42000000.00, 
        'Gọi trước khi giao', '2025-04-03 08:45:00', '2025-04-03 16:30:00', '2025-04-03 08:45:00', 
        '2025-04-03 11:20:00', '2025-04-03 16:30:00');

-- Đơn hàng 8 - DELIVERED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at)
VALUES (8, NULL, 'customer4@gmail.com', 'Phạm Thị Dung', '0934567890', 'Hà Nội', 'Hoàn Kiếm', 'Hàng Bài', 
        '321 Đường GHI', 'DELIVERED', 'VN_PAY', 'PAID', NULL, NULL, 39000000.00, 0.00, 39000000.00, 
        'Đã giao thành công', '2025-04-04 07:20:00', '2025-04-05 15:45:00', '2025-04-04 07:20:00', 
        '2025-04-04 09:30:00', '2025-04-04 14:15:00', '2025-04-05 15:45:00');

-- Đơn hàng 9 - COMPLETED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (9, NULL, 'customer5@gmail.com', 'Hoàng Văn Em', '0945678901', 'TP.HCM', 'Quận 3', 'Phường 1', 
        '654 Đường JKL', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 18000000.00, 0.00, 18000000.00, 
        'Khách hàng hài lòng', '2025-04-05 09:10:00', '2025-04-08 10:30:00', '2025-04-05 09:10:00', 
        '2025-04-05 11:45:00', '2025-04-06 08:20:00', '2025-04-07 16:30:00', '2025-04-08 10:30:00');

-- Đơn hàng 10 - CANCELLED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, cancelled_at)
VALUES (10, NULL, 'customer6@gmail.com', 'Vũ Thị Giang', '0956789012', 'Hải Phòng', 'Lê Chân', 'Đông Hải', 
        '987 Đường MNO', 'CANCELLED', 'VN_PAY', 'NOT_PAID', NULL, NULL, 17500000.00, 0.00, 17500000.00, 
        'Khách hàng hủy đơn', '2025-04-06 14:25:00', '2025-04-06 16:40:00', '2025-04-06 14:25:00', '2025-04-06 16:40:00');

-- Đơn hàng 11 - RETURNED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, returned_at)
VALUES (11, NULL, 'customer7@gmail.com', 'Đỗ Văn Hùng', '0967890123', 'Cần Thơ', 'Ninh Kiều', 'An Hòa', 
        '147 Đường PQR', 'RETURNED', 'CASH', 'NOT_PAID', NULL, NULL, 16000000.00, 0.00, 16000000.00, 
        'Sản phẩm lỗi, đã trả lại', '2025-04-07 11:30:00', '2025-04-10 09:15:00', '2025-04-07 11:30:00', 
        '2025-04-07 13:45:00', '2025-04-08 10:20:00', '2025-04-09 14:30:00', '2025-04-10 09:15:00');

-- Đơn hàng 12 - PENDING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at)
VALUES (12, NULL, 'customer8@gmail.com', 'Bùi Thị Lan', '0978901234', 'Nghệ An', 'TP Vinh', 'Hưng Dũng', 
        '258 Đường STU', 'PENDING', 'VN_PAY', 'PAID', NULL, NULL, 14500000.00, 0.00, 14500000.00, 
        'Đã thanh toán online', '2025-04-08 15:20:00', '2025-04-08 15:20:00', '2025-04-08 15:20:00');

-- Đơn hàng 13 - CONFIRMED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at)
VALUES (13, NULL, 'customer9@gmail.com', 'Ngô Văn Minh', '0989012345', 'Quảng Ninh', 'Hạ Long', 'Bãi Cháy', 
        '369 Đường VWX', 'CONFIRMED', 'CASH', 'NOT_PAID', NULL, NULL, 25000000.00, 0.00, 25000000.00, 
        'Xác nhận đơn hàng', '2025-04-09 08:40:00', '2025-04-09 12:15:00', '2025-04-09 08:40:00', '2025-04-09 12:15:00');

-- Đơn hàng 14 - SHIPPING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at)
VALUES (14, NULL, 'customer10@gmail.com', 'Lý Thị Nga', '0990123456', 'Bình Dương', 'Thủ Dầu Một', 'Phú Hòa', 
        '741 Đường YZ', 'SHIPPING', 'VN_PAY', 'PAID', NULL, NULL, 35000000.00, 0.00, 35000000.00, 
        'Đang vận chuyển', '2025-04-10 10:30:00', '2025-04-10 16:45:00', '2025-04-10 10:30:00', 
        '2025-04-10 13:20:00', '2025-04-10 16:45:00');

-- Đơn hàng 15 - DELIVERED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at)
VALUES (15, NULL, 'customer11@gmail.com', 'Trịnh Văn Phúc', '0901357924', 'Thừa Thiên Huế', 'TP Huế', 'Phú Hội', 
        '852 Đường ABC2', 'DELIVERED', 'CASH', 'NOT_PAID', NULL, NULL, 28000000.00, 0.00, 28000000.00, 
        'Giao hàng thành công', '2025-04-11 07:15:00', '2025-04-12 14:20:00', '2025-04-11 07:15:00', 
        '2025-04-11 09:30:00', '2025-04-11 15:10:00', '2025-04-12 14:20:00');

-- Đơn hàng 16 - COMPLETED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (16, NULL, 'customer12@gmail.com', 'Đinh Thị Quỳnh', '0912468135', 'Khánh Hòa', 'Nha Trang', 'Vĩnh Hải', 
        '963 Đường DEF2', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 32000000.00, 0.00, 32000000.00, 
        'Hoàn thành đơn hàng', '2025-04-12 09:45:00', '2025-04-15 11:30:00', '2025-04-12 09:45:00', 
        '2025-04-12 11:20:00', '2025-04-13 08:15:00', '2025-04-14 16:40:00', '2025-04-15 11:30:00');

-- Đơn hàng 17 - PENDING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at)
VALUES (17, NULL, 'customer13@gmail.com', 'Phan Văn Sơn', '0923579146', 'Lâm Đồng', 'Đà Lạt', 'Phường 1', 
        '159 Đường GHI2', 'PENDING', 'CASH', 'NOT_PAID', NULL, NULL, 58000000.00, 0.00, 58000000.00, 
        'Đơn hàng mới', '2025-04-13 13:25:00', '2025-04-13 13:25:00', '2025-04-13 13:25:00');

-- Đơn hàng 18 - CONFIRMED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at)
VALUES (18, NULL, 'customer14@gmail.com', 'Võ Thị Tâm', '0934681257', 'Bà Rịa - Vũng Tàu', 'Vũng Tàu', 'Phường 2', 
        '357 Đường JKL2', 'CONFIRMED', 'VN_PAY', 'PAID', NULL, NULL, 45000000.00, 0.00, 45000000.00, 
        'Đã xác nhận', '2025-04-14 11:10:00', '2025-04-14 15:30:00', '2025-04-14 11:10:00', '2025-04-14 15:30:00');

-- Đơn hàng 19 - SHIPPING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at)
VALUES (19, NULL, 'customer15@gmail.com', 'Dương Văn Tuấn', '0945792368', 'An Giang', 'Long Xuyên', 'Mỹ Bình', 
        '468 Đường MNO2', 'SHIPPING', 'CASH', 'NOT_PAID', NULL, NULL, 52000000.00, 0.00, 52000000.00, 
        'Đang giao hàng', '2025-04-15 08:20:00', '2025-04-15 14:45:00', '2025-04-15 08:20:00', 
        '2025-04-15 10:35:00', '2025-04-15 14:45:00');

-- Đơn hàng 20 - DELIVERED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at)
VALUES (20, NULL, 'customer16@gmail.com', 'Mai Thị Uyên', '0956803479', 'Kiên Giang', 'Rạch Giá', 'Vĩnh Thanh Vân', 
        '579 Đường PQR2', 'DELIVERED', 'VN_PAY', 'PAID', NULL, NULL, 60000000.00, 0.00, 60000000.00, 
        'Đã giao hàng', '2025-04-16 12:40:00', '2025-04-17 16:25:00', '2025-04-16 12:40:00', 
        '2025-04-16 14:15:00', '2025-04-16 18:30:00', '2025-04-17 16:25:00');

-- Đơn hàng 21 - COMPLETED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (21, NULL, 'customer17@gmail.com', 'Lê Văn Việt', '0967914582', 'Đồng Tháp', 'Cao Lãnh', 'Phường 1', 
        '680 Đường STU2', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 8500000.00, 0.00, 8500000.00, 
        'Đơn hàng hoàn thành', '2025-04-17 09:55:00', '2025-04-20 10:15:00', '2025-04-17 09:55:00', 
        '2025-04-17 11:30:00', '2025-04-18 07:45:00', '2025-04-19 15:20:00', '2025-04-20 10:15:00');

-- Đơn hàng 22 - CANCELLED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, cancelled_at)
VALUES (22, NULL, 'customer18@gmail.com', 'Huỳnh Thị Xuân', '0978025693', 'Tiền Giang', 'Mỹ Tho', 'Phường 1', 
        '791 Đường VWX2', 'CANCELLED', 'VN_PAY', 'NOT_PAID', NULL, NULL, 2500000.00, 0.00, 2500000.00, 
        'Hủy do thay đổi ý định', '2025-04-18 16:30:00', '2025-04-18 17:45:00', '2025-04-18 16:30:00', '2025-04-18 17:45:00');

-- Đơn hàng 23 - RETURNED
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, returned_at)
VALUES (23, NULL, 'customer19@gmail.com', 'Cao Văn Yên', '0989136704', 'Vĩnh Long', 'TP Vĩnh Long', 'Phường 1', 
        '802 Đường YZ2', 'RETURNED', 'CASH', 'NOT_PAID', NULL, NULL, 3200000.00, 0.00, 3200000.00, 
        'Trả hàng do không ưng ý', '2025-04-19 14:15:00', '2025-04-22 09:30:00', '2025-04-19 14:15:00', 
        '2025-04-19 16:20:00', '2025-04-20 08:10:00', '2025-04-21 13:45:00', '2025-04-22 09:30:00');

-- Đơn hàng 24 - PENDING
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at)
VALUES (24, NULL, 'customer20@gmail.com', 'Tô Thị Zung', '0990247815', 'Hậu Giang', 'Vị Thanh', 'Phường 1', 
        '913 Đường ABC3', 'PENDING', 'VN_PAY', 'PAID', NULL, NULL, 2800000.00, 0.00, 2800000.00, 
        'Đơn hàng cuối tháng', '2025-04-30 18:45:00', '2025-04-30 18:45:00', '2025-04-30 18:45:00');

-- ===== ORDER ITEMS =====

-- Order Items cho đơn hàng 5 (MacBook Pro 14 M3 Pro)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (5, 1, 'MacBook Pro 14 M3 Pro', '/uploads/images/product/macbook-pro-14-m3-pro.jpg', 50000000.00, 1);

-- Order Items cho đơn hàng 6 (Dell XPS 15)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (6, 2, 'Dell XPS 15', '/uploads/images/product/dell-xps-15.jpg', 45000000.00, 1);

-- Order Items cho đơn hàng 7 (HP Spectre x360)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (7, 3, 'HP Spectre x360', '/uploads/images/product/hp-spectre-x360.jpg', 42000000.00, 1);

-- Order Items cho đơn hàng 8 (Lenovo Yoga 9i)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (8, 4, 'Lenovo Yoga 9i', '/uploads/images/product/lenovo-yoga-9i.jpg', 37000000.00, 1);

-- Order Items cho đơn hàng 9 (Dell Inspiron 14)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (9, 5, 'Dell Inspiron 14', '/uploads/images/product/dell-inspiron-14.jpg', 16500000.00, 1);

-- Order Items cho đơn hàng 10 (HP Pavilion 15)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (10, 6, 'HP Pavilion 15', '/uploads/images/product/hp-pavilion-15.jpg', 17500000.00, 1);

-- Order Items cho đơn hàng 11 (Lenovo IdeaPad 5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (11, 7, 'Lenovo IdeaPad 5', '/uploads/images/product/lenovo-ideapad-5.jpg', 15000000.00, 1);

-- Order Items cho đơn hàng 12 (Acer Aspire 5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (12, 8, 'Acer Aspire 5', '/uploads/images/product/acer-aspire-5.jpg', 13500000.00, 1);

-- Order Items cho đơn hàng 13 (MSI GF63 Thin)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (13, 9, 'MSI GF63 Thin', '/uploads/images/product/msi-gf63-thin.jpg', 23000000.00, 1);

-- Order Items cho đơn hàng 14 (Asus ROG Strix G16)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (14, 10, 'Asus ROG Strix G16', '/uploads/images/product/asus-rog-strix-g16.jpg', 32000000.00, 1);

-- Order Items cho đơn hàng 15 (Dell G15)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (15, 11, 'Dell G15', '/uploads/images/product/dell-g15.jpg', 28000000.00, 1);

-- Order Items cho đơn hàng 16 (Lenovo Legion 5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (16, 12, 'Lenovo Legion 5', '/uploads/images/product/lenovo-legion-5.jpg', 30000000.00, 1);

-- Order Items cho đơn hàng 17 (Asus ProArt Studiobook)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (17, 13, 'Asus ProArt Studiobook', '/uploads/images/product/asus-proart-studiobook.jpg', 54000000.00, 1);

-- Order Items cho đơn hàng 18 (HP Envy 16)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (18, 14, 'HP Envy 16', '/uploads/images/product/hp-envy-16.jpg', 42000000.00, 1);

-- Order Items cho đơn hàng 19 (MSI Creator Z16)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (19, 15, 'MSI Creator Z16', '/uploads/images/product/msi-creator-z16.jpg', 52000000.00, 1);

-- Order Items cho đơn hàng 20 (Dell Precision 5570)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (20, 16, 'Dell Precision 5570', '/uploads/images/product/dell-precision-5570.jpg', 57000000.00, 1);

-- Order Items cho đơn hàng 21 (Sony WH-1000XM5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (21, 17, 'Sony WH-1000XM5', '/uploads/images/product/sony-wh-1000xm5.jpg', 7500000.00, 1);

-- Order Items cho đơn hàng 22 (JBL Tune 760NC)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (22, 18, 'JBL Tune 760NC', '/uploads/images/product/jbl-tune-760nc.jpg', 2200000.00, 1);

-- Order Items cho đơn hàng 23 (Marshall Major IV)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (23, 19, 'Marshall Major IV', '/uploads/images/product/marshall-major-iv.jpg', 3200000.00, 1);

-- Order Items cho đơn hàng 24 (Sony MDR-7506)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (24, 20, 'Sony MDR-7506', '/uploads/images/product/sony-mdr-7506.jpg', 2500000.00, 1);

-- Thêm một số order items với nhiều sản phẩm
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (17, 21, 'Akko 3068B Plus', '/uploads/images/product/akko-3068b-plus.jpg', 1650000.00, 2);

INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (18, 22, 'Weikav Sugar65', '/uploads/images/product/weikav-sugar65.jpg', 2200000.00, 1);

INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (20, 23, 'AULA F2088', '/uploads/images/product/aula-f2088.jpg', 400000.00, 3);

INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (21, 24, 'LG UltraFine Keyboard', '/uploads/images/product/lg-ultrafine-keyboard.jpg', 720000.00, 1);

-- ===== THÊM 20 ĐỚN HÀNG MỚI TỪ 1/5/2025 ĐẾN 25/5/2025 =====
-- OrderId từ 25 đến 44, có 15 đơn COMPLETED

-- Đơn hàng 25 - COMPLETED (1/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (25, NULL, 'customer21@gmail.com', 'Nguyễn Thị Mai', '0901111111', 'Hà Nội', 'Ba Đình', 'Phúc Xá', 
        '123 Phố Huế', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 26000000.00, 0.00, 26000000.00, 
        'Đơn hàng hoàn thành tốt', '2025-05-01 08:30:00', '2025-05-04 16:20:00', '2025-05-01 08:30:00', 
        '2025-05-01 10:15:00', '2025-05-02 09:30:00', '2025-05-03 14:45:00', '2025-05-04 16:20:00');

-- Đơn hàng 26 - COMPLETED (2/5/2025) - Đơn hàng có nhiều sản phẩm
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (26, NULL, 'customer22@gmail.com', 'Trần Văn Hùng', '0902222222', 'TP.HCM', 'Quận 7', 'Tân Phú', 
        '456 Nguyễn Thị Thập', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 22500000.00, 0.00, 22500000.00, 
        'Combo laptop + tai nghe', '2025-05-02 09:45:00', '2025-05-05 11:30:00', '2025-05-02 09:45:00', 
        '2025-05-02 11:20:00', '2025-05-03 08:15:00', '2025-05-04 16:40:00', '2025-05-05 11:30:00');

-- Đơn hàng 27 - COMPLETED (3/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (27, NULL, 'customer23@gmail.com', 'Lê Thị Hoa', '0903333333', 'Đà Nẵng', 'Sơn Trà', 'Thọ Quang', 
        '789 Võ Nguyên Giáp', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 32000000.00, 0.00, 32000000.00, 
        'Gaming laptop tuyệt vời', '2025-05-03 14:20:00', '2025-05-06 10:15:00', '2025-05-03 14:20:00', 
        '2025-05-03 16:30:00', '2025-05-04 07:45:00', '2025-05-05 13:20:00', '2025-05-06 10:15:00');

-- Đơn hàng 28 - COMPLETED (4/5/2025) - Đơn hàng có nhiều sản phẩm
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (28, NULL, 'customer24@gmail.com', 'Phạm Văn Đức', '0904444444', 'Hải Phòng', 'Ngô Quyền', 'Máy Chai', 
        '321 Lạch Tray', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 5900000.00, 0.00, 5900000.00, 
        'Setup gaming hoàn chỉnh', '2025-05-04 11:10:00', '2025-05-07 15:45:00', '2025-05-04 11:10:00', 
        '2025-05-04 13:25:00', '2025-05-05 08:30:00', '2025-05-06 14:15:00', '2025-05-07 15:45:00');

-- Đơn hàng 29 - COMPLETED (5/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (29, NULL, 'customer25@gmail.com', 'Vũ Thị Lan', '0905555555', 'Cần Thơ', 'Ninh Kiều', 'Xuân Khánh', 
        '654 Trần Hưng Đạo', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 62000000.00, 0.00, 62000000.00, 
        'Workstation chuyên nghiệp', '2025-05-05 07:30:00', '2025-05-08 12:20:00', '2025-05-05 07:30:00', 
        '2025-05-05 09:45:00', '2025-05-06 10:15:00', '2025-05-07 16:30:00', '2025-05-08 12:20:00');

-- Đơn hàng 30 - COMPLETED (6/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (30, NULL, 'customer26@gmail.com', 'Hoàng Văn Nam', '0906666666', 'Nghệ An', 'TP Vinh', 'Hưng Dũng', 
        '987 Lê Lợi', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 13500000.00, 0.00, 13500000.00, 
        'Laptop văn phòng tốt', '2025-05-06 13:15:00', '2025-05-09 09:40:00', '2025-05-06 13:15:00', 
        '2025-05-06 15:30:00', '2025-05-07 08:20:00', '2025-05-08 14:50:00', '2025-05-09 09:40:00');

-- Đơn hàng 31 - COMPLETED (7/5/2025) - Đơn hàng có nhiều sản phẩm
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (31, NULL, 'customer27@gmail.com', 'Đỗ Thị Bích', '0907777777', 'Quảng Ninh', 'Hạ Long', 'Hồng Hải', 
        '147 Bãi Cháy', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 44200000.00, 0.00, 44200000.00, 
        'Combo laptop + bàn phím cao cấp', '2025-05-07 10:25:00', '2025-05-10 14:35:00', '2025-05-07 10:25:00', 
        '2025-05-07 12:40:00', '2025-05-08 09:15:00', '2025-05-09 15:20:00', '2025-05-10 14:35:00');

-- Đơn hàng 32 - COMPLETED (8/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (32, NULL, 'customer28@gmail.com', 'Bùi Văn Tài', '0908888888', 'Bình Dương', 'Thủ Dầu Một', 'Phú Cường', 
        '258 Yersin', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 30000000.00, 0.00, 30000000.00, 
        'Gaming laptop Legion', '2025-05-08 16:40:00', '2025-05-11 11:25:00', '2025-05-08 16:40:00', 
        '2025-05-08 18:55:00', '2025-05-09 07:30:00', '2025-05-10 13:45:00', '2025-05-11 11:25:00');

-- Đơn hàng 33 - COMPLETED (9/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (33, NULL, 'customer29@gmail.com', 'Lý Thị Thu', '0909999999', 'Thừa Thiên Huế', 'TP Huế', 'Phú Nhuận', 
        '369 Lê Lợi', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 7500000.00, 0.00, 7500000.00, 
        'Tai nghe Sony cao cấp', '2025-05-09 08:20:00', '2025-05-12 16:10:00', '2025-05-09 08:20:00', 
        '2025-05-09 10:35:00', '2025-05-10 09:45:00', '2025-05-11 14:20:00', '2025-05-12 16:10:00');

-- Đơn hàng 34 - COMPLETED (10/5/2025) - Đơn hàng có nhiều sản phẩm
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (34, NULL, 'customer30@gmail.com', 'Trịnh Văn Long', '0910101010', 'Khánh Hòa', 'Nha Trang', 'Vĩnh Hải', 
        '741 Trần Phú', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 18700000.00, 0.00, 18700000.00, 
        'Combo laptop + phụ kiện', '2025-05-10 12:50:00', '2025-05-13 10:30:00', '2025-05-10 12:50:00', 
        '2025-05-10 14:15:00', '2025-05-11 08:40:00', '2025-05-12 15:25:00', '2025-05-13 10:30:00');

-- Đơn hàng 35 - COMPLETED (11/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (35, NULL, 'customer31@gmail.com', 'Đinh Thị Hương', '0911111111', 'Bà Rịa - Vũng Tàu', 'Vũng Tàu', 'Phường 3', 
        '852 Hạ Long', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 23000000.00, 0.00, 23000000.00, 
        'MSI Gaming laptop', '2025-05-11 15:30:00', '2025-05-14 12:45:00', '2025-05-11 15:30:00', 
        '2025-05-11 17:45:00', '2025-05-12 09:20:00', '2025-05-13 14:35:00', '2025-05-14 12:45:00');

-- Đơn hàng 36 - COMPLETED (12/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (36, NULL, 'customer32@gmail.com', 'Phan Văn Minh', '0912121212', 'Lâm Đồng', 'Đà Lạt', 'Phường 4', 
        '963 Nguyễn Du', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 54000000.00, 0.00, 54000000.00, 
        'Laptop đồ họa chuyên nghiệp', '2025-05-12 09:15:00', '2025-05-15 16:20:00', '2025-05-12 09:15:00', 
        '2025-05-12 11:30:00', '2025-05-13 08:45:00', '2025-05-14 14:10:00', '2025-05-15 16:20:00');

-- Đơn hàng 37 - COMPLETED (13/5/2025) - Đơn hàng có nhiều sản phẩm
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (37, NULL, 'customer33@gmail.com', 'Võ Thị Kim', '0913131313', 'An Giang', 'Long Xuyên', 'Mỹ Bình', 
        '159 Tôn Đức Thắng', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 3920000.00, 0.00, 3920000.00, 
        'Combo bàn phím + tai nghe', '2025-05-13 11:40:00', '2025-05-16 13:55:00', '2025-05-13 11:40:00', 
        '2025-05-13 13:55:00', '2025-05-14 09:30:00', '2025-05-15 15:40:00', '2025-05-16 13:55:00');

-- Đơn hàng 38 - COMPLETED (14/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (38, NULL, 'customer34@gmail.com', 'Dương Văn Hải', '0914141414', 'Kiên Giang', 'Rạch Giá', 'Vĩnh Lạc', 
        '357 Nguyễn Trung Trực', 'COMPLETED', 'CASH', 'NOT_PAID', NULL, NULL, 42000000.00, 0.00, 42000000.00, 
        'HP Envy 16 tuyệt vời', '2025-05-14 14:25:00', '2025-05-17 11:40:00', '2025-05-14 14:25:00', 
        '2025-05-14 16:40:00', '2025-05-15 08:15:00', '2025-05-16 13:30:00', '2025-05-17 11:40:00');

-- Đơn hàng 39 - COMPLETED (15/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at, completed_at)
VALUES (39, NULL, 'customer35@gmail.com', 'Cao Thị Ngọc', '0915151515', 'Đồng Tháp', 'Cao Lãnh', 'Phường 2', 
        '468 Nguyễn Huệ', 'COMPLETED', 'VN_PAY', 'PAID', NULL, NULL, 1650000.00, 0.00, 1650000.00, 
        'Bàn phím cơ Akko', '2025-05-15 10:10:00', '2025-05-18 15:25:00', '2025-05-15 10:10:00', 
        '2025-05-15 12:25:00', '2025-05-16 09:40:00', '2025-05-17 14:15:00', '2025-05-18 15:25:00');

-- Đơn hàng 40 - PENDING (16/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at)
VALUES (40, NULL, 'customer36@gmail.com', 'Tô Văn Phúc', '0916161616', 'Tiền Giang', 'Mỹ Tho', 'Phường 3', 
        '579 Ấp Bắc', 'PENDING', 'CASH', 'NOT_PAID', NULL, NULL, 28000000.00, 0.00, 28000000.00, 
        'Đơn hàng mới chờ xử lý', '2025-05-16 16:45:00', '2025-05-16 16:45:00', '2025-05-16 16:45:00');

-- Đơn hàng 41 - CONFIRMED (17/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at)
VALUES (41, NULL, 'customer37@gmail.com', 'Huỳnh Thị Lan', '0917171717', 'Vĩnh Long', 'TP Vĩnh Long', 'Phường 2', 
        '680 Phạm Thái Bường', 'CONFIRMED', 'VN_PAY', 'PAID', NULL, NULL, 2200000.00, 0.00, 2200000.00, 
        'Bàn phím custom cao cấp', '2025-05-17 08:30:00', '2025-05-17 12:45:00', '2025-05-17 08:30:00', '2025-05-17 12:45:00');

-- Đơn hàng 42 - SHIPPING (18/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at)
VALUES (42, NULL, 'customer38@gmail.com', 'Lê Văn Đạt', '0918181818', 'Hậu Giang', 'Vị Thanh', 'Phường 5', 
        '791 Nguyễn Thái Học', 'SHIPPING', 'CASH', 'NOT_PAID', NULL, NULL, 720000.00, 0.00, 720000.00, 
        'Đang giao bàn phím LG', '2025-05-18 13:20:00', '2025-05-18 17:35:00', '2025-05-18 13:20:00', 
        '2025-05-18 15:35:00', '2025-05-18 17:35:00');

-- Đơn hàng 43 - DELIVERED (19/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, confirmed_at, shipping_at, delivered_at)
VALUES (43, NULL, 'customer39@gmail.com', 'Ngô Thị Hạnh', '0919191919', 'Sóc Trăng', 'TP Sóc Trăng', 'Phường 1', 
        '802 Trần Hưng Đạo', 'DELIVERED', 'VN_PAY', 'PAID', NULL, NULL, 2500000.00, 0.00, 2500000.00, 
        'Tai nghe Sony đã giao', '2025-05-19 09:50:00', '2025-05-20 14:15:00', '2025-05-19 09:50:00', 
        '2025-05-19 11:15:00', '2025-05-19 16:30:00', '2025-05-20 14:15:00');

-- Đơn hàng 44 - CANCELLED (20/5/2025)
INSERT INTO orders (order_id, user_id, user_email, full_name, phone_number, province, district, ward, address_detail, 
                status, payment_method, payment_status, coupon_id, coupon_code, subtotal_amount, discount_amount, 
                total_amount, note, created_at, updated_at, pending_at, cancelled_at)
VALUES (44, NULL, 'customer40@gmail.com', 'Mai Văn Tuấn', '0920202020', 'Cà Mau', 'TP Cà Mau', 'Phường 2', 
        '913 Phan Ngọc Hiển', 'CANCELLED', 'CASH', 'NOT_PAID', NULL, NULL, 400000.00, 0.00, 400000.00, 
        'Hủy do thay đổi ý định', '2025-05-20 15:40:00', '2025-05-20 16:55:00', '2025-05-20 15:40:00', '2025-05-20 16:55:00');

-- ===== ORDER ITEMS CHO 20 ĐỚN HÀNG MỚI =====

-- Order Items cho đơn hàng 25 (MacBook Air M2)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (25, 25, 'MacBook Air M2', '/uploads/images/product/macbook-air-m2.jpg', 26000000.00, 1);

-- Order Items cho đơn hàng 26 (Combo: Lenovo IdeaPad 5 + Sony WH-1000XM5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (26, 7, 'Lenovo IdeaPad 5', '/uploads/images/product/lenovo-ideapad-5.jpg', 15000000.00, 1);
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (26, 17, 'Sony WH-1000XM5', '/uploads/images/product/sony-wh-1000xm5.jpg', 7500000.00, 1);
-- Tổng: 15,000,000 + 7,500,000 = 22,500,000

-- Order Items cho đơn hàng 27 (Asus ROG Strix G16)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (27, 10, 'Asus ROG Strix G16', '/uploads/images/product/asus-rog-strix-g16.jpg', 32000000.00, 1);

-- Order Items cho đơn hàng 28 (Combo: Akko 3068B Plus x2 + JBL Tune 760NC + AULA F2088)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (28, 21, 'Akko 3068B Plus', '/uploads/images/product/akko-3068b-plus.jpg', 1650000.00, 2);
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (28, 18, 'JBL Tune 760NC', '/uploads/images/product/jbl-tune-760nc.jpg', 2200000.00, 1);
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (28, 23, 'AULA F2088', '/uploads/images/product/aula-f2088.jpg', 400000.00, 1);
-- Tổng: (1,650,000 x 2) + 2,200,000 + 400,000 = 5,900,000

-- Order Items cho đơn hàng 29 (Lenovo ThinkPad P1)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (29, 28, 'Lenovo ThinkPad P1', '/uploads/images/product/lenovo-thinkpad-p1.jpg', 62000000.00, 1);

-- Order Items cho đơn hàng 30 (Acer Aspire 5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (30, 8, 'Acer Aspire 5', '/uploads/images/product/acer-aspire-5.jpg', 13500000.00, 1);

-- Order Items cho đơn hàng 31 (Combo: HP Envy 16 + Weikav Sugar65)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (31, 14, 'HP Envy 16', '/uploads/images/product/hp-envy-16.jpg', 42000000.00, 1);
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (31, 22, 'Weikav Sugar65', '/uploads/images/product/weikav-sugar65.jpg', 2200000.00, 1);
-- Tổng: 42,000,000 + 2,200,000 = 44,200,000

-- Order Items cho đơn hàng 32 (Lenovo Legion 5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (32, 12, 'Lenovo Legion 5', '/uploads/images/product/lenovo-legion-5.jpg', 30000000.00, 1);

-- Order Items cho đơn hàng 33 (Sony WH-1000XM5)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (33, 17, 'Sony WH-1000XM5', '/uploads/images/product/sony-wh-1000xm5.jpg', 7500000.00, 1);

-- Order Items cho đơn hàng 34 (Combo: Dell Inspiron 14 + JBL Tune 760NC)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (34, 5, 'Dell Inspiron 14', '/uploads/images/product/dell-inspiron-14.jpg', 16500000.00, 1);
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (34, 18, 'JBL Tune 760NC', '/uploads/images/product/jbl-tune-760nc.jpg', 2200000.00, 1);
-- Tổng: 16,500,000 + 2,200,000 = 18,700,000

-- Order Items cho đơn hàng 35 (MSI GF63 Thin)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (35, 9, 'MSI GF63 Thin', '/uploads/images/product/msi-gf63-thin.jpg', 23000000.00, 1);

-- Order Items cho đơn hàng 36 (Asus ProArt Studiobook)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (36, 13, 'Asus ProArt Studiobook', '/uploads/images/product/asus-proart-studiobook.jpg', 54000000.00, 1);

-- Order Items cho đơn hàng 37 (Combo: Marshall Major IV + LG UltraFine Keyboard)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (37, 19, 'Marshall Major IV', '/uploads/images/product/marshall-major-iv.jpg', 3200000.00, 1);
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (37, 24, 'LG UltraFine Keyboard', '/uploads/images/product/lg-ultrafine-keyboard.jpg', 720000.00, 1);
-- Tổng: 3,200,000 + 720,000 = 3,920,000

-- Order Items cho đơn hàng 38 (HP Envy 16)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (38, 14, 'HP Envy 16', '/uploads/images/product/hp-envy-16.jpg', 42000000.00, 1);

-- Order Items cho đơn hàng 39 (Akko 3068B Plus)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (39, 21, 'Akko 3068B Plus', '/uploads/images/product/akko-3068b-plus.jpg', 1650000.00, 1);

-- Order Items cho đơn hàng 40 (Dell G15)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (40, 11, 'Dell G15', '/uploads/images/product/dell-g15.jpg', 28000000.00, 1);

-- Order Items cho đơn hàng 41 (Weikav Sugar65)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (41, 22, 'Weikav Sugar65', '/uploads/images/product/weikav-sugar65.jpg', 2200000.00, 1);

-- Order Items cho đơn hàng 42 (LG UltraFine Keyboard)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (42, 24, 'LG UltraFine Keyboard', '/uploads/images/product/lg-ultrafine-keyboard.jpg', 720000.00, 1);

-- Order Items cho đơn hàng 43 (Sony MDR-7506)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (43, 20, 'Sony MDR-7506', '/uploads/images/product/sony-mdr-7506.jpg', 2500000.00, 1);

-- Order Items cho đơn hàng 44 (AULA F2088)
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
VALUES (44, 23, 'AULA F2088', '/uploads/images/product/aula-f2088.jpg', 400000.00, 1); 