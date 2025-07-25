package com.nah.backend.repository;

import com.nah.backend.model.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Integer> {
    Optional<Attribute> findByAttributeName(String attributeName);
    
    @Query("SELECT a FROM Attribute a WHERE a.category.categoryId = ?1")
    List<Attribute> findByCategoryId(Integer categoryId);
    
    boolean existsByAttributeName(String attributeName);

    List<Attribute> findByAttributeNameContainingIgnoreCase(String keyword);
}