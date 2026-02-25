package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByAppUserId(Long userId);
    
    List<Portfolio> findByPortfolioName(String portfolioName);
}
