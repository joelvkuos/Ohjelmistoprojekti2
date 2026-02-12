package com.example.stockfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Holdings {

    @Id
    private Long holdings_id;
    private Long portfolio_id;
    
    private String ticker;
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
