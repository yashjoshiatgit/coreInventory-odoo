package com.coreinventory.schemas;

import java.time.LocalDateTime;

public record OtpResponseDto(String email, String otp, LocalDateTime expiresAt) {
}
