package com.example.stockfolio.service;

import java.util.List;

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

    /*Etsii käyttäjän portfoliot */
    public List<Portfolio> getUsersPortfolios(){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return portfolioRepository.findByUser(user);
    }

    /*Luo portfolion */
    public Portfolio createPortfolio(Portfolio portfolio){
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        portfolio.setUser(user);
        return portfolioRepository.save(portfolio);
    }

    /*Poistaa portfolion (jos käyttäjällä oikeus) */
    public void deletePortfolio(Long portfolioId){
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Porfolio not found"));
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if(!portfolio.getUser().getAppUserId().equals(user.getAppUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }

        portfolioRepository.deleteById(portfolioId);
    }

    /*Päivittää portfolion (jos käyttäjällä oikeus) */
    public Portfolio updatePortfolio(Long portfolioId, Portfolio updatePortfolio){
        Portfolio existing = portfolioRepository.findById(portfolioId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User user = userService.getAuthenticatedUser()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if(!existing.getUser().getAppUserId().equals(user.getAppUserId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }

        existing.setPortfolioName(updatePortfolio.getPortfolioName());
        return portfolioRepository.save(existing);
    }

}
