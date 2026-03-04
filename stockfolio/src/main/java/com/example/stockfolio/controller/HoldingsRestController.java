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

import com.example.stockfolio.model.Holdings;
import com.example.stockfolio.repository.HoldingsRepository;


@RestController
@RequestMapping("/api/holdings")
public class HoldingsRestController {

    @Autowired
    private HoldingsRepository holdingsRepository;

    @GetMapping
    public List<Holdings> getAllHoldings() {
        return holdingsRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Holdings> getHolding(@PathVariable Long id) {
        return holdingsRepository.findById(id)
                .map(holding -> ResponseEntity.ok(holding))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/portfolio/{portfolioId}")
    public List<Holdings> getHoldingsByPortfolio(@PathVariable Long portfolioId) {
        return holdingsRepository.findByPortfolioId(portfolioId);
    }

    @GetMapping("/ticker/{ticker}")
    public List<Holdings> getHoldingsByTicker(@PathVariable String ticker) {
        return holdingsRepository.findByTicker(ticker);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Holdings createHolding(@RequestBody Holdings holding) {
        return holdingsRepository.save(holding);
    }
    @PutMapping("/{id}")
    public Holdings updateHolding(@PathVariable Long id, @RequestBody Holdings updateHolding){
        Holdings existing = holdingsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Holding not found"));
        existing.setPortfolioId(updateHolding.getPortfolioId());
        existing.setQuantity(updateHolding.getQuantity());
        existing.setTicker(updateHolding.getTicker());
        return holdingsRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHolding(@PathVariable Long id) {
        if (!holdingsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        holdingsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
