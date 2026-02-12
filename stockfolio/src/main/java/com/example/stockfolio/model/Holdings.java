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
    private Long holdings_id;

    @NotNull(message = "Portfolio id is required")
    private Long portfolio_id;

    @NotBlank(message = "Ticker is required")
    private String ticker;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    public Holdings (){
    }
    
    public Holdings(Long holdings_id, Long portfolio_id, String ticker, Double quantity) {
        this.holdings_id = holdings_id;
        this.portfolio_id = portfolio_id;
        this.ticker = ticker;
        this.quantity = quantity;
    }
    public Long getHoldings_id() {
        return holdings_id;
    }
    public void setHoldings_id(Long holdings_id) {
        this.holdings_id = holdings_id;
    }
    public Long getPortfolio_id() {
        return portfolio_id;
    }
    public void setPortfolio_id(Long portfolio_id) {
        this.portfolio_id = portfolio_id;
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
