package com.example.stockfolio.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    /*Etsii kaikki holdingit */
    public List<Holdings> findAllHoldings(){
        return holdingsRepository.findAll();
    }

    /*Etsii holdingin ID:llä */
    public Optional<Holdings> findHoldingsById(Long id){
        return holdingsRepository.findById(id);
    }

    /*etsii käyttäjän holdaukset */
    public List<Holdings> getUserHoldings(){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        List<Portfolio> portfolios = portfolioRepository.findByApp_user_id(user.getApp_user_id());

        List<Holdings> allHoldings = new ArrayList<>();
        for(Portfolio p : portfolios){
            allHoldings.addAll(holdingsRepository.findByPortfolio_id(p.getPortfolio_id()));
        }
        return allHoldings;
    }

    /*Luo uuden holdingin käyttäjän portfolioon */
    public Holdings createHolding(Holdings holdings){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Portfolio portfolio = portfolioRepository.findById(holdings.getPortfolio_id())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        if(!portfolio.getApp_user_id().equals(user.getApp_user_id())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }

        return holdingsRepository.save(holdings);
    }

    /*Poistaa holdingin portfoliosta */
    public void deleteHolding(Long holdingId){
        Holdings holdings = holdingsRepository.findById(holdingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found"));
        Portfolio portfolio = portfolioRepository.findById(holdings.getPortfolio_id())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if(!portfolio.getApp_user_id().equals(user.getApp_user_id())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your holding");
        }

        holdingsRepository.deleteById(holdingId);
    }




}
