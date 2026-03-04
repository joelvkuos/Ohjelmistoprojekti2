package com.example.stockfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Portfolio {

    @Id
    @GeneratedValue
    private Long portfolioId;


    @NotNull(message = "User ID is required")
    private Long appUserId;

    @NotBlank(message = "Portfolio name is required")
    private String portfolioName;

    public Portfolio () {
    }
    
    public Portfolio(Long portfolioId, Long appUserId, String portfolioName) {
        this.portfolioId = portfolioId;
        this.appUserId = appUserId;
        this.portfolioName = portfolioName;
    }
    public Long getPortfolioId() {
        return portfolioId;
    }
    public void setPortfolioId(Long portfolioId) {
        this.portfolioId = portfolioId;
    }
    public Long getAppUserId() {
        return appUserId;
    }
    public void setAppUserId(Long appUserId) {
        this.appUserId = appUserId;
    }
    public String getPortfolioName() {
        return portfolioName;
    }
    public void setPortfolioName(String portfolioName) {
        this.portfolioName = portfolioName;
    }

}
