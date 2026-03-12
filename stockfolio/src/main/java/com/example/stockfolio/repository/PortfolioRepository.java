package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByUser(User user);
    List<Portfolio> findByPortfolioName(String portfolioName);

}
