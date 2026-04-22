package com.example.stockfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record UpdateUserDto(
        @Email(message = "Invalid email format") String email,

        @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Phone number must contain only digits and can start with +") String phone) {
}