package com.coreinventory.repositories;

import com.coreinventory.models.ProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {
    Optional<ProductStock> findByProductIdAndLocationId(Long productId, Long locationId);

    List<ProductStock> findByProductId(Long productId);

    List<ProductStock> findByLocationId(Long locationId);
}
