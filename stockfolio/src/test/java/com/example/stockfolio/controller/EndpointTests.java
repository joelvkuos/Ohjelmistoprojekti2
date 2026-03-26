package com.example.stockfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.repository.PortfolioRepository;
import com.example.stockfolio.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EndpointTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Test
    void usersEndpoint_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk());
    }

    @Test
    void portfolioEndpoint_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/portfolio"))
                .andExpect(status().isOk());
    }

    @Test
    void holdingsEndpoint_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/holdings"))
                .andExpect(status().isOk());
    }

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

    @Test
    void registerUser_SavesUserToRepository() throws Exception {
        String username = "ci_user_" + System.currentTimeMillis();
        String userJson = """
                {
                    "username": "%s",
                    "password": "testpass123",
                    "email": "ci@example.com",
                    "phone": ""
                }
                """.formatted(username);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username));

        assertTrue(userRepository.findByUsername(username).isPresent());
    }

    @Test
    void createPortfolio_SavesPortfolioToRepository() throws Exception {
        String portfolioName = "CI Portfolio " + System.currentTimeMillis();
        String portfolioJson = """
                {
                    "portfolioName": "%s",
                    "appUserId": 1
                }
                """.formatted(portfolioName);

        mockMvc.perform(post("/api/portfolio")
                .contentType(MediaType.APPLICATION_JSON)
                .content(portfolioJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.portfolioName").value(portfolioName));

        assertEquals(1, portfolioRepository.findByPortfolioName(portfolioName).size());
        Portfolio savedPortfolio = portfolioRepository.findByPortfolioName(portfolioName).get(0);
        assertEquals(1L, savedPortfolio.getAppUserId());
    }
}
