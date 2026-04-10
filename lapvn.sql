CREATE DATABASE  IF NOT EXISTS `lapstar` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lapstar`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: lapstar
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attributes` (
  `attribute_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `attribute_name` varchar(255) NOT NULL,
  `attribute_unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`),
  KEY `FK8kxsgf8yatov9ub1i7mycsn6y` (`category_id`),
  CONSTRAINT `FK8kxsgf8yatov9ub1i7mycsn6y` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,1,'CPU',NULL),(2,1,'Card đồ họa',NULL),(3,1,'Ram',NULL),(4,1,'Ổ cứng',NULL),(5,1,'Màn hình',NULL),(6,1,'Trọng lượng',NULL),(7,1,'Pin',NULL),(8,1,'Hệ điều hành',NULL),(9,2,'Kích thước Driver',NULL),(10,2,'Micro',NULL),(11,2,'Chuẩn kết nối',NULL),(12,2,'Pin',NULL),(13,2,'Trọng lượng',NULL),(14,2,'Công nghệ âm thanh',NULL),(15,3,'Chất liệu khung',NULL),(16,3,'Layout',NULL),(17,3,'Số nút bấm',NULL),(18,3,'Switch',NULL),(19,3,'Đèn led',NULL),(20,3,'Pin',NULL),(21,3,'Trọng lượng',NULL);
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `is_active` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (_binary '','2025-05-25 18:42:00.000000',7,'/uploads/images/banner/banner-1.png','Banner-1','/banner1'),(_binary '','2025-05-25 18:42:00.000000',8,'/uploads/images/banner/banner-2.png','Banner-2','/banner2'),(_binary '','2025-05-25 18:42:00.000000',9,'/uploads/images/banner/banner-3.png','Banner-3','/banner3');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `is_published` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `blog_type` enum('BLOG','POLICY') NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `UKgds2u6k2vfeo1tkrtgwcyqj36` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Apple','Công ty công nghệ đa quốc gia của Mỹ, nổi tiếng với các sản phẩm iPhone, iPad, Mac và các thiết bị điện tử tiêu dùng cao cấp.','/uploads/images/brand/apple.png'),(2,'MSI','Thương hiệu máy tính và linh kiện gaming hàng đầu thế giới, chuyên về laptop gaming, card đồ họa và bo mạch chủ hiệu năng cao.','/uploads/images/brand/msi.png'),(3,'Asus','Tập đoàn công nghệ Đài Loan, sản xuất laptop, bo mạch chủ, card đồ họa và các thiết bị gaming với chất lượng và hiệu năng vượt trội.','/uploads/images/brand/asus.png'),(4,'Dell','Công ty công nghệ đa quốc gia của Mỹ, chuyên về máy tính cá nhân, laptop, máy chủ và các giải pháp công nghệ doanh nghiệp.','/uploads/images/brand/dell.png'),(5,'HP','Công ty công nghệ thông tin đa quốc gia của Mỹ, nổi tiếng với máy tính cá nhân, laptop, máy in và các thiết bị văn phòng.','/uploads/images/brand/hp.png'),(6,'Lenovo','Tập đoàn công nghệ đa quốc gia của Trung Quốc, sản xuất laptop, máy tính để bàn, điện thoại thông minh và các thiết bị công nghệ.','/uploads/images/brand/lenovo.png'),(7,'Acer','Công ty công nghệ đa quốc gia của Đài Loan, chuyên về laptop, máy tính để bàn, màn hình và các thiết bị công nghệ với giá cả hợp lý.','/uploads/images/brand/acer.png'),(8,'LG','Tập đoàn điện tử đa quốc gia của Hàn Quốc, sản xuất màn hình, TV, điện thoại thông minh và các thiết bị gia dụng thông minh.','/uploads/images/brand/lg.png'),(9,'JBL','Thương hiệu âm thanh của Mỹ, chuyên về loa, tai nghe và các thiết bị âm thanh chất lượng cao với công nghệ âm thanh tiên tiến.','/uploads/images/brand/jbl.png'),(10,'Sony','Tập đoàn điện tử đa quốc gia của Nhật Bản, nổi tiếng với các sản phẩm âm thanh, camera, TV và thiết bị giải trí chất lượng cao.','/uploads/images/brand/sony.png'),(11,'Marshall','Thương hiệu âm thanh huyền thoại của Anh, nổi tiếng với ampli guitar và các thiết bị âm thanh mang phong cách rock độc đáo.','/uploads/images/brand/marshall.png'),(12,'Akko','Thương hiệu phụ kiện gaming của Trung Quốc, chuyên về bàn phím cơ, keycap và các phụ kiện máy tính với thiết kế đẹp mắt.','/uploads/images/brand/akko.png'),(13,'Weikav','Thương hiệu bàn phím cơ custom cao cấp, nổi tiếng với các sản phẩm bàn phím cơ chất lượng và thiết kế tinh tế.','/uploads/images/brand/weikav.png'),(14,'AULA','Thương hiệu gaming gear của Trung Quốc, chuyên về bàn phím, chuột gaming và các phụ kiện máy tính với giá cả phải chăng.','/uploads/images/brand/aula.png');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_id` int NOT NULL,
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,2,'2025-05-25 20:31:08.996615','2025-05-25 20:31:08.996615'),(2,6,'2025-05-25 20:32:57.238764','2025-05-25 20:32:57.238764'),(3,3,'2025-05-25 20:37:23.725470','2025-05-25 20:37:23.725470'),(4,4,'2025-06-01 02:50:26.685381','2025-06-01 02:50:26.685381');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,NULL,'Laptop'),(2,NULL,'Tai nghe'),(3,NULL,'Bàn phím'),(4,1,'Cao cấp'),(5,1,'Văn phòng'),(6,1,'Gaming'),(7,1,'Đồ họa'),(8,2,'Tai nghe không dây'),(9,2,'Tai nghe có dây'),(10,3,'Bàn phím thường'),(11,3,'Bàn phím cơ');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `coupon_id` int NOT NULL AUTO_INCREMENT,
  `discount_value` decimal(38,2) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `minimum_order_amount` decimal(38,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `coupon_code` varchar(50) NOT NULL,
  `discount_type` enum('FIXED','PERCENT') NOT NULL,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `UKsre2vcap4vs6qucaksomk3c7s` (`coupon_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1,500000.00,_binary '',5000000.00,100,2,'2025-05-25 20:34:16.304700','2025-06-02 23:34:38.112230','GIAM500K','FIXED'),(2,10.00,_binary '',10000000.00,10,3,'2025-05-25 20:34:51.855206','2025-06-02 23:13:16.641479','GIAM10','PERCENT'),(3,3000000.00,_binary '',30000000.00,5,1,'2025-05-25 20:35:28.078906','2025-06-01 20:53:34.197106','SALESAPSAN','FIXED');
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_id` int NOT NULL,
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,13500000,26,2,NULL,'Asus Vivobook 15'),(1,2,720000,24,1,NULL,'LG UltraFine Keyboard'),(1,3,2500000,20,1,NULL,'Sony MDR-7506'),(2,4,13500000,26,3,NULL,'Asus Vivobook 15'),(3,5,26000000,25,2,NULL,'MacBook Air M2'),(3,6,7500000,17,1,NULL,'Sony WH-1000XM5'),(4,7,62000000,28,1,NULL,'Lenovo ThinkPad P1'),(5,32,50000000,1,1,'/uploads/images/product/macbook-pro-14-m3-pro.jpg','MacBook Pro 14 M3 Pro'),(6,33,45000000,2,1,'/uploads/images/product/dell-xps-15.jpg','Dell XPS 15'),(7,34,42000000,3,1,'/uploads/images/product/hp-spectre-x360.jpg','HP Spectre x360'),(8,35,37000000,4,1,'/uploads/images/product/lenovo-yoga-9i.jpg','Lenovo Yoga 9i'),(9,36,16500000,5,1,'/uploads/images/product/dell-inspiron-14.jpg','Dell Inspiron 14'),(10,37,17500000,6,1,'/uploads/images/product/hp-pavilion-15.jpg','HP Pavilion 15'),(11,38,15000000,7,1,'/uploads/images/product/lenovo-ideapad-5.jpg','Lenovo IdeaPad 5'),(12,39,13500000,8,1,'/uploads/images/product/acer-aspire-5.jpg','Acer Aspire 5'),(13,40,23000000,9,1,'/uploads/images/product/msi-gf63-thin.jpg','MSI GF63 Thin'),(14,41,32000000,10,1,'/uploads/images/product/asus-rog-strix-g16.jpg','Asus ROG Strix G16'),(15,42,28000000,11,1,'/uploads/images/product/dell-g15.jpg','Dell G15'),(16,43,30000000,12,1,'/uploads/images/product/lenovo-legion-5.jpg','Lenovo Legion 5'),(17,44,54000000,13,1,'/uploads/images/product/asus-proart-studiobook.jpg','Asus ProArt Studiobook'),(18,45,42000000,14,1,'/uploads/images/product/hp-envy-16.jpg','HP Envy 16'),(19,46,52000000,15,1,'/uploads/images/product/msi-creator-z16.jpg','MSI Creator Z16'),(20,47,57000000,16,1,'/uploads/images/product/dell-precision-5570.jpg','Dell Precision 5570'),(21,48,7500000,17,1,'/uploads/images/product/sony-wh-1000xm5.jpg','Sony WH-1000XM5'),(22,49,2200000,18,1,'/uploads/images/product/jbl-tune-760nc.jpg','JBL Tune 760NC'),(23,50,3200000,19,1,'/uploads/images/product/marshall-major-iv.jpg','Marshall Major IV'),(24,51,2500000,20,1,'/uploads/images/product/sony-mdr-7506.jpg','Sony MDR-7506'),(17,52,1650000,21,2,'/uploads/images/product/akko-3068b-plus.jpg','Akko 3068B Plus'),(18,53,2200000,22,1,'/uploads/images/product/weikav-sugar65.jpg','Weikav Sugar65'),(20,54,400000,23,3,'/uploads/images/product/aula-f2088.jpg','AULA F2088'),(21,55,720000,24,1,'/uploads/images/product/lg-ultrafine-keyboard.jpg','LG UltraFine Keyboard'),(25,58,26000000,25,1,'/uploads/images/product/macbook-air-m2.jpg','MacBook Air M2'),(26,59,15000000,7,1,'/uploads/images/product/lenovo-ideapad-5.jpg','Lenovo IdeaPad 5'),(26,60,7500000,17,1,'/uploads/images/product/sony-wh-1000xm5.jpg','Sony WH-1000XM5'),(27,61,32000000,10,1,'/uploads/images/product/asus-rog-strix-g16.jpg','Asus ROG Strix G16'),(28,62,1650000,21,2,'/uploads/images/product/akko-3068b-plus.jpg','Akko 3068B Plus'),(28,63,2200000,18,1,'/uploads/images/product/jbl-tune-760nc.jpg','JBL Tune 760NC'),(28,64,400000,23,1,'/uploads/images/product/aula-f2088.jpg','AULA F2088'),(29,65,62000000,28,1,'/uploads/images/product/lenovo-thinkpad-p1.jpg','Lenovo ThinkPad P1'),(30,66,13500000,8,1,'/uploads/images/product/acer-aspire-5.jpg','Acer Aspire 5'),(31,67,42000000,14,1,'/uploads/images/product/hp-envy-16.jpg','HP Envy 16'),(31,68,2200000,22,1,'/uploads/images/product/weikav-sugar65.jpg','Weikav Sugar65'),(32,69,30000000,12,1,'/uploads/images/product/lenovo-legion-5.jpg','Lenovo Legion 5'),(33,70,7500000,17,1,'/uploads/images/product/sony-wh-1000xm5.jpg','Sony WH-1000XM5'),(34,71,16500000,5,1,'/uploads/images/product/dell-inspiron-14.jpg','Dell Inspiron 14'),(34,72,2200000,18,1,'/uploads/images/product/jbl-tune-760nc.jpg','JBL Tune 760NC'),(35,73,23000000,9,1,'/uploads/images/product/msi-gf63-thin.jpg','MSI GF63 Thin'),(36,74,54000000,13,1,'/uploads/images/product/asus-proart-studiobook.jpg','Asus ProArt Studiobook'),(37,75,3200000,19,1,'/uploads/images/product/marshall-major-iv.jpg','Marshall Major IV'),(37,76,720000,24,1,'/uploads/images/product/lg-ultrafine-keyboard.jpg','LG UltraFine Keyboard'),(38,77,42000000,14,1,'/uploads/images/product/hp-envy-16.jpg','HP Envy 16'),(39,78,1650000,21,1,'/uploads/images/product/akko-3068b-plus.jpg','Akko 3068B Plus'),(40,79,28000000,11,1,'/uploads/images/product/dell-g15.jpg','Dell G15'),(41,80,2200000,22,1,'/uploads/images/product/weikav-sugar65.jpg','Weikav Sugar65'),(42,81,720000,24,1,'/uploads/images/product/lg-ultrafine-keyboard.jpg','LG UltraFine Keyboard'),(43,82,2500000,20,1,'/uploads/images/product/sony-mdr-7506.jpg','Sony MDR-7506'),(44,83,400000,23,1,'/uploads/images/product/aula-f2088.jpg','AULA F2088'),(45,84,62000000,28,2,NULL,'Lenovo ThinkPad P1'),(45,85,13500000,26,1,NULL,'Asus Vivobook 15'),(45,86,38000000,27,1,NULL,'Acer Predator Helios 300'),(46,87,26000000,25,2,'/uploads/images/product/product_25_88b963a5-6e8b-4411-b6cb-3198be70f6ff.png','MacBook Air M2'),(47,88,62000000,28,1,'/uploads/images/product/product_28_2396eee3-2c0a-4167-a110-193c51c749f4.png','Lenovo ThinkPad P1'),(48,89,13500000,26,2,'/uploads/images/product/product_26_4b59ab26-d643-45af-8b2c-d13e80f03b0c.png','Asus Vivobook 15'),(49,90,26000000,25,2,'/uploads/images/product/product_25_88b963a5-6e8b-4411-b6cb-3198be70f6ff.png','MacBook Air M2'),(49,91,17500000,6,1,'/uploads/images/product/product_6_cf3ad224-edb6-4bb1-abe5-16efafa84906.png','HP Pavilion 15'),(50,92,42000000,3,8,'/uploads/images/product/product_3_4784819a-cb9c-4937-ac35-88800d6ba3bf.png','HP Spectre x360'),(51,93,42000000,3,8,'/uploads/images/product/product_3_4784819a-cb9c-4937-ac35-88800d6ba3bf.png','HP Spectre x360'),(52,94,41990000,29,2,'/uploads/images/product/product_29_8c3462b8-3af5-4aa9-b55a-f2663a8bb2cd.png','Dell XPS 15'),(52,95,38000000,27,1,'/uploads/images/product/product_27_614f6d49-cfaa-4dc0-9d1c-ec247e40362c.png','Acer Predator Helios 300'),(53,96,7500000,17,1,'/uploads/images/product/product_17_3e485d91-3062-478b-ba40-52221fb75912.png','Sony WH-1000XM5'),(53,97,720000,24,1,'/uploads/images/product/product_24_5371caf7-751e-4422-9335-172cae9b0349.png','LG UltraFine Keyboard'),(53,98,57000000,16,1,'/uploads/images/product/product_16_d4335cfd-5fb3-483b-bf83-c50591d80ab0.png','Dell Precision 5570'),(54,99,52000000,15,1,'/uploads/images/product/product_15_c1d5a600-674b-4b5b-a3bf-392851835fd5.png','MSI Creator Z16');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `coupon_id` int DEFAULT NULL,
  `discount_amount` double DEFAULT NULL,
  `order_id` int NOT NULL AUTO_INCREMENT,
  `subtotal_amount` double DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `confirmed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `delivered_at` datetime(6) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `pending_at` datetime(6) DEFAULT NULL,
  `returned_at` datetime(6) DEFAULT NULL,
  `shipping_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address_detail` varchar(255) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) NOT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `payment_method` enum('CASH','VN_PAY') DEFAULT NULL,
  `payment_status` enum('NOT_PAID','PAID') DEFAULT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','DELIVERED','PENDING','RETURNED','SHIPPING') DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FKa5ei0aklq6wrjl8vrr7ied3bx` (`coupon_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKa5ei0aklq6wrjl8vrr7ied3bx` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`coupon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES
(NULL,0,47,62000000,62000000,NULL,NULL,'2025-05-31 03:00:26.214102','2025-05-30 01:25:07.757671','2025-05-30 01:24:10.618193','2025-05-30 01:25:12.541896','2025-05-30 01:25:12.541896','2025-05-30 01:24:10.618193',NULL,'2025-05-30 01:25:09.356697','2025-05-31 03:00:26.219250','Thôn 1',NULL,'Quốc Oai','Nguyễn Hải Sơn','','0396006368','Hà Nội','sonnh@gmail.com','Phượng Cách','CASH','PAID','COMPLETED'),

(NULL,0,48,27000000,27000000,NULL,NULL,'2025-05-31 03:00:26.214102','2025-05-30 01:25:16.948676','2025-05-30 01:24:27.820879','2025-05-30 01:25:22.067069','2025-05-30 01:25:22.067069','2025-05-30 01:24:27.820879',NULL,'2025-05-30 01:25:18.736378','2025-05-31 03:00:26.219250','Thôn 1',NULL,'Quốc Oai','Phạm Thị Mai Liên','','0396006368','Hà Nội','liennt@gmail.com','Phượng Cách','CASH','PAID','COMPLETED'),

(NULL,0,55,19500000,19500000,NULL,NULL,'2025-06-05 09:15:00.000000','2025-06-04 08:30:00.000000','2025-06-04 07:15:00.000000','2025-06-05 10:20:00.000000','2025-06-05 10:20:00.000000','2025-06-04 07:15:00.000000',NULL,'2025-06-04 12:45:00.000000','2025-06-05 09:15:00.000000','Thôn 1',NULL,'Quốc Oai','Phan Văn Bộ','','0388888888','Hà Nội','phanbo@example.com','Phượng Cách','CASH','PAID','COMPLETED'),

(1,500000,52,121980000,121480000,2,NULL,NULL,NULL,'2025-06-02 23:34:38.096236',NULL,NULL,'2025-06-02 23:34:38.097235',NULL,NULL,'2025-06-02 23:34:38.097235','Thôn 1','GIAM500K','Quốc Oai','Nguyễn Văn Việt','','0396006368','Hà Nội','admin2@example.com','Phượng Cách','CASH','NOT_PAID','PENDING'),

(3,3000000,49,69500000,66500000,4,NULL,NULL,'2025-06-01 20:54:00.741248','2025-06-01 20:53:34.156464',NULL,'2025-06-01 20:54:00.741248','2025-06-01 20:53:34.156464',NULL,NULL,'2025-06-01 20:54:00.747244','Thôn 1','SALESAPSAN','Quốc Oai','Nguyễn Hữu Quân','Giao tận cửa','0396006368','Hà Nội','seller@gmail.com','Phượng Cách','VN_PAY','PAID','CONFIRMED');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `used` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,_binary '','2025-05-25 14:28:48.642145','2025-05-25 14:58:48.641147','sonnh@gmail.com','42f74f9c-754b-439f-955f-47386a99818f');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attribute_values`
--

DROP TABLE IF EXISTS `product_attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attribute_values` (
  `attribute_id` int NOT NULL,
  `product_attribute_value_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`product_attribute_value_id`),
  KEY `FKdhipfhjpy3gq5wlo3vc2h8uf` (`attribute_id`),
  KEY `FK9cv255c78bptiixa9axev9act` (`product_id`),
  CONSTRAINT `FK9cv255c78bptiixa9axev9act` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKdhipfhjpy3gq5wlo3vc2h8uf` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attribute_values`
--

LOCK TABLES `product_attribute_values` WRITE;
/*!40000 ALTER TABLE `product_attribute_values` DISABLE KEYS */;
INSERT INTO `product_attribute_values` VALUES (1,1,1,'Apple M3 Pro 11-core CPU'),(2,2,1,'Apple M3 Pro 14-core GPU'),(3,3,1,'18GB Unified Memory'),(4,4,1,'512GB SSD'),(5,5,1,'14.2-inch Liquid Retina XDR'),(6,6,1,'1.6 kg'),(7,7,1,'Lên đến 18 giờ'),(8,8,1,'macOS Sonoma'),(1,9,2,'Intel Core i7-13700H'),(2,10,2,'NVIDIA GeForce RTX 4050'),(3,11,2,'32GB DDR5'),(4,12,2,'1TB SSD'),(5,13,2,'15.6-inch OLED 3.5K'),(6,14,2,'1.8 kg'),(7,15,2,'Lên đến 8 giờ'),(8,16,2,'Windows 11 Pro'),(1,17,3,'Intel Core i7-1355U'),(2,18,3,'Intel Iris Xe Graphics'),(3,19,3,'16GB LPDDR4x'),(4,20,3,'512GB SSD'),(5,21,3,'13.5-inch OLED 3K2K'),(6,22,3,'1.3 kg'),(7,23,3,'Lên đến 10 giờ'),(8,24,3,'Windows 11 Home'),(1,25,4,'Intel Core i7-1360P'),(2,26,4,'Intel Iris Xe Graphics'),(3,27,4,'16GB LPDDR5'),(4,28,4,'1TB SSD'),(5,29,4,'14-inch 2.8K OLED'),(6,30,4,'1.4 kg'),(7,31,4,'Lên đến 12 giờ'),(8,32,4,'Windows 11 Home'),(1,33,5,'Intel Core i5-1235U'),(2,34,5,'Intel Iris Xe Graphics'),(3,35,5,'8GB DDR4'),(4,36,5,'256GB SSD'),(5,37,5,'14-inch FHD WVA'),(6,38,5,'1.5 kg'),(7,39,5,'Lên đến 7 giờ'),(8,40,5,'Windows 11 Home'),(1,41,6,'AMD Ryzen 5 7530U'),(2,42,6,'AMD Radeon Graphics'),(3,43,6,'8GB DDR4'),(4,44,6,'512GB SSD'),(5,45,6,'15.6-inch FHD IPS'),(6,46,6,'1.7 kg'),(7,47,6,'Lên đến 8 giờ'),(8,48,6,'Windows 11 Home'),(1,49,7,'AMD Ryzen 7 5700U'),(2,50,7,'AMD Radeon Graphics'),(3,51,7,'16GB DDR4'),(4,52,7,'512GB SSD'),(5,53,7,'15.6-inch FHD IPS'),(6,54,7,'1.6 kg'),(7,55,7,'Lên đến 9 giờ'),(8,56,7,'Windows 11 Home'),(1,57,8,'Intel Core i5-1235U'),(2,58,8,'Intel Iris Xe Graphics'),(3,59,8,'8GB DDR4'),(4,60,8,'256GB SSD'),(5,61,8,'15.6-inch FHD IPS'),(6,62,8,'1.7 kg'),(7,63,8,'Lên đến 7 giờ'),(8,64,8,'Windows 11 Home'),(1,65,9,'Intel Core i5-12450H'),(2,66,9,'NVIDIA GeForce GTX 1650'),(3,67,9,'8GB DDR4'),(4,68,9,'512GB SSD'),(5,69,9,'15.6-inch FHD IPS'),(6,70,9,'1.8 kg'),(7,71,9,'Lên đến 5 giờ'),(8,72,9,'Windows 11 Home'),(1,73,10,'Intel Core i7-13650HX'),(2,74,10,'NVIDIA GeForce RTX 4060'),(3,75,10,'16GB DDR5'),(4,76,10,'1TB SSD'),(5,77,10,'16-inch FHD 165Hz'),(6,78,10,'2.5 kg'),(7,79,10,'Lên đến 4 giờ'),(8,80,10,'Windows 11 Home'),(1,81,11,'Intel Core i5-12500H'),(2,82,11,'NVIDIA GeForce RTX 3050'),(3,83,11,'8GB DDR4'),(4,84,11,'512GB SSD'),(5,85,11,'15.6-inch FHD 120Hz'),(6,86,11,'2.3 kg'),(7,87,11,'Lên đến 5 giờ'),(8,88,11,'Windows 11 Home'),(1,89,12,'AMD Ryzen 7 6800H'),(2,90,12,'NVIDIA GeForce RTX 3060'),(3,91,12,'16GB DDR5'),(4,92,12,'512GB SSD'),(5,93,12,'15.6-inch FHD 165Hz'),(6,94,12,'2.4 kg'),(7,95,12,'Lên đến 6 giờ'),(8,96,12,'Windows 11 Home'),(1,97,13,'Intel Core i7-12700H'),(2,98,13,'NVIDIA GeForce RTX 3070 Ti'),(3,99,13,'32GB DDR5'),(4,100,13,'1TB SSD'),(5,101,13,'16-inch 4K OLED'),(6,102,13,'2.4 kg'),(7,103,13,'Lên đến 6 giờ'),(8,104,13,'Windows 11 Pro'),(1,105,14,'Intel Core i7-12700H'),(2,106,14,'NVIDIA GeForce RTX 3060'),(3,107,14,'16GB DDR5'),(4,108,14,'512GB SSD'),(5,109,14,'16-inch 2.5K IPS'),(6,110,14,'2.1 kg'),(7,111,14,'Lên đến 7 giờ'),(8,112,14,'Windows 11 Home'),(1,113,15,'Intel Core i7-12700H'),(2,114,15,'NVIDIA GeForce RTX 3070'),(3,115,15,'32GB DDR5'),(4,116,15,'1TB SSD'),(5,117,15,'16-inch QHD+ Touch'),(6,118,15,'2.2 kg'),(7,119,15,'Lên đến 6 giờ'),(8,120,15,'Windows 11 Pro'),(1,121,16,'Intel Core i7-12700H'),(2,122,16,'NVIDIA RTX A2000'),(3,123,16,'32GB DDR5'),(4,124,16,'1TB SSD'),(5,125,16,'15.6-inch 4K OLED'),(6,126,16,'1.9 kg'),(7,127,16,'Lên đến 8 giờ'),(8,128,16,'Windows 11 Pro'),(9,129,17,'30mm'),(10,130,17,'Có'),(11,131,17,'Bluetooth 5.2, USB-C'),(12,132,17,'Lên đến 30 giờ'),(13,133,17,'250g'),(14,134,17,'LDAC, DSEE Extreme'),(9,135,18,'40mm'),(10,136,18,'Có'),(11,137,18,'Bluetooth 5.0, 3.5mm'),(12,138,18,'Lên đến 35 giờ'),(13,139,18,'220g'),(14,140,18,'JBL Pure Bass Sound'),(9,141,19,'40mm'),(10,142,19,'Không'),(11,143,19,'3.5mm'),(12,144,19,'Lên đến 80 giờ'),(13,145,19,'165g'),(14,146,19,'Marshall Signature Sound'),(9,147,20,'40mm'),(10,148,20,'Không'),(11,149,20,'3.5mm, 6.35mm'),(12,150,20,'Không có'),(13,151,20,'230g'),(14,152,20,'Studio Monitor'),(15,153,21,'Nhựa ABS'),(16,154,21,'65% (68 phím)'),(17,155,21,'68'),(18,156,21,'Akko CS Switch'),(19,157,21,'RGB'),(20,158,21,'Lên đến 100 giờ'),(21,159,21,'750g'),(15,160,22,'Nhôm CNC'),(16,161,22,'65% (67 phím)'),(17,162,22,'67'),(18,163,22,'Gateron Pro'),(19,164,22,'RGB Per-key'),(20,165,22,'Lên đến 80 giờ'),(21,166,22,'900g'),(15,167,23,'Nhựa ABS'),(16,168,23,'Full size (104 phím)'),(17,169,23,'104'),(18,170,23,'Membrane'),(19,171,23,'Đơn sắc'),(20,172,23,'Không có'),(21,173,23,'600g'),(15,174,24,'Nhôm'),(16,175,24,'Compact (87 phím)'),(17,176,24,'87'),(18,177,24,'Scissor'),(19,178,24,'Không có'),(20,179,24,'Lên đến 6 tháng'),(21,180,24,'450g'),(1,181,25,'Apple M2 8-core CPU'),(2,182,25,'Apple M2 10-core GPU'),(3,183,25,'8GB Unified Memory'),(4,184,25,'256GB SSD'),(5,185,25,'13.6-inch Liquid Retina'),(6,186,25,'1.24 kg'),(7,187,25,'Lên đến 18 giờ'),(8,188,25,'macOS Ventura'),(1,189,26,'Intel Core i5-1235U'),(2,190,26,'Intel Iris Xe Graphics'),(3,191,26,'8GB DDR4'),(4,192,26,'512GB SSD'),(5,193,26,'15.6-inch FHD OLED'),(6,194,26,'1.7 kg'),(7,195,26,'Lên đến 9 giờ'),(8,196,26,'Windows 11 Home'),(1,197,27,'Intel Core i7-12700H'),(2,198,27,'NVIDIA GeForce RTX 4060'),(3,199,27,'16GB DDR5'),(4,200,27,'1TB SSD'),(5,201,27,'15.6-inch FHD 144Hz'),(6,202,27,'2.6 kg'),(7,203,27,'Lên đến 5 giờ'),(8,204,27,'Windows 11 Home'),(1,205,28,'Intel Core i9-12900H'),(2,206,28,'NVIDIA RTX A3000'),(3,207,28,'32GB DDR5'),(4,208,28,'1TB SSD'),(5,209,28,'16-inch 4K IPS'),(6,210,28,'1.8 kg'),(7,211,28,'Lên đến 10 giờ'),(8,212,28,'Windows 11 Pro'),(1,213,29,'Core i9 12900H'),(2,214,29,'RTX3070'),(3,215,29,'64GB DDR5'),(4,216,29,'1TB'),(5,217,29,'AMOLED 4K 16\"'),(6,218,29,'2.1 kg'),(7,219,29,'99 Wh'),(8,220,29,'Windows 11'),(1,221,30,'Ryzen 7 6600U'),(2,222,30,'Radeon 680M'),(3,223,30,'16GB DDR4'),(4,224,30,'512GB'),(5,225,30,'IPS, 1200x1800px, 16\"'),(6,226,30,'1.8 kg'),(7,227,30,'60 Wh'),(8,228,30,'Windows 11 Home');
/*!40000 ALTER TABLE `product_attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `product_id` int NOT NULL,
  `product_image_id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`product_image_id`),
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (2,1,'/uploads/images/product/product_2_20e7f5ac-9a2e-4c8f-88b4-310c010eb70f.png'),(2,2,'/uploads/images/product/product_2_e97ca2c6-134d-4fec-9fa8-23f941629fa3.png'),(6,3,'/uploads/images/product/product_6_cf3ad224-edb6-4bb1-abe5-16efafa84906.png'),(7,4,'/uploads/images/product/product_7_de21af87-2f22-4ec8-b536-877faccf4646.png'),(10,5,'/uploads/images/product/product_10_bef727e7-8659-4184-bf34-09fc489a246a.png'),(1,6,'/uploads/images/product/product_1_3b09864e-244f-444b-956f-41769e2949c6.png'),(3,7,'/uploads/images/product/product_3_4784819a-cb9c-4937-ac35-88800d6ba3bf.png'),(4,8,'/uploads/images/product/product_4_fa2ecb3c-394b-42c6-9e31-f249b1760634.png'),(5,9,'/uploads/images/product/product_5_4db26256-cf47-4103-8e7d-8aecc8f8cc32.png'),(8,10,'/uploads/images/product/product_8_951b8c45-684e-4819-b8d1-f8ef201c2fb3.png'),(9,11,'/uploads/images/product/product_9_f694398f-d33e-429a-8311-7b5b9e471df2.png'),(11,12,'/uploads/images/product/product_11_6359631c-2c2a-4dea-8532-2d50e1f9c9ad.png'),(12,13,'/uploads/images/product/product_12_73b7d97d-0ddf-481d-acc9-53ccd97c800e.png'),(13,14,'/uploads/images/product/product_13_88b8e940-9875-4d7b-bdba-2ac27b193098.png'),(14,15,'/uploads/images/product/product_14_715e4f40-05e1-414c-b197-ee45f6602f97.png'),(15,16,'/uploads/images/product/product_15_c1d5a600-674b-4b5b-a3bf-392851835fd5.png'),(16,17,'/uploads/images/product/product_16_d4335cfd-5fb3-483b-bf83-c50591d80ab0.png'),(28,19,'/uploads/images/product/product_28_2396eee3-2c0a-4167-a110-193c51c749f4.png'),(27,20,'/uploads/images/product/product_27_614f6d49-cfaa-4dc0-9d1c-ec247e40362c.png'),(26,21,'/uploads/images/product/product_26_4b59ab26-d643-45af-8b2c-d13e80f03b0c.png'),(25,22,'/uploads/images/product/product_25_88b963a5-6e8b-4411-b6cb-3198be70f6ff.png'),(17,23,'/uploads/images/product/product_17_3e485d91-3062-478b-ba40-52221fb75912.png'),(21,24,'/uploads/images/product/product_21_83b971e5-036c-4505-b4f5-c9a4c8033146.png'),(29,25,'/uploads/images/product/product_29_8c3462b8-3af5-4aa9-b55a-f2663a8bb2cd.png'),(29,26,'/uploads/images/product/product_29_d2fb093f-e49e-4158-9124-9b865a8204a2.png'),(30,27,'/uploads/images/product/product_30_ae5221b6-1ff9-4a0f-b8c8-17a9f6b0e292.png'),(30,28,'/uploads/images/product/product_30_995edc59-8d27-4069-9253-2d11984e7848.png'),(19,29,'/uploads/images/product/product_19_8a4d991f-c4f9-4935-b8c4-8a4148efe228.png'),(18,30,'/uploads/images/product/product_18_24adf7bf-4709-413e-b88d-ad4397fb7209.png'),(18,31,'/uploads/images/product/product_18_c4fb08d2-1f5b-4017-930d-dbb2a342a391.png'),(20,32,'/uploads/images/product/product_20_92460b46-e9e5-4c5d-a14c-e5df6d474fdf.png'),(20,33,'/uploads/images/product/product_20_e5b99623-ce28-477e-b178-3d42f3c863c3.png'),(24,34,'/uploads/images/product/product_24_42cade32-85c8-4711-91af-a56fa18d6ca2.png'),(24,35,'/uploads/images/product/product_24_2e478f31-c36c-433b-9a26-49b6ff59fb7e.png'),(22,37,'/uploads/images/product/product_22_50dba5dc-7971-4bfe-bd12-1787f5a98bd3.png'),(23,38,'/uploads/images/product/product_23_f8f29b4d-37a9-4172-a942-b38cf5d001da.png');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `brand_id` int NOT NULL,
  `category_id` int NOT NULL,
  `discount_percent` int DEFAULT NULL,
  `discount_price` decimal(38,2) DEFAULT NULL,
  `is_enabled` bit(1) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `product_id` int NOT NULL AUTO_INCREMENT,
  `stock_quantity` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `description` text,
  `product_name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `UKfhmd06dsmj6k0n90swsh8ie9g` (`sku`),
  KEY `FKa3a4mpsfdf4d2y6r8ra3sc8mv` (`brand_id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKa3a4mpsfdf4d2y6r8ra3sc8mv` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,4,9,50000000.00,_binary '',55000000.00,1,10,'2025-05-25 18:09:25.000000','2025-06-01 03:11:35.795284','Laptop cao cấp của Apple','MacBook Pro 14 M3 Pro','MBP14M3PRO'),(4,4,6,45000000.00,_binary '',48000000.00,2,13,'2025-05-25 18:09:25.000000','2025-06-01 02:23:40.130630','Laptop cao cấp mỏng nhẹ','Dell XPS 15','XPS15'),(5,4,NULL,NULL,_binary '',42000000.00,3,8,'2025-05-25 18:09:25.000000','2025-06-02 23:13:33.532010','Laptop 2-in-1 cao cấp','HP Spectre x360','SPTX360'),(6,4,5,37000000.00,_binary '',39000000.00,4,15,'2025-05-25 18:09:25.000000','2025-05-28 02:31:58.928423','Laptop Yoga cao cấp','Lenovo Yoga 9i','YOGA9I'),(5,5,8,16500000.00,_binary '',18000000.00,5,30,'2025-05-25 18:09:25.000000','2025-05-28 02:32:11.102336','Laptop văn phòng phổ thông','Dell Inspiron 14','INS14'),(5,5,NULL,NULL,_binary '',17500000.00,6,24,'2025-05-25 18:09:25.000000','2025-06-01 20:53:34.197106','Laptop văn phòng mỏng nhẹ','HP Pavilion 15','PAV15'),(6,5,6,15000000.00,_binary '',16000000.00,7,40,'2025-05-25 18:09:25.000000','2025-05-25 18:16:44.206801','Laptop văn phòng giá tốt','Lenovo IdeaPad 5','IPAD5'),(7,5,7,13500000.00,_binary '',14500000.00,8,35,'2025-05-25 18:09:25.000000','2025-05-28 02:32:21.560531','Laptop văn phòng hiệu năng ổn','Acer Aspire 5','ASPIRE5'),(2,6,8,23000000.00,_binary '',25000000.00,9,20,'2025-05-25 18:09:25.000000','2025-05-28 02:32:29.414292','Laptop Gaming phổ thông','MSI GF63 Thin','GF63THIN'),(3,6,9,32000000.00,_binary '',35000000.00,10,18,'2025-05-25 18:09:25.000000','2025-05-25 18:16:55.750873','Laptop Gaming hiệu năng cao','Asus ROG Strix G16','STRIXG16'),(4,6,NULL,NULL,_binary '',28000000.00,11,22,'2025-05-25 18:09:25.000000','2025-05-28 02:32:39.046526','Laptop Gaming bền bỉ','Dell G15','DELLG15'),(6,6,6,30000000.00,_binary '',32000000.00,12,15,'2025-05-25 18:09:25.000000','2025-05-28 02:32:52.888070','Laptop Gaming cân bằng','Lenovo Legion 5','LEGION5'),(3,7,7,54000000.00,_binary '',58000000.00,13,7,'2025-05-25 18:09:25.000000','2025-05-28 02:33:02.573533','Laptop chuyên đồ họa','Asus ProArt Studiobook','PROART'),(5,7,7,42000000.00,_binary '',45000000.00,14,9,'2025-05-25 18:09:25.000000','2025-05-28 02:33:13.577968','Laptop đồ họa đa năng','HP Envy 16','ENVY16'),(2,7,NULL,NULL,_binary '',52000000.00,15,5,'2025-05-25 18:09:25.000000','2025-06-03 02:06:13.600685','Laptop Creator mạnh mẽ','MSI Creator Z16','CREATORZ16'),(4,7,5,57000000.00,_binary '',60000000.00,16,4,'2025-05-25 18:09:25.000000','2025-06-02 23:36:20.632407','Máy trạm di động','Dell Precision 5570','PREC5570'),(10,8,12,7500000.00,_binary '',8500000.00,17,23,'2025-05-25 18:22:52.000000','2025-06-02 23:36:20.632407','Tai nghe không dây chống ồn cao cấp','Sony WH-1000XM5','SONYWH1000XM5'),(9,8,12,2200000.00,_binary '',2500000.00,18,40,'2025-05-25 18:22:52.000000','2025-06-03 01:13:52.143683','Tai nghe không dây chống ồn giá rẻ','JBL Tune 760NC','JBLTUNE760NC'),(11,9,NULL,NULL,_binary '',3200000.00,19,30,'2025-05-25 18:22:52.000000','2025-06-03 01:13:38.162487','Tai nghe có dây phong cách vintage','Marshall Major IV','MARSHALLMAJOR4'),(10,9,11,2500000.00,_binary '',2800000.00,20,19,'2025-05-25 18:22:52.000000','2025-06-03 01:14:02.047689','Tai nghe studio chuyên nghiệp','Sony MDR-7506','SONYMDR7506'),(12,11,8,1650000.00,_binary '',1800000.00,21,35,'2025-05-25 18:22:52.000000','2025-05-30 02:25:59.862974','Bàn phím cơ 65% layout','Akko 3068B Plus','AKKO3068BPLUS'),(13,11,NULL,NULL,_binary '',2200000.00,22,15,'2025-05-25 18:22:52.000000','2025-06-03 01:14:42.039464','Bàn phím cơ custom cao cấp','Weikav Sugar65','WEIKAVSUGAR65'),(14,10,11,400000.00,_binary '',450000.00,23,50,'2025-05-25 18:22:52.000000','2025-06-03 01:14:34.392430','Bàn phím membrane văn phòng','AULA F2088','AULAF2088'),(8,10,10,720000.00,_binary '',800000.00,24,43,'2025-05-25 18:22:52.000000','2025-06-03 01:14:13.090529','Bàn phím mỏng cho văn phòng','LG UltraFine Keyboard','LGULTRAFINE'),(1,4,7,26000000.00,_binary '',28000000.00,25,14,'2025-05-25 18:24:14.000000','2025-06-01 20:53:34.197106','Laptop siêu mỏng nhẹ của Apple','MacBook Air M2','MBAIRM2'),(3,5,10,13500000.00,_binary '',15000000.00,26,22,'2025-05-25 18:24:14.000000','2025-05-30 01:24:27.825876','Laptop văn phòng hiệu năng tốt','Asus Vivobook 15','VIVOBOOK15'),(7,6,NULL,NULL,_binary '',38000000.00,27,10,'2025-05-25 18:24:14.000000','2025-06-02 23:34:38.112230','Laptop Gaming mạnh mẽ','Acer Predator Helios 300','PREDATORH300'),(6,7,5,62000000.00,_binary '',65000000.00,28,4,'2025-05-25 18:24:14.000000','2025-06-01 03:38:45.211795','Workstation di động cao cấp','Lenovo ThinkPad P1','THINKPADP1'),(4,4,7,41990000.00,_binary '',44990000.00,29,19,'2025-06-02 23:06:42.659638','2025-06-02 23:34:38.111230','Sản phẩm cao cấp đến từ nhà thương hiệu nổi tiếng của Mỹ.','Dell XPS 15','GGHDFTW'),(6,5,13,19990000.00,_binary '',22990000.00,30,33,'2025-06-02 23:11:10.490204','2025-06-02 23:11:48.033836','Sản phẩm có p/p vô cùng tốt.','Lenovo IdeaPad 5','GGHDABC');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UK716hgxp60ym1lifrdgp67xt5k` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'SELLER'),(3,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `is_deleted` bit(1) NOT NULL,
  `role_id` int NOT NULL,
  `user_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(_binary '\0',1,1,'2025-05-25 14:28:01.019690','2025-05-25 14:29:09.181552',NULL,'/uploads/images/user/default-avatar.jpg','sonnh@gmail.com','Nguyễn Hải Sơn','$2a$10$110ZeMSDneBeyRekTQVQNeZuh3lZR2YletwzlBSsrvCGlqOMpakiu',NULL),

(_binary '\0',1,2,'2025-05-25 17:13:09.806952','2025-05-25 17:13:09.806952',NULL,'/uploads/images/user/default-avatar.jpg','admin2@example.com','Phạm Thị Mai Liên','$2a$10$/aeoXM9GNOi0IryCcmAniujo68TheAic7sU3h9Kxbi517txeOV4jG',NULL),

(_binary '\0',3,3,'2025-01-25 17:13:22.282868','2025-05-25 17:13:22.282868',NULL,'/uploads/images/user/default-avatar.jpg','user@gmail.com','Phan Văn Bộ','$2a$10$pS44YvQuGS6S8slt4ShbNelfumATnY1Zm6hSRk.iX87XskT8FxazW',NULL),

(_binary '\0',2,4,'2025-05-25 17:13:33.072274','2025-06-01 20:54:38.269906',NULL,'/uploads/images/user/avatar_4_aa220e06-3a7c-48b1-989a-d0466f27348d.jpg','seller@gmail.com','Nguyễn Văn Việt','$2a$10$110ZeMSDneBeyRekTQVQNeZuh3lZR2YletwzlBSsrvCGlqOMpakiu',NULL),

(_binary '',3,5,'2025-05-25 17:13:49.151734','2025-06-01 02:50:59.769117',NULL,'/uploads/images/user/default-avatar.jpg','user2@gmail.com','Nguyễn Hữu Quân','$2a$10$f0w.9boeH/CDkgf6hvr5XubUXnyjvwqTj9kQrDaUoDSPhkKw8eMpO',NULL),

(_binary '\0',3,6,'2025-02-25 17:16:13.761617','2025-05-25 17:16:13.761617',NULL,'/uploads/images/user/default-avatar.jpg','nguyennguyen@gmail.com','Nguyễn An Nguyên','$2a$10$DmePPW3Ybd/t0k0EkrmZMe.74H92O9ap4A5z15hnS71tU.9TphyW.',NULL),

(_binary '\0',3,7,'2025-03-25 17:16:13.761617','2025-05-25 17:16:13.761617',NULL,'/uploads/images/user/default-avatar.jpg','nguyenanh@gmail.com','Nguyễn Đức Anh','$2a$10$DmePPW3Ybd/t0k0EkrmZMe.74H92O9ap4A5z15hnS71tU.9TphyW.',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-18 22:53:24
