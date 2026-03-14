package com.coreinventory.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "contact_type", nullable = false, length = 50)
    private String contactType; // vendor, customer, internal

    private String email;
    private String phone;
    private String address;
}
