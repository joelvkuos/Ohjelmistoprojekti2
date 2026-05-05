package com.example.stockfolio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.Rating;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.PortfolioRepository;
import com.example.stockfolio.repository.RatingRepository;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserService userService;

    /**
     * Add or update a rating for a portfolio
     */
    public Rating addOrUpdateRating(Long portfolioId, Integer ratingValue) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        User user = userService.getAuthenticatedUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        // Check if user is trying to rate their own portfolio
        if (portfolio.getUser().getAppUserId().equals(user.getAppUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot rate your own portfolio");
        }

        // Check if user has already rated this portfolio
        Rating existingRating = ratingRepository.findByPortfolioAndUser(portfolio, user).orElse(null);

        if (existingRating != null) {
            // Update existing rating
            existingRating.setRatingValue(ratingValue);
            return ratingRepository.save(existingRating);
        } else {
            // Create new rating
            Rating rating = new Rating(portfolio, user, ratingValue);
            return ratingRepository.save(rating);
        }
    }

    /**
     * Get all ratings for a portfolio
     */
    public List<Rating> getRatingsForPortfolio(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));
        return ratingRepository.findByPortfolio(portfolio);
    }

    /**
     * Calculate average rating for a portfolio
     */
    public Double getAverageRating(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        List<Rating> ratings = ratingRepository.findByPortfolio(portfolio);

        if (ratings.isEmpty()) {
            return null;
        }

        double average = ratings.stream()
                .mapToInt(Rating::getRatingValue)
                .average()
                .orElse(0.0);

        return Math.round(average * 100.0) / 100.0;
    }

    /**
     * Get count of ratings for a portfolio
     */
    public Long getRatingCount(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));
        return (long) ratingRepository.findByPortfolio(portfolio).size();
    }

    /**
     * Remove a rating
     */
    public void deleteRating(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        User user = userService.getAuthenticatedUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Rating rating = ratingRepository.findByPortfolioAndUser(portfolio, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));

        ratingRepository.deleteById(rating.getRatingId());
    }

    /**
     * Get user's rating for a portfolio (if exists)
     */
    public Rating getUserRatingForPortfolio(Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portfolio not found"));

        User user = userService.getAuthenticatedUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return ratingRepository.findByPortfolioAndUser(portfolio, user).orElse(null);
    }
}
