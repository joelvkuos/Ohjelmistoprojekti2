package com.example.stockfolio.service;

import com.example.stockfolio.dto.AddHoldingRequest;
import com.example.stockfolio.model.Holdings;
import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.HoldingsRepository;
import com.example.stockfolio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

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

    // ==================== MINIMAL CHANGE ====================
    public Holdings createHolding(AddHoldingRequest request) {
        Portfolio portfolio = portfolioRepository.findById(request.getPortfolioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Portfolio not found with id: " + request.getPortfolioId()));

        User user = userService.getAuthenticatedUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (!portfolio.getUser().getAppUserId().equals(user.getAppUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }

        Holdings holding = new Holdings();
        holding.setTicker(request.getTicker().toUpperCase());
        holding.setQuantity(request.getQuantity());
        holding.setPortfolio(portfolio);

        return holdingsRepository.save(holding);
    }

    public Holdings updateHolding(Long holdingId, Holdings updateHolding){
        Holdings existing = holdingsRepository.findById(holdingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Holding not found"));

        Portfolio portfolio = existing.getPortfolio();
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if(!portfolio.getUser().getAppUserId().equals(user.getAppUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your holding");
        }

        existing.setTicker(updateHolding.getTicker());
        existing.setQuantity(updateHolding.getQuantity());

        return holdingsRepository.save(existing);
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