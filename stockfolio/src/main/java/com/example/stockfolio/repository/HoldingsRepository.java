package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Holdings;
import com.example.stockfolio.model.Portfolio;

public interface HoldingsRepository extends JpaRepository<Holdings, Long> {
    
    // query holdings by portfolio object or portfolio id
    List<Holdings> findByPortfolio(Portfolio portfolio);
    List<Holdings> findByPortfolio_PortfolioId(Long portfolioId);
    
    List<Holdings> findByTicker(String ticker);
}
