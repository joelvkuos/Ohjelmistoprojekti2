package com.example.stockfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StockfolioApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockfolioApplication.class, args);
	}

	/*@Bean
	public CommandLineRunner dataLoader(UserRepository userRepo, PortfolioRepository portfolioRepo, HoldingsRepository holdingsRepo) {
		
		return args -> {
			// Create test users
			User user1 = userRepo.save(new User("alice", "password1", "USER", "alice@example.com", "123456789"));
			User user2 = userRepo.save(new User("bob", "password2", "USER", "bob@example.com", "987654321"));

			Portfolio portfolio1 = portfolioRepo.save(new Portfolio(null, user1.getAppUserId(), "Alice Portfolio"));
			Portfolio portfolio2 = portfolioRepo.save(new Portfolio(null, user2.getAppUserId(), "Bob Portfolio"));

			holdingsRepo.save(new Holdings(null, portfolio1.getPortfolioId(), "AAPL", 10.0));
			holdingsRepo.save(new Holdings(null, portfolio1.getPortfolioId(), "GOOGL", 5.0));
			holdingsRepo.save(new Holdings(null, portfolio2.getPortfolioId(), "MSFT", 8.0));
		};
	}*/

}
