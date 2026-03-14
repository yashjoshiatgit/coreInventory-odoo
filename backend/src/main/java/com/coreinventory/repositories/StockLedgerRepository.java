package com.coreinventory.repositories;

import com.coreinventory.models.StockLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockLedgerRepository extends JpaRepository<StockLedger, Long> {
    List<StockLedger> findByProductId(Long productId);
}
