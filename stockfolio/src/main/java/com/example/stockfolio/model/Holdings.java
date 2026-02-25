package com.example.stockfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
public class Holdings {

    @Id
    @GeneratedValue
    private Long holdingsId;

    @NotNull(message = "Portfolio id is required")
    private Long portfolioId;

    @NotBlank(message = "Ticker is required")
    private String ticker;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    public Holdings (){
    }
    
    public Holdings(Long holdingsId, Long portfolioId, String ticker, Double quantity) {
        this.holdingsId = holdingsId;
        this.portfolioId = portfolioId;
        this.ticker = ticker;
        this.quantity = quantity;
    }
    public Long getHoldingsId() {
        return holdingsId;
    }
    public void setHoldingsId(Long holdingsId) {
        this.holdingsId = holdingsId;
    }
    public Long getPortfolioId() {
        return portfolioId;
    }
    public void setPortfolioId(Long portfolioId) {
        this.portfolioId = portfolioId;
    }
    public String getTicker() {
        return ticker;
    }
    public void setTicker(String ticker) {
        this.ticker = ticker;
    }
    public Double getQuantity() {
        return quantity;
    }
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    


}
