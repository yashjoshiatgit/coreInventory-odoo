package com.coreinventory.controllers;

import com.coreinventory.exceptions.ResourceNotFoundException;
import com.coreinventory.models.StockDocument;
import com.coreinventory.models.StockLine;
import com.coreinventory.models.User;
import com.coreinventory.repositories.ContactRepository;
import com.coreinventory.repositories.LocationRepository;
import com.coreinventory.repositories.ProductRepository;
import com.coreinventory.repositories.StockDocumentRepository;
import com.coreinventory.repositories.UserRepository;
import com.coreinventory.schemas.StockDocumentCreateDto;
import com.coreinventory.schemas.StockDocumentDto;
import com.coreinventory.schemas.StockLineCreateDto;
import com.coreinventory.schemas.StockLineDto;
import com.coreinventory.services.StockService;
import com.coreinventory.utils.ReferenceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/operations")
@RequiredArgsConstructor
public class OperationController {

    private final StockService stockService;
    private final StockDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ReferenceGenerator refGenerator;
    private final ContactRepository contactRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;

    private User getCurrentUser() {
        return userRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No users found"));
    }

    @GetMapping
    public ResponseEntity<List<StockDocumentDto>> getDocuments() {
        return ResponseEntity.ok(
                documentRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<StockDocumentDto> createDocument(@Valid @RequestBody StockDocumentCreateDto dto) {
        StockDocument doc = StockDocument.builder()
                .docType(dto.docType())
                .status("draft")
                .partner(dto.partnerId() != null ? contactRepository.findById(dto.partnerId()).orElse(null) : null)
                .scheduledDate(dto.scheduledDate())
                .note(dto.note())
                .createdBy(getCurrentUser())
                .build();

        // Generate temporary ref to fulfill NOT NULL
        doc.setRef(refGenerator.generate("WH", dto.docType(), null));

        List<StockLine> lines = dto.lines().stream().map(l -> createLineEntity(l, doc)).collect(Collectors.toList());
        doc.setLines(lines);

        StockDocument savedDoc = documentRepository.save(doc);

        // Update accurate ref using ID
        savedDoc.setRef(refGenerator.generate("WH", dto.docType(), savedDoc.getId()));
        documentRepository.save(savedDoc);

        return ResponseEntity.ok(mapToDto(savedDoc));
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<String> validateOperation(@PathVariable Long id) {
        ensureAdmin(getCurrentUser());
        stockService.validateDocument(id, getCurrentUser());
        return ResponseEntity.ok("Document validated successfully");
    }

    private void ensureAdmin(User user) {
        if (user == null || user.getRole() == null || !user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new com.coreinventory.exceptions.ValidationException("Only admin can perform this action");
        }
    }

    private StockLine createLineEntity(StockLineCreateDto dto, StockDocument doc) {
        StockLine line = new StockLine();
        line.setStockDocument(doc);
        line.setProduct(productRepository.findById(dto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
        line.setQuantity(dto.quantity());
        line.setUnitCost(dto.unitCost());
        line.setNote(dto.note());
        if (dto.fromLocationId() != null)
            line.setFromLocation(locationRepository.findById(dto.fromLocationId()).orElse(null));
        if (dto.toLocationId() != null)
            line.setToLocation(locationRepository.findById(dto.toLocationId()).orElse(null));
        return line;
    }

    private StockDocumentDto mapToDto(StockDocument doc) {
        List<StockLineDto> lineDtos = doc.getLines().stream().map(l -> new StockLineDto(
                l.getId(), l.getProduct().getId(), l.getProduct().getName(),
                l.getFromLocation() != null ? l.getFromLocation().getId() : null,
                l.getToLocation() != null ? l.getToLocation().getId() : null,
                l.getQuantity(), l.getUnitCost(), l.getNote())).collect(Collectors.toList());

        return new StockDocumentDto(
                doc.getId(), doc.getRef(), doc.getDocType(), doc.getStatus(),
                doc.getPartner() != null ? doc.getPartner().getName() : null,
                doc.getScheduledDate(), doc.getNote(), lineDtos);
    }
}
