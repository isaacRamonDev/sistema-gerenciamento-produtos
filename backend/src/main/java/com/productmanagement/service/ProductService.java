package com.productmanagement.service;

import com.productmanagement.exception.ResourceNotFoundException;
import com.productmanagement.model.Product;
import com.productmanagement.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    public Page<Product> searchProducts(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return getAllProducts(pageable);
        }
        return productRepository.findByNomeContainingIgnoreCase(search.trim(), pageable);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setNome(productDetails.getNome());
        product.setPreco(productDetails.getPreco());
        product.setDescricao(productDetails.getDescricao());
        product.setQuantidade(productDetails.getQuantidade());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}