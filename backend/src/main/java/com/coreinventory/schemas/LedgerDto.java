package com.coreinventory.schemas;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LedgerDto(
        Long id,
        String productName,
        String entryType,
        String fromLocation,
        String toLocation,
        BigDecimal quantity,
        String reference,
        LocalDateTime createdAt) {
}
