package com.coreinventory.schemas;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record StockLineCreateDto(
        @NotNull Long productId,
        Long fromLocationId,
        Long toLocationId,
        @NotNull BigDecimal quantity,
        BigDecimal unitCost,
        String note) {
}
