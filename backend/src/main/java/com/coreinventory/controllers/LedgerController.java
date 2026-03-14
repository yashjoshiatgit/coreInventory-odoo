package com.coreinventory.controllers;

import com.coreinventory.repositories.StockLedgerRepository;
import com.coreinventory.schemas.LedgerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final StockLedgerRepository ledgerRepository;

    @GetMapping
    public ResponseEntity<List<LedgerDto>> getLedgerHistory() {
        List<LedgerDto> history = ledgerRepository.findAll().stream()
                .map(l -> new LedgerDto(
                        l.getId(),
                        l.getProduct().getName(),
                        l.getEntryType(),
                        l.getFromLocation() != null ? l.getFromLocation().getName() : "-",
                        l.getToLocation() != null ? l.getToLocation().getName() : "-",
                        l.getQuantity(),
                        l.getRefDocument() != null ? l.getRefDocument().getRef() : "Manual",
                        l.getCreatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(history);
    }
}
