package com.nah.backend.dto.blog.request;

import com.nah.backend.model.Blog.BlogType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBlogRequest {
    private String title;
    private String content; // HTML từ WYSIWYG
    private String coverImageUrl; // Đường dẫn ảnh đại diện (nếu có)
    private BlogType blogType = BlogType.BLOG; // Mặc định là BLOG
    private Boolean isPublished;
} 