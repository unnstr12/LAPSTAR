package com.nah.backend.filter;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.util.MultiValueMap;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class FileTypeValidationFilter implements Filter {

    private final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(
            Arrays.asList("image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif", "image/svg+xml", "image/heic", "image/heif")
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        if (httpRequest.getContentType() != null &&
            httpRequest.getContentType().startsWith("multipart/form-data") &&
            httpRequest instanceof MultipartHttpServletRequest) {

            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) httpRequest;
            MultiValueMap<String, MultipartFile> fileMap = multipartRequest.getMultiFileMap();

            for (List<MultipartFile> files : fileMap.values()) {
                for (MultipartFile file : files) {
                    if (file != null && !file.isEmpty()) {
                        String contentType = file.getContentType();
                        if (contentType != null && !ALLOWED_CONTENT_TYPES.contains(contentType)) {
                            HttpServletResponse httpResponse = (HttpServletResponse) response;
                            httpResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            httpResponse.getWriter().write("Không chấp nhận loại file: " + contentType);
                            return;
                        }
                    }
                }
            }
        }

        chain.doFilter(request, response);
    }
} 