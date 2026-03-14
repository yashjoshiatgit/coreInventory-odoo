package com.coreinventory.schemas;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequestDto(
        @NotBlank @Email String email,
        @NotBlank String otp,
        @NotBlank String newPassword) {
}
