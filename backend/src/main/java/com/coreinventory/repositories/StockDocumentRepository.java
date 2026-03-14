package com.coreinventory.repositories;

import com.coreinventory.models.StockDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StockDocumentRepository extends JpaRepository<StockDocument, Long> {
    Optional<StockDocument> findByRef(String ref);
}
