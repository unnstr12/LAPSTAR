package com.nah.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadUtil {

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Lưu file và trả về đường dẫn tương đối của file
     * 
     * @param file MultipartFile để lưu
     * @param customPrefix tiền tố tùy chỉnh cho tên file
     * @param subDir thư mục con để lưu file (ví dụ: "banner", "user", "product")
     * @return đường dẫn tương đối của file đã lưu
     * @throws IOException nếu có lỗi IO
     */
    public String saveFile(MultipartFile file, String customPrefix, String subDir) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Không thể lưu file trống");
        }

        // Tạo đường dẫn đầy đủ với thư mục con
        String uploadPath = uploadDir;
        if (subDir != null && !subDir.isEmpty()) {
            uploadPath = uploadDir + "/" + subDir;
        }
        
        // Tạo thư mục nếu chưa tồn tại
        Path dirPath = Paths.get(uploadPath);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        // Lấy tên file gốc và phần mở rộng
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Tạo tên file mới
        String newFilename = customPrefix + "_" + UUID.randomUUID().toString() + fileExtension;

        // Lưu file vào thư mục upload
        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = dirPath.resolve(newFilename);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Trả về đường dẫn tương đối
            return "/uploads/" + (subDir != null && !subDir.isEmpty() ? subDir + "/" : "") + newFilename;
        } catch (IOException e) {
            throw new IOException("Không thể lưu file: " + originalFilename, e);
        }
    }
    
    /**
     * Phương thức wrapper để tương thích với code cũ
     */
    public String saveFile(MultipartFile file, String customPrefix) throws IOException {
        return saveFile(file, customPrefix, "");
    }
    
    /**
     * Xóa file từ hệ thống tệp
     * 
     * @param fileUrl đường dẫn tương đối của file
     * @return true nếu xóa thành công, false nếu không
     */
    public boolean deleteFile(String fileUrl) {
        try {
            // Bỏ phần "/uploads/" trong URL
            String relativePath = fileUrl.replace("/uploads/", "");
            
            // Tạo đường dẫn đầy đủ
            Path filePath = Paths.get(uploadDir).resolve(relativePath);
            
            return Files.deleteIfExists(filePath);
        } catch (Exception e) {
            return false;
        }
    }
} 