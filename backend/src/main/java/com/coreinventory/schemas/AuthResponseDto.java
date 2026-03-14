package com.coreinventory.schemas;

public record AuthResponseDto(String token, String name, String email, String role) {
}
