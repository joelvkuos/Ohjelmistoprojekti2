package com.example.stockfolio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.repository.PortfolioRepository;
import com.example.stockfolio.model.User;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserService userService;

    /*Etsii kaikki portfoliot */
    public List<Portfolio> findAllPortfolios(){
        return portfolioRepository.findAll();
    }

    /*Etsii yhden portfolion sen ID:llä */
    public Optional<Portfolio> findPortfolioById(Long portfolioId){
        return portfolioRepository.findById(portfolioId);
    }

    /*Etsii käyttäjän portfoliot */
    public List<Portfolio> getUsersPortfolios(){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return portfolioRepository.findByApp_user_id(user.getApp_user_id());
    }

    /*Luo portfolion */
    public Portfolio createPortfolio(Portfolio portfolio){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        portfolio.setApp_user_id(user.getApp_user_id());
        return portfolioRepository.save(portfolio);
    }

    /*Poistaa portfolion (jos käyttäjällä oikeus) */
    public void deletePortfolio(Long portfolioId){
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if(!portfolio.getApp_user_id().equals(user.getApp_user_id())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }

        portfolioRepository.deleteById(portfolioId);
    }

}
