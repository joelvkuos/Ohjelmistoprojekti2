package com.example.stockfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
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

        @Autowired
        private ObjectMapper objectMapper;

        private String createAccessToken(String username, String password) throws Exception {
        String registerJson = """
            {
                "username": "%s",
                "password": "%s",
                "email": "ci@example.com",
                "phone": ""
            }
            """.formatted(username, password);

        mockMvc.perform(post("/api/users/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(registerJson))
            .andExpect(status().isOk());

        String loginJson = """
            {
                "username": "%s",
                "password": "%s"
            }
            """.formatted(username, password);

        String responseBody = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(loginJson))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode responseJson = objectMapper.readTree(responseBody);
        return responseJson.get("accessToken").asText();
        }

    @Test
    void usersEndpoint_ReturnsOk() throws Exception {
        String token = createAccessToken("ci_users_" + System.currentTimeMillis(), "testpass123");

        mockMvc.perform(get("/api/users")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void portfolioEndpoint_ReturnsOk() throws Exception {
        String token = createAccessToken("ci_portfolio_" + System.currentTimeMillis(), "testpass123");

        mockMvc.perform(get("/api/portfolio")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void holdingsEndpoint_ReturnsOk() throws Exception {
        String token = createAccessToken("ci_holdings_" + System.currentTimeMillis(), "testpass123");

        mockMvc.perform(get("/api/holdings")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
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
        String username = "ci_portfolio_create_" + System.currentTimeMillis();
        String token = createAccessToken(username, "testpass123");
        String portfolioName = "CI Portfolio " + System.currentTimeMillis();
        String portfolioJson = """
                {
                    "portfolioName": "%s",
                    "appUserId": 1
                }
                """.formatted(portfolioName);

        mockMvc.perform(post("/api/portfolio")
                .contentType(MediaType.APPLICATION_JSON)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .content(portfolioJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.portfolioName").value(portfolioName));

        assertEquals(1, portfolioRepository.findByPortfolioName(portfolioName).size());
        Portfolio savedPortfolio = portfolioRepository.findByPortfolioName(portfolioName).get(0);
        assertTrue(savedPortfolio.getUser() != null);
        assertTrue(savedPortfolio.getUser().getAppUserId() != null);
        // If you expect a specific user id, verify here (e.g., expected from test login):
        // assertEquals(1L, savedPortfolio.getUser().getAppUserId());
    }
}
