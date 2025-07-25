package com.nah.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "brands")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer brandId;

    @Column(nullable = false, unique = true)
    private String brandName;

    @Column(nullable = false)
    private String image;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "brand")
    private List<Product> products;

} 