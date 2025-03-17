package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByReservedByUsersId(Long userId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.reservedByUsers WHERE p.id = :productId")
    Optional<Product> findByIdWithUsers(Long productId);

}