package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    // find portfolios by owning user
    List<Portfolio> findByUser(User user);
    // optionally, you can still query by the user's id
    List<Portfolio> findByUser_AppUserId(Long appUserId);

    List<Portfolio> findByPortfolioName(String portfolioName);

}
