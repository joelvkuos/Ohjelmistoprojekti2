package com.example.stockfolio.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.stockfolio.model.Holdings;
import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.HoldingsRepository;
import com.example.stockfolio.repository.PortfolioRepository;

@Service
public class HoldingsService {

    @Autowired
    private HoldingsRepository holdingsRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    UserService userService;

    /*etsii käyttäjän holdaukset */
    public List<Holdings> getUserHoldings(){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        List<Portfolio> portfolios = portfolioRepository.findByUser(user);

        List<Holdings> allHoldings = new ArrayList<>();
        for(Portfolio p : portfolios){
            allHoldings.addAll(holdingsRepository.findByPortfolio(p));
        }
        return allHoldings;
    }

    /*Luo uuden holdingin käyttäjän portfolioon */
    public Holdings createHolding(Holdings holdings){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Portfolio portfolio = holdings.getPortfolio();
        if(portfolio == null || portfolio.getPortfolioId() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Portfolio is required");
        }

        portfolio = portfolioRepository.findById(portfolio.getPortfolioId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        if(!portfolio.getUser().getAppUserId().equals(user.getAppUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }

        holdings.setPortfolio(portfolio);
        return holdingsRepository.save(holdings);
    }

    /*Poistaa holdingin portfoliosta */
    public void deleteHolding(Long holdingId){
        Holdings holdings = holdingsRepository.findById(holdingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found"));
        Portfolio portfolio = holdings.getPortfolio();
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if(!portfolio.getUser().getAppUserId().equals(user.getAppUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your holding");
        }

        holdingsRepository.deleteById(holdingId);
    }




}
