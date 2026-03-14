package com.coreinventory.schemas;

public record DashboardSummaryDto(
        long totalProducts,
        long lowStockItems,
        long pendingReceipts,
        long pendingDeliveries,
        long pendingTransfers) {
}
