package com.example.stockfolio.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.stockfolio.model.Holdings;
import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;

@DataJpaTest
class HoldingsRepositoryTest {

    @Autowired
    private HoldingsRepository holdingsRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindHoldingsByPortfolio() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "1234567890");
        userRepository.save(user);
        
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        portfolio.setPortfolioName("My Portfolio");
        portfolioRepository.save(portfolio);
        
        Holdings holding = new Holdings();
        holding.setPortfolio(portfolio);
        holding.setTicker("AAPL");
        holding.setQuantity(10.0);

        // Act
        holdingsRepository.save(holding);
        List<Holdings> found = holdingsRepository.findByPortfolio(portfolio);

        // Assert
        assertEquals(1, found.size());
        assertEquals("AAPL", found.get(0).getTicker());
        assertEquals(10.0, found.get(0).getQuantity());
    }

    @Test
    void testFindByPortfolioReturnsMultipleHoldings() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "1234567890");
        userRepository.save(user);
        
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        portfolio.setPortfolioName("My Portfolio");
        portfolioRepository.save(portfolio);
        
        Holdings h1 = new Holdings();
        h1.setPortfolio(portfolio);
        h1.setTicker("AAPL");
        h1.setQuantity(10.0);
        
        Holdings h2 = new Holdings();
        h2.setPortfolio(portfolio);
        h2.setTicker("GOOGL");
        h2.setQuantity(5.0);
        
        holdingsRepository.save(h1);
        holdingsRepository.save(h2);

        // Act
        List<Holdings> found = holdingsRepository.findByPortfolio(portfolio);

        // Assert
        assertEquals(2, found.size());
    }

    @Test
    void testFindByPortfolioReturnsEmptyWhenNoHoldings() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "1234567890");
        userRepository.save(user);
        
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        portfolio.setPortfolioName("Empty Portfolio");
        portfolioRepository.save(portfolio);

        // Act
        List<Holdings> found = holdingsRepository.findByPortfolio(portfolio);

        // Assert
        assertEquals(0, found.size());
    }
}
