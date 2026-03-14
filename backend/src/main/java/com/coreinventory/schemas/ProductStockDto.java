package com.coreinventory.schemas;

import java.math.BigDecimal;

public record ProductStockDto(String locationName, BigDecimal quantityOnHand, BigDecimal reservedQuantity) {
}
