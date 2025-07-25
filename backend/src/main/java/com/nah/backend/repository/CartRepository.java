package com.nah.backend.repository;

import com.nah.backend.model.Cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUserUserId(Integer userId);

    @Query("SELECT c FROM Cart c WHERE c.user.userId = ?1")
    Cart findByUserId(Integer userId);
} 