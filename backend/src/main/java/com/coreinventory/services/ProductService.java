package com.coreinventory.services;

import com.coreinventory.exceptions.ResourceNotFoundException;
import com.coreinventory.models.Product;
import com.coreinventory.repositories.CategoryRepository;
import com.coreinventory.repositories.LocationRepository;
import com.coreinventory.repositories.ProductRepository;
import com.coreinventory.repositories.ProductStockRepository;
import com.coreinventory.repositories.UnitOfMeasureRepository;
import com.coreinventory.models.ProductStock;
import com.coreinventory.schemas.ProductCreateDto;
import com.coreinventory.schemas.ProductDto;
import com.coreinventory.schemas.ProductStockDto;
import com.coreinventory.schemas.ProductUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UnitOfMeasureRepository uomRepository;
    private final ProductStockRepository productStockRepository;
    private final LocationRepository locationRepository;

    public List<ProductStockDto> getProductStock(Long productId) {
        return productStockRepository.findByProductId(productId).stream()
                .map(stock -> new ProductStockDto(
                        stock.getLocation().getName(),
                        stock.getQuantityOnHand(),
                        stock.getReservedQuantity()))
                .collect(Collectors.toList());
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        return productRepository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public ProductDto createProduct(ProductCreateDto dto) {
        Product product = Product.builder()
                .sku(dto.sku())
                .name(dto.name())
                .description(dto.description())
                .uom(uomRepository.findById(dto.uomId())
                        .orElseThrow(() -> new ResourceNotFoundException("UOM not found")))
                .build();

        if (dto.categoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.categoryId()).orElse(null));
        }

        Product saved = productRepository.save(product);

        // Optional initial stock capture
        if (dto.initialQuantity() != null && dto.initialQuantity().doubleValue() > 0 && dto.locationId() != null) {
            var location = locationRepository.findById(dto.locationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
            ProductStock stock = productStockRepository.findByProductIdAndLocationId(saved.getId(), dto.locationId())
                    .orElseGet(() -> {
                        ProductStock ps = new ProductStock();
                        ps.setProduct(saved);
                        ps.setLocation(location);
                        ps.setQuantityOnHand(dto.initialQuantity());
                        return ps;
                    });
            if (stock.getQuantityOnHand() != null) {
                stock.setQuantityOnHand(stock.getQuantityOnHand().add(dto.initialQuantity()));
            } else {
                stock.setQuantityOnHand(dto.initialQuantity());
            }
            productStockRepository.save(stock);
        }

        return mapToDto(saved);
    }

    public ProductDto updateProduct(Long id, ProductUpdateDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setSku(dto.sku());
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setUom(uomRepository.findById(dto.uomId())
                .orElseThrow(() -> new ResourceNotFoundException("UOM not found")));

        if (dto.categoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.categoryId()).orElse(null));
        } else {
            product.setCategory(null);
        }

        if (dto.isActive() != null) {
            product.setIsActive(dto.isActive());
        }

        Product saved = productRepository.save(product);

        if (dto.initialQuantity() != null && dto.initialQuantity().doubleValue() > 0 && dto.locationId() != null) {
            var location = locationRepository.findById(dto.locationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
            ProductStock stock = productStockRepository.findByProductIdAndLocationId(saved.getId(), dto.locationId())
                    .orElseGet(() -> {
                        ProductStock ps = new ProductStock();
                        ps.setProduct(saved);
                        ps.setLocation(location);
                        ps.setQuantityOnHand(dto.initialQuantity());
                        return ps;
                    });
            if (stock.getQuantityOnHand() != null) {
                stock.setQuantityOnHand(stock.getQuantityOnHand().add(dto.initialQuantity()));
            } else {
                stock.setQuantityOnHand(dto.initialQuantity());
            }
            productStockRepository.save(stock);
        }

        return mapToDto(saved);
    }

    private ProductDto mapToDto(Product p) {
    return new ProductDto(
        p.getId(),
        p.getSku(),
        p.getName(),
        p.getCategory() != null ? p.getCategory().getId() : null,
        p.getCategory() != null ? p.getCategory().getName() : null,
        p.getUom() != null ? p.getUom().getId() : null,
        p.getUom() != null ? p.getUom().getSymbol() : null,
        p.getDescription(),
        p.getIsActive());
    }
}
