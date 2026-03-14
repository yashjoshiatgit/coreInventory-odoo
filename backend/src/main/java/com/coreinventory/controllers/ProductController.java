package com.coreinventory.controllers;

import com.coreinventory.schemas.ProductCreateDto;
import com.coreinventory.schemas.ProductDto;
import com.coreinventory.schemas.ProductStockDto;
import com.coreinventory.schemas.ProductUpdateDto;
import com.coreinventory.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductCreateDto dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductUpdateDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<List<ProductStockDto>> getProductStock(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductStock(id));
    }
}
