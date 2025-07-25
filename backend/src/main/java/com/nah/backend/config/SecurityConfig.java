package com.nah.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(@Lazy JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/**", "/uploads/**").permitAll()
                        // .requestMatchers("/api/chatbot/**").permitAll()
                        // .requestMatchers("/uploads/**", "/api/products/**", "/api/categories/**", "/api/brands/**").permitAll()
                        // .requestMatchers("/api/cart/**", "/api/orders/**", "/api/payment/**").permitAll()
                        
                        // // User endpoints - yêu cầu đăng nhập
                        // .requestMatchers("/api/users/profile").authenticated()                       
                        
                        // // Admin-only endpoints - chỉ ADMIN
                        // .requestMatchers("/api/admin/users/**").hasRole("ADMIN")
                        // .requestMatchers("/api/admin/stats/**").hasRole("ADMIN")
                        
                        // // Admin và Seller endpoints - cả ADMIN và SELLER
                        // .requestMatchers("/api/admin/orders/**").hasAnyRole("ADMIN", "SELLER")
                        // .requestMatchers("/api/admin/brands/**").hasAnyRole("ADMIN", "SELLER")
                        // .requestMatchers("/api/admin/categories/**").hasAnyRole("ADMIN", "SELLER")
                        // .requestMatchers("/api/admin/banners/**").hasAnyRole("ADMIN", "SELLER")
                        // .requestMatchers("/api/admin/blogs/**").hasAnyRole("ADMIN", "SELLER")
                        
                        // // Product endpoints - phân quyền chi tiết
                        // .requestMatchers("/api/admin/products").hasAnyRole("ADMIN", "SELLER") // GET all products
                        // .requestMatchers("/api/admin/products/category/**").hasAnyRole("ADMIN", "SELLER") // GET by category
                        // .requestMatchers("/api/admin/products/brand/**").hasAnyRole("ADMIN", "SELLER") // GET by brand
                        // .requestMatchers("/api/admin/products/*/stock").hasAnyRole("ADMIN", "SELLER") // POST update stock
                        // .requestMatchers(HttpMethod.GET, "/api/admin/products/*").hasAnyRole("ADMIN", "SELLER") // GET product by ID
                        // .requestMatchers(HttpMethod.PUT, "/api/admin/products/*").hasAnyRole("ADMIN", "SELLER") // PUT update product
                        // .requestMatchers(HttpMethod.POST, "/api/admin/products").hasRole("ADMIN") // POST create product - chỉ ADMIN
                        // .requestMatchers("/api/admin/products/*/enable").hasRole("ADMIN") // PUT enable - chỉ ADMIN
                        // .requestMatchers("/api/admin/products/*/disable").hasRole("ADMIN") // PUT disable - chỉ ADMIN
                        
                        // // Coupon endpoints - phân quyền chi tiết
                        // .requestMatchers(HttpMethod.GET, "/api/admin/coupons/**").hasAnyRole("ADMIN", "SELLER") // GET coupons
                        // .requestMatchers(HttpMethod.PUT, "/api/admin/coupons/*").hasAnyRole("ADMIN", "SELLER") // PUT update coupon
                        // .requestMatchers(HttpMethod.POST, "/api/admin/coupons").hasRole("ADMIN") // POST create coupon - chỉ ADMIN
                        // .requestMatchers("/api/admin/coupons/*/activate").hasRole("ADMIN") // PUT activate - chỉ ADMIN
                        // .requestMatchers("/api/admin/coupons/*/deactivate").hasRole("ADMIN") // PUT deactivate - chỉ ADMIN
                        // .requestMatchers(HttpMethod.DELETE, "/api/admin/coupons/*").hasRole("ADMIN") // DELETE coupon - chỉ ADMIN
                        
                        // // Product images và attributes - cả ADMIN và SELLER
                        // .requestMatchers("/api/admin/product-images/**").hasAnyRole("ADMIN", "SELLER")
                        // .requestMatchers("/api/admin/attributes/**").hasAnyRole("ADMIN", "SELLER")
                        // .requestMatchers("/api/admin/product-attribute-values/**").hasAnyRole("ADMIN", "SELLER")
                        
                        // // Các endpoint admin khác yêu cầu ít nhất SELLER
                        // .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SELLER")
                        
                        .anyRequest().authenticated()
                );
                
        // Thêm JWT filter vào trước UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
} 