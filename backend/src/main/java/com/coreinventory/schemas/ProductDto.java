package com.coreinventory.schemas;

public record ProductDto(
        Long id,
        String sku,
        String name,
        Long categoryId,
        String categoryName,
        Long uomId,
        String uomSymbol,
        String description,
        Boolean isActive) {
}
