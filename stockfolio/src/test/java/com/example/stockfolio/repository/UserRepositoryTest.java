package com.example.stockfolio.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.stockfolio.model.User;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindUserByUsername() {
        // Arrange
        User user = new User("testuser", "hashedpass", "ROLE_USER", "test@test.com", "1234567890");

        // Act
        userRepository.save(user);
        Optional<User> found = userRepository.findByUsername("testuser");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertEquals("test@test.com", found.get().getEmail());
    }

    @Test
    void testFindByUsernameReturnsEmptyWhenNotFound() {
        // Act
        Optional<User> found = userRepository.findByUsername("nonexistent");

        // Assert
        assertFalse(found.isPresent());
    }

    @Test
    void testSaveMultipleUsersAndFindOne() {
        // Arrange
        User user1 = new User("user1", "hash1", "ROLE_USER", "user1@test.com", "1111111111");
        User user2 = new User("user2", "hash2", "ROLE_USER", "user2@test.com", "2222222222");
        
        userRepository.save(user1);
        userRepository.save(user2);

        // Act
        Optional<User> found = userRepository.findByUsername("user2");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("user2", found.get().getUsername());
        assertEquals("user2@test.com", found.get().getEmail());
    }
}
