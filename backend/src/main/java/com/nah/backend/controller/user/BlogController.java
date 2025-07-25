package com.nah.backend.controller.user;

import com.nah.backend.dto.blog.BlogDTO;
import com.nah.backend.dto.common.ApiResponse;
import com.nah.backend.model.Blog.BlogType;
import com.nah.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    /**
     * Lấy tất cả các blog đã xuất bản
     */
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<List<BlogDTO>>> getAllPublishedBlogs() {
        List<BlogDTO> blogs = blogService.getBlogsByType(BlogType.BLOG, true);
        return ResponseEntity.ok(ApiResponse.success(blogs));
    }

    /**
     * Lấy tất cả các chính sách đã xuất bản
     */
    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<List<BlogDTO>>> getAllPublishedPolicies() {
        List<BlogDTO> policies = blogService.getBlogsByType(BlogType.POLICY, true);
        return ResponseEntity.ok(ApiResponse.success(policies));
    }

    /**
     * Lấy danh sách blog phân trang
     */
    @GetMapping("/blogs/page")
    public ResponseEntity<ApiResponse<Page<BlogDTO>>> getPagedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<BlogDTO> blogs = blogService.getAllBlogs(true, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(blogs));
    }

    /**
     * Lấy blog theo ID
     */
    @GetMapping("/blogs/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Integer id) {
        try {
            BlogDTO blog = blogService.getBlogById(id);
            // Chỉ trả về nếu đã xuất bản
            if (blog.getIsPublished()) {
                return ResponseEntity.ok(ApiResponse.success(blog));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lấy policy theo ID
     */
    @GetMapping("/policies/{id}")
    public ResponseEntity<?> getPolicyById(@PathVariable Integer id) {
        try {
            BlogDTO policy = blogService.getBlogById(id);
            // Chỉ trả về nếu là policy và đã xuất bản
            if (policy.getBlogType() == BlogType.POLICY && policy.getIsPublished()) {
                return ResponseEntity.ok(ApiResponse.success(policy));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 