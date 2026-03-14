package com.coreinventory.services;

import com.coreinventory.exceptions.ValidationException;
import com.coreinventory.exceptions.ResourceNotFoundException;
import com.coreinventory.models.*;
import com.coreinventory.repositories.*;
import com.coreinventory.utils.ReferenceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StockService {
    private final StockDocumentRepository documentRepository;
    private final StockLineRepository lineRepository;
    private final ProductStockRepository stockRepository;
    private final StockLedgerRepository ledgerRepository;
    private final ReferenceGenerator refGenerator;

    @Transactional
    public void validateDocument(Long documentId, User validatedBy) {
        StockDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (!doc.getStatus().equals("draft") && !doc.getStatus().equals("ready")
                && !doc.getStatus().equals("waiting")) {
            throw new ValidationException("Only documents in draft, ready, or waiting can be validated");
        }

        // Validate all lines
        if (doc.getLines() == null || doc.getLines().isEmpty()) {
            throw new ValidationException("Cannot validate document with no stock lines");
        }

        for (StockLine line : doc.getLines()) {
            processLineValidation(line, doc.getDocType(), doc);
        }

        doc.setStatus("done");
        doc.setValidatedBy(validatedBy);
        documentRepository.save(doc);
    }

    private void processLineValidation(StockLine line, String docType, StockDocument doc) {
        Product product = line.getProduct();
        Location from = line.getFromLocation();
        Location to = line.getToLocation();
        BigDecimal qty = line.getQuantity();

        if (!docType.equals("adjustment") && qty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Quantity must be greater than zero");
        }

        BigDecimal runningBalance = BigDecimal.ZERO;

        switch (docType) {
            case "receipt" -> {
                runningBalance = addStock(product, to, qty);
                createLedgerEntry(product, from, to, qty, "in", doc, runningBalance);
            }
            case "delivery" -> {
                runningBalance = deductStock(product, from, qty);
                createLedgerEntry(product, from, to, qty, "out", doc, runningBalance);
            }
            case "internal_transfer" -> {
                deductStock(product, from, qty);
                runningBalance = addStock(product, to, qty);
                createLedgerEntry(product, from, to, qty, "transfer", doc, runningBalance);
            }
            case "adjustment" -> {
                if (qty.compareTo(BigDecimal.ZERO) > 0) {
                    runningBalance = addStock(product, to, qty);
                } else {
                    runningBalance = deductStock(product, from, qty.abs());
                }
                createLedgerEntry(product, from, to, qty, "adjust", doc, runningBalance);
            }
            default -> throw new ValidationException("Unknown document type: " + docType);
        }
    }

    private BigDecimal addStock(Product product, Location location, BigDecimal qty) {
        if (location == null)
            throw new ValidationException("Destination location is required for this operation.");
        ProductStock stock = stockRepository.findByProductIdAndLocationId(product.getId(), location.getId())
                .orElseGet(() -> ProductStock.builder().product(product).location(location)
                        .quantityOnHand(BigDecimal.ZERO).reservedQuantity(BigDecimal.ZERO).build());
        stock.setQuantityOnHand(stock.getQuantityOnHand().add(qty));
        stockRepository.save(stock);
        return stock.getQuantityOnHand();
    }

    private BigDecimal deductStock(Product product, Location location, BigDecimal qty) {
        if (location == null)
            throw new ValidationException("Source location is required for this operation.");
        ProductStock stock = stockRepository.findByProductIdAndLocationId(product.getId(), location.getId())
                .orElseThrow(
                        () -> new ValidationException("Product not found in specified location: " + product.getSku()));

        if (stock.getQuantityOnHand().compareTo(qty) < 0) {
            throw new ValidationException("Insufficient stock for product " + product.getSku() + " at location "
                    + location.getCode() + ". Has: " + stock.getQuantityOnHand() + ", Wants: " + qty);
        }

        stock.setQuantityOnHand(stock.getQuantityOnHand().subtract(qty));
        stockRepository.save(stock);
        return stock.getQuantityOnHand();
    }

    private void createLedgerEntry(Product product, Location from, Location to, BigDecimal qty, String type,
            StockDocument doc, BigDecimal runningBalance) {
        StockLedger entry = StockLedger.builder()
                .product(product)
                .fromLocation(from)
                .toLocation(to)
                .quantity(qty)
                .entryType(type)
                .refDocument(doc)
                .runningBalance(runningBalance)
                .build();
        ledgerRepository.save(entry);
    }
}
