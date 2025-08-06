package com.productmanagement.repository;

import com.productmanagement.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findByNomeContainingIgnoreCase(@Param("search") String search, Pageable pageable);
}