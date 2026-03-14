package com.coreinventory.services;

import com.coreinventory.repositories.ProductRepository;
import com.coreinventory.repositories.StockDocumentRepository;
import com.coreinventory.schemas.DashboardSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final StockDocumentRepository documentRepository;

    public DashboardSummaryDto getSummary() {
        long totalProducts = productRepository.count();
        // Simplified low stock calculation for now (requires iterating ProductStock vs
        // ReorderRules in prod)
        long lowStockItems = 0;

        long pendingReceipts = documentRepository.findAll().stream()
                .filter(d -> d.getDocType().equals("receipt") && !d.getStatus().equals("done")
                        && !d.getStatus().equals("cancelled"))
                .count();

        long pendingDeliveries = documentRepository.findAll().stream()
                .filter(d -> d.getDocType().equals("delivery") && !d.getStatus().equals("done")
                        && !d.getStatus().equals("cancelled"))
                .count();

        long pendingTransfers = documentRepository.findAll().stream()
                .filter(d -> d.getDocType().equals("internal_transfer") && !d.getStatus().equals("done")
                        && !d.getStatus().equals("cancelled"))
                .count();

        return new DashboardSummaryDto(totalProducts, lowStockItems, pendingReceipts, pendingDeliveries,
                pendingTransfers);
    }
}
