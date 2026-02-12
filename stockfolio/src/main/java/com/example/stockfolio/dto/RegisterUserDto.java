package com.example.stockfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterUserDto(
    @NotBlank(message = "Username is required")String username,
    @NotBlank(message = "Password is required")String password,
    @Email(message = "Invalid email form")String email,
    String phone) {

}
