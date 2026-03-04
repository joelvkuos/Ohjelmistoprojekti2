package com.example.stockfolio.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Portfolio {

    @Id
    @GeneratedValue
    private Long portfolioId;


    @ManyToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private User user;             // appUserId tilalle

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Holdings> holdings = new ArrayList<>();

    @NotBlank(message = "Portfolio name is required")
    private String portfolioName;

    public Portfolio () {
    }
    
    public Portfolio(Long portfolioId, User user, String portfolioName) {
        this.portfolioId = portfolioId;
        this.user = user;
        this.portfolioName = portfolioName;
    }
    public Long getPortfolioId() {
        return portfolioId;
    }
    public void setPortfolioId(Long portfolioId) {
        this.portfolioId = portfolioId;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getPortfolioName() {
        return portfolioName;
    }
    public void setPortfolioName(String portfolioName) {
        this.portfolioName = portfolioName;
    }
    public List<Holdings> getHoldings() {
        return holdings;
    }
    public void setHoldings(List<Holdings> holdings) {
        this.holdings = holdings;
    }

}
