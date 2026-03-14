package com.coreinventory.schemas;

import jakarta.validation.constraints.NotBlank;

public record AuthRequestDto(@NotBlank String email, @NotBlank String password) {
}
