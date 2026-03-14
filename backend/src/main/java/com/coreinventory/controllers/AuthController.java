package com.coreinventory.controllers;

import com.coreinventory.schemas.AuthRequestDto;
import com.coreinventory.schemas.AuthResponseDto;
import com.coreinventory.schemas.OtpResponseDto;
import com.coreinventory.schemas.SignupRequestDto;
import com.coreinventory.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@Valid @RequestBody SignupRequestDto request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/request-otp")
    public ResponseEntity<OtpResponseDto> requestOtp(@Valid @RequestBody com.coreinventory.schemas.OtpRequestDto request) {
        OtpResponseDto resp = authService.requestOtp(request.email());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody com.coreinventory.schemas.ResetPasswordRequestDto request) {
        authService.resetPassword(request.email(), request.otp(), request.newPassword());
        return ResponseEntity.ok("Password reset successfully");
    }
}
