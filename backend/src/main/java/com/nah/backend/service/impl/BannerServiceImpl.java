package com.nah.backend.service.impl;

import com.nah.backend.dto.banner.BannerDTO;
import com.nah.backend.dto.banner.request.CreateBannerRequest;
import com.nah.backend.dto.banner.request.UpdateBannerRequest;
import com.nah.backend.model.Banner;
import com.nah.backend.repository.BannerRepository;
import com.nah.backend.service.BannerService;
import com.nah.backend.util.FileUploadUtil;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;
    private final FileUploadUtil fileUploadUtil;
    
    // Thư mục con cho lưu trữ banner
    private static final String BANNER_UPLOAD_DIR = "images/banner";

    @Override
    public List<BannerDTO> getAllBanners() {
        return bannerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BannerDTO getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy banner với id: " + id));
        return convertToDTO(banner);
    }

    @Override
    @Transactional
    public BannerDTO createBanner(CreateBannerRequest request, MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("File ảnh không được để trống");
        }

        try {
            // Lưu file ảnh vào thư mục con banner
            String imageUrl = fileUploadUtil.saveFile(imageFile, "banner", BANNER_UPLOAD_DIR);
            
            // Tạo banner mới
            Banner banner = new Banner();
            banner.setName(request.getName());
            banner.setImageUrl(imageUrl);
            banner.setUrl(request.getUrl());
            banner.setIsActive(request.getIsActive());
            
            Banner savedBanner = bannerRepository.save(banner);
            return convertToDTO(savedBanner);
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file ảnh banner: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public BannerDTO updateBanner(Long id, UpdateBannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy banner với id: " + id));
        
        banner.setName(request.getName());
        
        if (request.getImageUrl() != null) {
            banner.setImageUrl(request.getImageUrl());
        }
        
        banner.setUrl(request.getUrl());
        
        if (request.getIsActive() != null) {
            banner.setIsActive(request.getIsActive());
        }
        
        Banner updatedBanner = bannerRepository.save(banner);
        return convertToDTO(updatedBanner);
    }

    @Override
    @Transactional
    public BannerDTO updateBannerImage(Long id, MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("File ảnh không được để trống");
        }
        
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy banner với id: " + id));
        
        try {
            // Xóa file ảnh cũ nếu có
            if (banner.getImageUrl() != null && !banner.getImageUrl().isEmpty()) {
                fileUploadUtil.deleteFile(banner.getImageUrl());
            }
            
            // Lưu file ảnh mới vào thư mục con banner
            String imageUrl = fileUploadUtil.saveFile(imageFile, "banner_" + id, BANNER_UPLOAD_DIR);
            
            // Cập nhật đường dẫn ảnh
            banner.setImageUrl(imageUrl);
            
            Banner updatedBanner = bannerRepository.save(banner);
            return convertToDTO(updatedBanner);
        } catch (IOException e) {
            throw new RuntimeException("Không thể cập nhật ảnh banner: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy banner với id: " + id));
        
        // Xóa file ảnh
        if (banner.getImageUrl() != null && !banner.getImageUrl().isEmpty()) {
            fileUploadUtil.deleteFile(banner.getImageUrl());
        }
        
        bannerRepository.deleteById(id);
    }

    @Override
    public List<BannerDTO> getAllActiveBanners() {
        return bannerRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BannerDTO toggleBannerStatus(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy banner với id: " + id));
        
        banner.setIsActive(!banner.getIsActive());
        
        Banner updatedBanner = bannerRepository.save(banner);
        return convertToDTO(updatedBanner);
    }
    
    private BannerDTO convertToDTO(Banner banner) {
        BannerDTO dto = new BannerDTO();
        dto.setId(banner.getId());
        dto.setName(banner.getName());
        dto.setImageUrl(banner.getImageUrl());
        dto.setUrl(banner.getUrl());
        dto.setIsActive(banner.getIsActive());
        dto.setCreatedAt(banner.getCreatedAt());
        return dto;
    }
} 
