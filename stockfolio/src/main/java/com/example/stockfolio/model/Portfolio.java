package com.example.stockfolio.model;

import jakarta.persistence.Entity;

@Entity
public class Portfolio {

    private Long portfolio_id;
    private Long app_user_id;
    private String portfolio_name;

    public Portfolio () {

    }
    
    public Portfolio(Long portfolio_id, Long app_user_id, String portfolio_name) {
        this.portfolio_id = portfolio_id;
        this.app_user_id = app_user_id;
        this.portfolio_name = portfolio_name;
    }
    public Long getPortfolio_id() {
        return portfolio_id;
    }
    public void setPortfolio_id(Long portfolio_id) {
        this.portfolio_id = portfolio_id;
    }
    public Long getApp_user_id() {
        return app_user_id;
    }
    public void setApp_user_id(Long app_user_id) {
        this.app_user_id = app_user_id;
    }
    public String getPortfolio_name() {
        return portfolio_name;
    }
    public void setPortfolio_name(String portfolio_name) {
        this.portfolio_name = portfolio_name;
    }

}
