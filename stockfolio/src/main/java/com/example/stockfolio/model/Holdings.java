package com.example.stockfolio.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
public class Holdings {

    @Id
    @GeneratedValue
    private Long holdingsId;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    @JsonIgnoreProperties("holdings")
    private Portfolio portfolio;

    @NotBlank(message = "Ticker is required")
    private String ticker;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    public Holdings (){
    }
    
    public Holdings(Long holdingsId, Portfolio portfolio, String ticker, Double quantity) {
        this.holdingsId = holdingsId;
        this.portfolio = portfolio;
        this.ticker = ticker;
        this.quantity = quantity;
    }
    public Long getHoldingsId() {
        return holdingsId;
    }
    public void setHoldingsId(Long holdingsId) {
        this.holdingsId = holdingsId;
    }
    public Portfolio getPortfolio() {
        return portfolio;
    }
    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
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
