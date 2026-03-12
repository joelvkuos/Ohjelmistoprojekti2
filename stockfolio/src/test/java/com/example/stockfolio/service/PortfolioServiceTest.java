package com.example.stockfolio.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.PortfolioRepository;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private PortfolioService portfolioService;

    @Test
    void testCreatePortfolioSuccessfully() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "123456");
        user.setAppUserId(1L);
        
        Portfolio portfolioToCreate = new Portfolio();
        portfolioToCreate.setPortfolioName("My Stocks");
        
        when(userService.getAuthenticatedUser()).thenReturn(Optional.of(user));
        when(portfolioRepository.save(any(Portfolio.class))).thenReturn(portfolioToCreate);

        // Act
        Portfolio result = portfolioService.createPortfolio(portfolioToCreate);

        // Assert
        assertNotNull(result);
        assertEquals("My Stocks", result.getPortfolioName());
    }

    @Test
    void testCreatePortfolioThrowsExceptionWhenNotAuthenticated() {
        // Arrange
        Portfolio portfolio = new Portfolio();
        when(userService.getAuthenticatedUser()).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> portfolioService.createPortfolio(portfolio));
    }

    @Test
    void testGetUsersPortfoliosSuccessfully() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "123456");
        List<Portfolio> portfolios = List.of(new Portfolio(), new Portfolio());
        
        when(userService.getAuthenticatedUser()).thenReturn(Optional.of(user));
        when(portfolioRepository.findByUser(user)).thenReturn(portfolios);

        // Act
        List<Portfolio> result = portfolioService.getUsersPortfolios();

        // Assert
        assertEquals(2, result.size());
    }
}
