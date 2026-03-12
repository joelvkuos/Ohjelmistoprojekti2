package com.example.stockfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EndpointTests {

    @Autowired
    private MockMvc mockMvc;

    // User endpointit
    @Test
    void getAllUsers_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getUser_NotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void registerUser_ValidData_ReturnsOk() throws Exception {
        String userJson = """
                {
                    "username": "testuser",
                    "password": "testpass123",
                    "email": "test@example.com"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk());
    }

    // Portfolio endpointit
    @Test
    void getAllPortfolios_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/portfolio"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getPortfolio_NotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/portfolio/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createPortfolio_ReturnsCreated() throws Exception {
        String portfolioJson = """
                {
                    "portfolioName": "Test Portfolio",
                    "appUserId": 1
                }
                """;
        mockMvc.perform(post("/api/portfolio")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(portfolioJson))
                .andExpect(status().isCreated());
    }

    // Holdings endpointit
    @Test
    void getAllHoldings_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/holdings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getHolding_NotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/holdings/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createHolding_ReturnsCreated() throws Exception {
        String holdingJson = """
                {
                    "portfolioId": 1,
                    "ticker": "AAPL",
                    "quantity": 10
                }
                """;
        mockMvc.perform(post("/api/holdings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(holdingJson))
                .andExpect(status().isCreated());
    }

    // Auth endpointit
    @Test
    void login_InvalidCredentials_ReturnsForbidden() throws Exception {
        String loginJson = """
                {
                    "username": "wronguser",
                    "password": "wrongpass"
                }
                """;
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isForbidden());
    }
}
