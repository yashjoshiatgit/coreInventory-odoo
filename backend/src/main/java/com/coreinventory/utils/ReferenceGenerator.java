package com.coreinventory.utils;

import org.springframework.stereotype.Component;

@Component
public class ReferenceGenerator {

    public String generate(String warehouseCode, String docType, Long id) {
        String typeCode = switch (docType) {
            case "receipt" -> "IN";
            case "delivery" -> "OUT";
            case "internal_transfer" -> "TR";
            case "adjustment" -> "ADJ";
            default -> "MISC";
        };
        return String.format("%s/%s/%04d", warehouseCode, typeCode,
                id == null ? (System.currentTimeMillis() % 10000) : id);
    }
}
