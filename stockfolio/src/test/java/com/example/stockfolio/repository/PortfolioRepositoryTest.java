package com.example.stockfolio.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;

@DataJpaTest
class PortfolioRepositoryTest {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindPortfolioByUser() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "1234567890");
        userRepository.save(user);
        
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        portfolio.setPortfolioName("My Portfolio");

        // Act
        portfolioRepository.save(portfolio);
        List<Portfolio> found = portfolioRepository.findByUser(user);

        // Assert
        assertEquals(1, found.size());
        assertEquals("My Portfolio", found.get(0).getPortfolioName());
    }

    @Test
    void testFindByUserReturnsMultiplePortfolios() {
        // Arrange
        User user = new User("testuser", "hash", "ROLE_USER", "test@test.com", "1234567890");
        userRepository.save(user);
        
        Portfolio p1 = new Portfolio();
        p1.setUser(user);
        p1.setPortfolioName("Tech Stocks");
        
        Portfolio p2 = new Portfolio();
        p2.setUser(user);
        p2.setPortfolioName("Dividend Stocks");
        
        portfolioRepository.save(p1);
        portfolioRepository.save(p2);

        // Act
        List<Portfolio> found = portfolioRepository.findByUser(user);

        // Assert
        assertEquals(2, found.size());
    }

    @Test
    void testFindByUserReturnsEmptyForUserWithoutPortfolios() {
        // Arrange
        User user = new User("emptyuser", "hash", "ROLE_USER", "empty@test.com", "9999999999");
        userRepository.save(user);

        // Act
        List<Portfolio> found = portfolioRepository.findByUser(user);

        // Assert
        assertEquals(0, found.size());
    }
}
