package com.coreinventory.schemas;

import java.util.List;
import java.time.LocalDateTime;

public record StockDocumentDto(
        Long id, String ref, String docType, String status, String partnerName,
        LocalDateTime scheduledDate, String note, List<StockLineDto> lines) {
}
