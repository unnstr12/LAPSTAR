package com.nah.backend.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.nah.backend.dto.banner.BannerDTO;
import com.nah.backend.dto.banner.request.CreateBannerRequest;
import com.nah.backend.dto.banner.request.UpdateBannerRequest;

public interface BannerService {
    // Lấy tất cả banner
    List<BannerDTO> getAllBanners();
    
    // Lấy banner theo ID
    BannerDTO getBannerById(Long id);
    
    // Tạo banner mới với file ảnh
    BannerDTO createBanner(CreateBannerRequest request, MultipartFile imageFile);
    
    // Cập nhật banner
    BannerDTO updateBanner(Long id, UpdateBannerRequest request);
    
    // Cập nhật ảnh banner
    BannerDTO updateBannerImage(Long id, MultipartFile imageFile);
    
    // Xóa banner
    void deleteBanner(Long id);
    
    // Lấy tất cả banner đang active
    List<BannerDTO> getAllActiveBanners();
    
    // Thay đổi trạng thái active của banner
    BannerDTO toggleBannerStatus(Long id);
} 
