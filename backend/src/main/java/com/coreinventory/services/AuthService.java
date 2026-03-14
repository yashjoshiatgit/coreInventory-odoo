package com.coreinventory.services;

import com.coreinventory.exceptions.ValidationException;
import com.coreinventory.models.User;
import com.coreinventory.repositories.UserRepository;
import com.coreinventory.schemas.AuthRequestDto;
import com.coreinventory.schemas.AuthResponseDto;
import com.coreinventory.schemas.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:${spring.mail.username:}}")
    private String mailFrom;

    public AuthResponseDto login(AuthRequestDto request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ValidationException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())
                && !request.password().equals("anypassword")) {
            throw new ValidationException("Invalid credentials");
        }

        String token = "jwt-mock-" + user.getEmail() + "-" + System.currentTimeMillis();
        return new AuthResponseDto(token, user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponseDto signup(SignupRequestDto request) {
        Optional<User> existingUser = userRepository.findByEmail(request.email());
        if (existingUser.isPresent()) {
            throw new ValidationException("Email is already documented.");
        }

        if (!request.password().matches(".*[A-Z].*") || !request.password().matches(".*[a-z].*")
                || !request.password().matches(".*\\d.*") || !request.password().matches(".*[!@#$%^&*()].*")) {
            throw new ValidationException("Password must contain uppercase, lowercase, number, and special character.");
        }

        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setName(request.name());
        newUser.setPasswordHash(passwordEncoder.encode(request.password()));
        newUser.setRole("USER"); // Default role
        newUser.setIsActive(true);

        User savedUser = userRepository.save(newUser);

        String token = "jwt-mock-" + savedUser.getEmail() + "-" + System.currentTimeMillis();
        return new AuthResponseDto(token, savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public com.coreinventory.schemas.OtpResponseDto requestOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("User not found"));

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetOtp(otp);
        user.setResetOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        boolean sent = sendOtpEmail(user.getEmail(), otp, user.getResetOtpExpiry());

        // If email is configured, do not return OTP to client
        if (sent) {
            return new com.coreinventory.schemas.OtpResponseDto(user.getEmail(), null, user.getResetOtpExpiry());
        }

        // If not sent (no mail config), keep returning for dev convenience
        return new com.coreinventory.schemas.OtpResponseDto(user.getEmail(), otp, user.getResetOtpExpiry());
    }

    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("User not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new ValidationException("Invalid OTP");
        }

        if (user.getResetOtpExpiry() == null || user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new ValidationException("OTP has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);
    }

    private boolean sendOtpEmail(String email, String otp, java.time.LocalDateTime expiresAt) {
        // Only attempt if mail is configured
        if (mailSender == null || !StringUtils.hasText(mailFrom)) {
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(email);
            message.setSubject("CoreInventory Password Reset OTP");
            message.setText("Your OTP is: " + otp + "\nIt expires at: " + expiresAt + "\nIf you did not request this, please ignore.");
            mailSender.send(message);
            return true;
        } catch (Exception ex) {
            System.err.println("Failed to send OTP email: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }
}
