-- Sản phẩm cho category_id = 4 (Ví dụ: Laptop Cao cấp)
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('MacBook Pro 14 M3 Pro', 'MBP14M3PRO', 4, 1, 55000000.00, 50000000.00, 9, 'Laptop cao cấp của Apple', 10, TRUE, NOW(), NOW()); -- {brand_id_apple} ví dụ: 1
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Dell XPS 15', 'XPS15', 4, 4, 48000000.00, 45000000.00, 6, 'Laptop cao cấp mỏng nhẹ', 12, TRUE, NOW(), NOW()); -- {brand_id_dell} ví dụ: 4
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('HP Spectre x360', 'SPTX360', 4, 5, 42000000.00, NULL, NULL, 'Laptop 2-in-1 cao cấp', 8, TRUE, NOW(), NOW()); -- {brand_id_hp} ví dụ: 5
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Lenovo Yoga 9i', 'YOGA9I', 4, 6, 39000000.00, 37000000.00, 5, 'Laptop Yoga cao cấp', 15, TRUE, NOW(), NOW()); -- {brand_id_lenovo} ví dụ: 6

-- Sản phẩm cho category_id = 5 (Ví dụ: Laptop Văn phòng)
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Dell Inspiron 14', 'INS14', 5, 5, 18000000.00, 16500000.00, 8, 'Laptop văn phòng phổ thông', 30, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('HP Pavilion 15', 'PAV15', 5, 5, 17500000.00, NULL, NULL, 'Laptop văn phòng mỏng nhẹ', 25, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Lenovo IdeaPad 5', 'IPAD5', 5, 6, 16000000.00, 15000000.00, 6, 'Laptop văn phòng giá tốt', 40, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Acer Aspire 5', 'ASPIRE5', 5, 7, 14500000.00, 13500000.00, 7, 'Laptop văn phòng hiệu năng ổn', 35, TRUE, NOW(), NOW()); -- {brand_id_acer} ví dụ: 7

-- Sản phẩm cho category_id = 6 (Ví dụ: Laptop Gaming)
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('MSI GF63 Thin', 'GF63THIN', 6, 2, 25000000.00, 23000000.00, 8, 'Laptop Gaming phổ thông', 20, TRUE, NOW(), NOW()); -- {brand_id_msi} ví dụ: 2
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Asus ROG Strix G16', 'STRIXG16', 6, 3, 35000000.00, 32000000.00, 8, 'Laptop Gaming hiệu năng cao', 18, TRUE, NOW(), NOW()); -- {brand_id_asus} ví dụ: 3
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Dell G15', 'DELLG15', 6, 4, 28000000.00, NULL, NULL, 'Laptop Gaming bền bỉ', 22, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Lenovo Legion 5', 'LEGION5', 6, 6, 32000000.00, 30000000.00, 6, 'Laptop Gaming cân bằng', 15, TRUE, NOW(), NOW());

-- Sản phẩm cho category_id = 7 (Ví dụ: Laptop Đồ họa)
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Asus ProArt Studiobook', 'PROART', 7, 3, 58000000.00, 54000000.00, 7, 'Laptop chuyên đồ họa', 7, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('HP Envy 16', 'ENVY16', 7, 5, 45000000.00, 42000000.00, 6, 'Laptop đồ họa đa năng', 9, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('MSI Creator Z16', 'CREATORZ16', 7, 2, 52000000.00, NULL, NULL, 'Laptop Creator mạnh mẽ', 6, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Dell Precision 5570', 'PREC5570', 7, 4, 60000000.00, 57000000.00, 5, 'Máy trạm di động', 5, TRUE, NOW(), NOW());

-- 4 mẫu tai nghe (category_id 8 và 9 cho tai nghe không dây và có dây)
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Sony WH-1000XM5', 'SONYWH1000XM5', 8, 10, 8500000.00, 7500000.00, 12, 'Tai nghe không dây chống ồn cao cấp', 25, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('JBL Tune 760NC', 'JBLTUNE760NC', 8, 9, 2500000.00, 2200000.00, 12, 'Tai nghe không dây chống ồn giá rẻ', 40, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Marshall Major IV', 'MARSHALLMAJOR4', 9, 11, 3200000.00, NULL, NULL, 'Tai nghe có dây phong cách vintage', 30, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Sony MDR-7506', 'SONYMDR7506', 9, 10, 2800000.00, 2500000.00, 11, 'Tai nghe studio chuyên nghiệp', 20, TRUE, NOW(), NOW());

-- 4 mẫu bàn phím (category_id 10 và 11 cho bàn phím thường và cơ)
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Akko 3068B Plus', 'AKKO3068BPLUS', 11, 12, 1800000.00, 1650000.00, 8, 'Bàn phím cơ 65% layout', 35, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Weikav Sugar65', 'WEIKAVSUGAR65', 11, 13, 2200000.00, NULL, NULL, 'Bàn phím cơ custom cao cấp', 15, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('AULA F2088', 'AULAF2088', 10, 14, 450000.00, 400000.00, 11, 'Bàn phím membrane văn phòng', 50, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('LG UltraFine Keyboard', 'LGULTRAFINE', 10, 8, 800000.00, 720000.00, 10, 'Bàn phím mỏng cho văn phòng', 45, TRUE, NOW(), NOW());

-- 4 mẫu laptop bổ sung
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('MacBook Air M2', 'MBAIRM2', 4, 1, 28000000.00, 26000000.00, 7, 'Laptop siêu mỏng nhẹ của Apple', 20, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Asus Vivobook 15', 'VIVOBOOK15', 5, 3, 15000000.00, 13500000.00, 10, 'Laptop văn phòng hiệu năng tốt', 30, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Acer Predator Helios 300', 'PREDATORH300', 6, 7, 38000000.00, NULL, NULL, 'Laptop Gaming mạnh mẽ', 12, TRUE, NOW(), NOW());
INSERT INTO products (product_name, sku, category_id, brand_id, price, discount_price, discount_percent, description, stock_quantity, is_enabled, created_at, updated_at)
VALUES ('Lenovo ThinkPad P1', 'THINKPADP1', 7, 6, 65000000.00, 62000000.00, 5, 'Workstation di động cao cấp', 8, TRUE, NOW(), NOW());