package com.nah.backend.service.impl;

import com.nah.backend.dto.blog.BlogDTO;
import com.nah.backend.dto.blog.request.CreateBlogRequest;
import com.nah.backend.dto.blog.request.UpdateBlogRequest;
import com.nah.backend.model.Blog;
import com.nah.backend.model.Blog.BlogType;
import com.nah.backend.repository.BlogRepository;
import com.nah.backend.service.BlogService;
import com.nah.backend.util.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final FileUploadUtil fileUploadUtil;
    
    // Thư mục con cho lưu trữ ảnh blog
    private static final String BLOG_UPLOAD_DIR = "blog";

    @Override
    @Transactional
    public BlogDTO createBlog(CreateBlogRequest request) {
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setCoverImageUrl(request.getCoverImageUrl());
        blog.setBlogType(request.getBlogType() != null ? request.getBlogType() : BlogType.BLOG);
        blog.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : false);
        if (blog.getIsPublished()) {
            blog.setPublishedAt(LocalDateTime.now());
        }
        Blog saved = blogRepository.save(blog);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public BlogDTO updateBlog(Integer blogId, UpdateBlogRequest request) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài viết với ID: " + blogId));
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setCoverImageUrl(request.getCoverImageUrl());
        blog.setBlogType(request.getBlogType() != null ? request.getBlogType() : blog.getBlogType());
        blog.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : blog.getIsPublished());
        if (blog.getIsPublished() && blog.getPublishedAt() == null) {
            blog.setPublishedAt(LocalDateTime.now());
        }
        Blog updated = blogRepository.save(blog);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteBlog(Integer blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài viết với ID: " + blogId));
        
        // Xóa ảnh cover nếu có
        if (blog.getCoverImageUrl() != null && !blog.getCoverImageUrl().isEmpty()) {
            fileUploadUtil.deleteFile(blog.getCoverImageUrl());
        }
        
        blogRepository.deleteById(blogId);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogDTO getBlogById(Integer blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài viết với ID: " + blogId));
        return convertToDTO(blog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogDTO> getAllBlogs(Boolean isPublished) {
        List<Blog> blogs = blogRepository.findByIsPublishedOrderByCreatedAtDesc(isPublished);
        return blogs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BlogDTO> getBlogsByType(BlogType blogType, Boolean isPublished) {
        List<Blog> blogs = blogRepository.findByBlogTypeAndIsPublishedOrderByCreatedAtDesc(blogType, isPublished);
        return blogs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getAllBlogs(Boolean isPublished, Pageable pageable) {
        Page<Blog> page = blogRepository.findAll(pageable);
        List<BlogDTO> dtos = page.getContent().stream()
                .filter(b -> b.getIsPublished().equals(isPublished))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }
    
    @Override
    @Transactional
    public BlogDTO uploadCoverImage(Integer blogId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Không thể upload file trống");
        }
        
        // Lấy thông tin blog
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài viết với ID: " + blogId));
        
        // Xóa ảnh cover cũ nếu có
        if (blog.getCoverImageUrl() != null && !blog.getCoverImageUrl().isEmpty()) {
            fileUploadUtil.deleteFile(blog.getCoverImageUrl());
        }
        
        // Lưu file mới vào thư mục con blog và lấy đường dẫn
        String coverImageUrl = fileUploadUtil.saveFile(file, "cover_" + blogId, BLOG_UPLOAD_DIR);
        
        // Cập nhật ảnh cover cho blog
        blog.setCoverImageUrl(coverImageUrl);
        blog.setUpdatedAt(LocalDateTime.now());
        
        // Lưu thay đổi
        Blog updatedBlog = blogRepository.save(blog);
        return convertToDTO(updatedBlog);
    }
    
    @Override
    @Transactional
    public BlogDTO removeCoverImage(Integer blogId) {
        // Lấy thông tin blog
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài viết với ID: " + blogId));
        
        // Xóa ảnh cover cũ nếu có
        if (blog.getCoverImageUrl() != null && !blog.getCoverImageUrl().isEmpty()) {
            fileUploadUtil.deleteFile(blog.getCoverImageUrl());
        }
        
        // Cập nhật ảnh cover thành null
        blog.setCoverImageUrl(null);
        blog.setUpdatedAt(LocalDateTime.now());
        
        // Lưu thay đổi
        Blog updatedBlog = blogRepository.save(blog);
        return convertToDTO(updatedBlog);
    }

    private BlogDTO convertToDTO(Blog blog) {
        return new BlogDTO(
                blog.getBlogId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getCoverImageUrl(),
                blog.getBlogType(),
                blog.getIsPublished(),
                blog.getCreatedAt(),
                blog.getUpdatedAt(),
                blog.getPublishedAt()
        );
    }
} 