package com.nah.backend.dto.blog;

import com.nah.backend.model.Blog.BlogType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogDTO {
    private Integer blogId;
    private String title;
    private String content;
    private String coverImageUrl;
    private BlogType blogType;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
} 