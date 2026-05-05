package com.example.stockfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.stockfolio.service.RatingService;
import com.example.stockfolio.model.Rating;

@RestController
@RequestMapping("/api/rating")
public class RatingRestController {

    @Autowired
    private RatingService ratingService;

    /**
     * Add or update a rating for a portfolio
     */
    @PostMapping("/{portfolioId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Rating addOrUpdateRating(@PathVariable Long portfolioId, @RequestBody RatingRequest request) {
        return ratingService.addOrUpdateRating(portfolioId, request.getRatingValue());
    }

    /**
     * Get average rating for a portfolio
     */
    @GetMapping("/{portfolioId}/average")
    public ResponseEntity<AverageRatingResponse> getAverageRating(@PathVariable Long portfolioId) {
        Double average = ratingService.getAverageRating(portfolioId);
        Long count = ratingService.getRatingCount(portfolioId);
        return ResponseEntity.ok(new AverageRatingResponse(average, count));
    }

    /**
     * Get user's rating for a specific portfolio
     */
    @GetMapping("/{portfolioId}/my-rating")
    public ResponseEntity<Rating> getUserRating(@PathVariable Long portfolioId) {
        Rating rating = ratingService.getUserRatingForPortfolio(portfolioId);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rating);
    }

    /**
     * Delete user's rating for a portfolio
     */
    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long portfolioId) {
        ratingService.deleteRating(portfolioId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Inner class for rating request
     */
    public static class RatingRequest {
        private Integer ratingValue;

        public Integer getRatingValue() {
            return ratingValue;
        }

        public void setRatingValue(Integer ratingValue) {
            this.ratingValue = ratingValue;
        }
    }

    /**
     * Inner class for average rating response
     */
    public static class AverageRatingResponse {
        private Double average;
        private Long count;

        public AverageRatingResponse(Double average, Long count) {
            this.average = average;
            this.count = count;
        }

        public Double getAverage() {
            return average;
        }

        public Long getCount() {
            return count;
        }
    }
}
