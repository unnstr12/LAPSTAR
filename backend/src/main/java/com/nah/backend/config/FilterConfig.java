package com.nah.backend.config;

import com.nah.backend.filter.FileTypeValidationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<FileTypeValidationFilter> fileTypeFilter() {
        FilterRegistrationBean<FileTypeValidationFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new FileTypeValidationFilter());
        registrationBean.addUrlPatterns("/api/admin/product-images/upload/*");
        return registrationBean;
    }
} 