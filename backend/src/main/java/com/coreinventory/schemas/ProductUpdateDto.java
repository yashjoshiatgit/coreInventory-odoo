package com.coreinventory.schemas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductUpdateDto(
        @NotBlank String sku,
        @NotBlank String name,
        Long categoryId,
        @NotNull Long uomId,
        String description,
        Boolean isActive,
        Long locationId,
        BigDecimal initialQuantity
) {
}
