package com.example.stockfolio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.repository.PortfolioRepository;
import com.example.stockfolio.service.PortfolioService;



@RestController
@RequestMapping("/api/portfolio")
public class PortfolioRestController {
    
    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @GetMapping
    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getPortfolio(@PathVariable Long id) {
        return portfolioRepository.findById(id)
                .map(portfolio -> ResponseEntity.ok(portfolio))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Portfolio createPortfolio(@RequestBody Portfolio portfolio) {
        return portfolioService.createPortfolio(portfolio);
    }

    @PutMapping("/{id}")
    public Portfolio updatePortfolio(@PathVariable Long id, @RequestBody Portfolio updatePortfolio){
        Portfolio existing = portfolioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        existing.setUser(updatePortfolio.getUser());
        existing.setPortfolioName(updatePortfolio.getPortfolioName());
        return portfolioRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        if (!portfolioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public List<Portfolio> getMyPortfolios() {
        return portfolioService.getUsersPortfolios();
    }
    
}