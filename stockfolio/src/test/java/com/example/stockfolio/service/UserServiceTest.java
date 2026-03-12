package com.example.stockfolio.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.stockfolio.dto.RegisterUserDto;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void testRegisterUserSuccessfully() {
        // Arrange
        RegisterUserDto dto = new RegisterUserDto("john", "password123", "john@test.com", "1234567");
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(
            new User("john", "hashedPassword", "ROLE_USER", "john@test.com", "1234567")
        );

        // Act
        User result = userService.registerUser(dto);

        // Assert
        assertEquals("john", result.getUsername());
        assertEquals("john@test.com", result.getEmail());
    }

    @Test
    void testRegisterUserEncodesPassword() {
        // Arrange
        RegisterUserDto dto = new RegisterUserDto("jane", "mypassword", "jane@test.com", "7654321");
        when(passwordEncoder.encode("mypassword")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        // Act
        userService.registerUser(dto);

        // Assert
        verify(passwordEncoder, times(1)).encode("mypassword");
    }
}
