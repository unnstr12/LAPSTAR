package com.nah.backend.controller.admin;

import com.nah.backend.dto.blog.BlogDTO;
import com.nah.backend.dto.blog.request.CreateBlogRequest;
import com.nah.backend.dto.blog.request.UpdateBlogRequest;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.model.Blog.BlogType;
import com.nah.backend.service.BlogService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminBlogController {

    private final BlogService blogService;

    /**
     * Lấy tất cả blog/policy
     */
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<List<BlogDTO>>> getAllBlogs(
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(required = false) BlogType blogType) {
        
        if (isPublished != null && blogType != null) {
            List<BlogDTO> blogs = blogService.getBlogsByType(blogType, isPublished);
            return ResponseEntity.ok(ApiResponse.success(blogs));
        } else if (isPublished != null) {
            List<BlogDTO> blogs = blogService.getAllBlogs(isPublished);
            return ResponseEntity.ok(ApiResponse.success(blogs));
        } else {
            List<BlogDTO> blogs = blogService.getAllBlogs(null);
            return ResponseEntity.ok(ApiResponse.success(blogs));
        }
    }

    /**
     * Lấy danh sách blog phân trang
     */
    @GetMapping("/blogs/page")
    public ResponseEntity<ApiResponse<Page<BlogDTO>>> getPagedBlogs(
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BlogDTO> blogs = blogService.getAllBlogs(isPublished != null ? isPublished : false, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(blogs));
    }

    /**
     * Lấy blog theo ID
     */
    @GetMapping("/blogs/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Integer id) {
        try {
            BlogDTO blog = blogService.getBlogById(id);
            return ResponseEntity.ok(ApiResponse.success(blog));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Tạo mới blog/policy
     */
    @PostMapping("/blogs")
    public ResponseEntity<?> createBlog(@Valid @RequestBody CreateBlogRequest request) {
        try {
            BlogDTO createdBlog = blogService.createBlog(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo mới bài viết thành công", createdBlog));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Cập nhật blog/policy
     */
    @PutMapping("/blogs/{id}")
    public ResponseEntity<?> updateBlog(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateBlogRequest request) {
        try {
            BlogDTO updatedBlog = blogService.updateBlog(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật bài viết thành công", updatedBlog));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Xóa blog/policy
     */
    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Integer id) {
        try {
            blogService.deleteBlog(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa bài viết thành công"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Upload ảnh cover cho blog
     */
    @PostMapping("/blogs/{id}/cover")
    public ResponseEntity<?> uploadBlogCover(@PathVariable Integer id, 
                                          @RequestParam("file") MultipartFile file) {
        try {
            BlogDTO updatedBlog = blogService.uploadCoverImage(id, file);
            return ResponseEntity.ok(ApiResponse.success("Upload ảnh cover thành công", updatedBlog));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi khi upload ảnh cover: " + e.getMessage()));
        }
    }
    
    /**
     * Xóa ảnh cover của blog
     */
    @DeleteMapping("/blogs/{id}/cover")
    public ResponseEntity<?> removeBlogCover(@PathVariable Integer id) {
        try {
            BlogDTO updatedBlog = blogService.removeCoverImage(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa ảnh cover thành công", updatedBlog));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
} 