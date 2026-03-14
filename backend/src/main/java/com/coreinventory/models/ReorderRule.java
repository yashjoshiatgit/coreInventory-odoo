package com.coreinventory.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "reorder_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Builder.Default
    @Column(name = "min_qty")
    private BigDecimal minQty = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "max_qty")
    private BigDecimal maxQty = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "is_enabled")
    private Boolean isEnabled = true;
}
