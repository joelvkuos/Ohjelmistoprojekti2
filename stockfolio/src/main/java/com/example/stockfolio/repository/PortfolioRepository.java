package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByApp_user_id(Long userId);
    
    List<Portfolio> findByPortfolio_name(String portfolioName);
}
