package com.example.stockfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="app_user")
public class User {

    private Long app_user_id;
    private String userName;
    private String passwordHash;
    private String email;
    private String phone;
        
    public User () {
        
    }

    public User(Long app_user_id, String userName, String passwordHash, String email, String phone) {
        this.app_user_id = app_user_id;
        this.userName = userName;
        this.passwordHash = passwordHash;
        this.email = email;
        this.phone = phone;
    }
    
    public Long getApp_user_id() {
        return app_user_id;
    }
    public void setApp_user_id(Long app_user_id) {
        this.app_user_id = app_user_id;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }


}
