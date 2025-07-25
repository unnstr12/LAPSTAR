package com.nah.backend.repository;

import com.nah.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role.roleId = ?1")
    List<User> findByRoleId(Integer roleId);
    
    @Query("SELECT u FROM User u WHERE u.role.roleId = :roleId")
    Page<User> findByRoleIdPaged(Integer roleId, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role.roleId = :roleId AND (u.email LIKE %:keyword% OR u.fullName LIKE %:keyword%)")
    Page<User> searchByRoleIdAndEmailOrName(Integer roleId, String keyword, Pageable pageable);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:keyword% OR u.fullName LIKE %:keyword%")
    Page<User> searchByEmailOrName(String keyword, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.roleId = ?1 AND u.isDeleted = false")
    long countByRoleIdAndIsDeletedFalse(Integer roleId);
} 