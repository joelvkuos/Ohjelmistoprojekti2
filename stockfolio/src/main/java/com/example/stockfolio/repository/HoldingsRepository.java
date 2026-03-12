package com.example.stockfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.stockfolio.model.Holdings;
import com.example.stockfolio.model.Portfolio;

public interface HoldingsRepository extends JpaRepository<Holdings, Long> {
    
    List<Holdings> findByPortfolio(Portfolio portfolio);
    
    List<Holdings> findByTicker(String ticker);
}
