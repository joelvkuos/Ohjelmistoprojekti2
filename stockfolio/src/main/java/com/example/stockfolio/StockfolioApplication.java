package com.example.stockfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.stockfolio.repository.UserRepository;
import com.example.stockfolio.repository.PortfolioRepository;
import com.example.stockfolio.repository.HoldingsRepository;
import com.example.stockfolio.model.User;
import com.example.stockfolio.model.Portfolio;
import com.example.stockfolio.model.Holdings;

@SpringBootApplication
public class StockfolioApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockfolioApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository userRepo, PortfolioRepository portfolioRepo, HoldingsRepository holdingsRepo) {
		return args -> {
			if (userRepo.count() == 0) {
				// Create test users
				User user1 = userRepo.save(new User("alice", "password1", "USER", "alice@example.com", "123456789"));
				User user2 = userRepo.save(new User("bob", "password2", "USER", "bob@example.com", "987654321"));

				Portfolio portfolio1 = new Portfolio();
				portfolio1.setUser(user1);
				portfolio1.setPortfolioName("Alice Portfolio");
				portfolio1 = portfolioRepo.save(portfolio1);

				Portfolio portfolio2 = new Portfolio();
				portfolio2.setUser(user2);
				portfolio2.setPortfolioName("Bob Portfolio");
				portfolio2 = portfolioRepo.save(portfolio2);

				holdingsRepo.save(new Holdings(null, portfolio1, "AAPL", 10.0));
				holdingsRepo.save(new Holdings(null, portfolio1, "GOOGL", 5.0));
				holdingsRepo.save(new Holdings(null, portfolio2, "MSFT", 8.0));
			}
		};
	}

}
