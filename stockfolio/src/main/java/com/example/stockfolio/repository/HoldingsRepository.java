package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Holdings;

public interface HoldingsRepository extends JpaRepository<Holdings, Long> {
    
    List<Holdings> findByPortfolioId(Long portfolioId);
    
    List<Holdings> findByTicker(String ticker);
}
