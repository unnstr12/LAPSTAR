package com.nah.backend.dto.auth;

import com.nah.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserDTO user;
    
    public JwtResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
} 