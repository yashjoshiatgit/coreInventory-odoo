package com.coreinventory.schemas;

import java.math.BigDecimal;

public record StockLineDto(
        Long id, Long productId, String productName, Long fromLocationId, Long toLocationId, BigDecimal quantity,
        BigDecimal unitCost, String note) {
}
