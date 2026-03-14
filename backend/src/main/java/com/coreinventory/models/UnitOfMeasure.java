package com.coreinventory.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "units_of_measure")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitOfMeasure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 10)
    private String symbol;
}
