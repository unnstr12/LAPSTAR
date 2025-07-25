package com.nah.backend.repository;

import com.nah.backend.model.Blog;
import com.nah.backend.model.Blog.BlogType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByIsPublishedTrueOrderByPublishedAtDesc();
    List<Blog> findByIsPublishedOrderByCreatedAtDesc(Boolean isPublished);
    List<Blog> findByBlogTypeAndIsPublishedTrueOrderByPublishedAtDesc(BlogType blogType);
    List<Blog> findByBlogTypeAndIsPublishedOrderByCreatedAtDesc(BlogType blogType, Boolean isPublished);
} 