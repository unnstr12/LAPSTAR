package com.nah.backend.service;

import com.nah.backend.model.Role;
import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    
    Role getRoleById(Integer id);

    Role getRoleByName(String roleName);
    
    boolean existsByRoleName(String roleName);
} 