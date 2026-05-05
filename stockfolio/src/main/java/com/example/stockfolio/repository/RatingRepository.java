package com.example.stockfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.stockfolio.model.Rating;
import com.example.stockfolio.model.User;
import com.example.stockfolio.model.Portfolio;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByPortfolio(Portfolio portfolio);
    
    Optional<Rating> findByPortfolioAndUser(Portfolio portfolio, User user);
    
    List<Rating> findByUser(User user);
}
