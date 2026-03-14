package com.coreinventory.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_stock", uniqueConstraints = @UniqueConstraint(columnNames = { "product_id", "location_id" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStock {
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
    @Column(name = "quantity_on_hand")
    private BigDecimal quantityOnHand = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "reserved_quantity")
    private BigDecimal reservedQuantity = BigDecimal.ZERO;
}
