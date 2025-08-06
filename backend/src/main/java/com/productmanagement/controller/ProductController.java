package com.productmanagement.controller;

import com.productmanagement.model.Product;
import com.productmanagement.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@Tag(name = "Products", description = "API para gerenciamento de produtos")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    @Operation(summary = "Listar produtos", description = "Lista todos os produtos com paginação e filtro por nome")
    public ResponseEntity<Page<Product>> getAllProducts(
            @Parameter(description = "Termo de busca para filtrar por nome") 
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        
        Page<Product> products = productService.searchProducts(search, pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico pelo ID")
    public ResponseEntity<Product> getProductById(
            @Parameter(description = "ID do produto") 
            @PathVariable Long id) {
        
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @PostMapping
    @Operation(summary = "Criar produto", description = "Cria um novo produto")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto", description = "Atualiza um produto existente")
    public ResponseEntity<Product> updateProduct(
            @Parameter(description = "ID do produto") 
            @PathVariable Long id,
            @Valid @RequestBody Product productDetails) {
        
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir produto", description = "Exclui um produto")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "ID do produto") 
            @PathVariable Long id) {
        
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}