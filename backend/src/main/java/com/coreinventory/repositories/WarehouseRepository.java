package com.coreinventory.repositories;

import com.coreinventory.models.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByShortCode(String shortCode);
}
