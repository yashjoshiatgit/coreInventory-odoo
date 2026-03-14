package com.coreinventory.controllers;

import com.coreinventory.repositories.CategoryRepository;
import com.coreinventory.repositories.LocationRepository;
import com.coreinventory.repositories.UnitOfMeasureRepository;
import com.coreinventory.repositories.WarehouseRepository;
import com.coreinventory.schemas.CategoryDto;
import com.coreinventory.schemas.LocationDto;
import com.coreinventory.schemas.UnitOfMeasureDto;
import com.coreinventory.schemas.WarehouseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SettingsController {

        private final WarehouseRepository warehouseRepository;
        private final LocationRepository locationRepository;
        private final CategoryRepository categoryRepository;
        private final UnitOfMeasureRepository uomRepository;

    @GetMapping("/warehouses")
    public ResponseEntity<List<WarehouseDto>> getWarehouses() {
        return ResponseEntity.ok(
                warehouseRepository.findAll().stream()
                        .map(w -> new WarehouseDto(w.getId(), w.getName(), w.getShortCode(), w.getAddress()))
                        .collect(Collectors.toList()));
    }

    @GetMapping("/locations")
    public ResponseEntity<List<LocationDto>> getLocations() {
        return ResponseEntity.ok(
                locationRepository.findAll().stream()
                        .map(l -> new LocationDto(l.getId(), l.getName(), l.getCode(), l.getWarehouse().getName()))
                        .collect(Collectors.toList()));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(
                categoryRepository.findAll().stream()
                        .map(c -> new CategoryDto(c.getId(), c.getName()))
                        .collect(Collectors.toList()));
    }

    @GetMapping("/uoms")
    public ResponseEntity<List<UnitOfMeasureDto>> getUoms() {
        return ResponseEntity.ok(
                uomRepository.findAll().stream()
                        .map(u -> new UnitOfMeasureDto(u.getId(), u.getName(), u.getSymbol()))
                        .collect(Collectors.toList()));
    }

    @org.springframework.web.bind.annotation.PostMapping("/warehouses")
    public ResponseEntity<WarehouseDto> createWarehouse(
            @org.springframework.web.bind.annotation.RequestBody WarehouseDto dto) {
        com.coreinventory.models.Warehouse w = new com.coreinventory.models.Warehouse();
        w.setName(dto.name());
        w.setShortCode(dto.shortCode());
        w.setAddress(dto.address());
        com.coreinventory.models.Warehouse saved = warehouseRepository.save(w);
        return ResponseEntity
                .ok(new WarehouseDto(saved.getId(), saved.getName(), saved.getShortCode(), saved.getAddress()));
    }
}
