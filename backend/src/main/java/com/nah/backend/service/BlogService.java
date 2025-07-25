package com.nah.backend.service;

import com.nah.backend.dto.blog.BlogDTO;
import com.nah.backend.dto.blog.request.CreateBlogRequest;
import com.nah.backend.dto.blog.request.UpdateBlogRequest;
import com.nah.backend.model.Blog.BlogType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BlogService {
    BlogDTO createBlog(CreateBlogRequest request);
    BlogDTO updateBlog(Integer blogId, UpdateBlogRequest request);
    void deleteBlog(Integer blogId);
    BlogDTO getBlogById(Integer blogId);
    List<BlogDTO> getAllBlogs(Boolean isPublished);
    List<BlogDTO> getBlogsByType(BlogType blogType, Boolean isPublished);
    Page<BlogDTO> getAllBlogs(Boolean isPublished, Pageable pageable);
    BlogDTO uploadCoverImage(Integer blogId, MultipartFile file) throws IOException;
    BlogDTO removeCoverImage(Integer blogId);
}