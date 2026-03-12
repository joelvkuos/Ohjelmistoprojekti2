package com.example.stockfolio.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.http.HttpHeaders;

import com.example.stockfolio.dto.AccessTokenPayloadDto;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    @BeforeEach
    void setup() {
        String testSecret = "test-secret-key-that-is-long-enough-for-testing-purposes";
        ReflectionTestUtils.setField(jwtService, "jwtSecret", testSecret);
    }

    @Test
    void testGetAccessTokenReturnsToken() {
        // Act
        AccessTokenPayloadDto token = jwtService.getAccessToken("testuser");

        // Assert
        assertNotNull(token.accessToken());
        assertNotNull(token.expiresAt());
        assertTrue(token.accessToken().length() > 0);
    }

    @Test
    void testGetAuthUserReturnsUsernameFromValidToken() {
        // Arrange
        AccessTokenPayloadDto token = jwtService.getAccessToken("john");
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + token.accessToken());

        // Act
        String username = jwtService.getAuthUser(request);

        // Assert
        assertEquals("john", username);
    }

    @Test
    void testGetAuthUserReturnsNullWhenNoAuthHeader() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        // Act
        String username = jwtService.getAuthUser(request);

        // Assert
        assertNull(username);
    }
}
