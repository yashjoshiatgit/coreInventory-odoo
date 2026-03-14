package com.coreinventory.schemas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.List;

public record StockDocumentCreateDto(
        @NotBlank String docType, // receipt, delivery, internal_transfer, adjustment
        Long partnerId,
        LocalDateTime scheduledDate,
        String note,
        @NotEmpty List<StockLineCreateDto> lines) {
}
