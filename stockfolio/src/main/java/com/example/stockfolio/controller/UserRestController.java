package com.example.stockfolio.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.stockfolio.dto.RegisterUserDto;
import com.example.stockfolio.dto.UpdateUserDto;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.UserRepository;
import com.example.stockfolio.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public User createUser(@Valid @RequestBody RegisterUserDto registration, BindingResult bindingResult) {
        Optional<User> existingUser = userRepository.findByUsername(registration.username());

        if (existingUser.isPresent()) {
            bindingResult.rejectValue("username", "UsernameTaken",
                    "This username is already taken. Choose another one");
        }

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return userService.registerUser(registration);
    }

    @GetMapping("/current")
    public User getCurrentUser() {
        return userService.getAuthenticatedUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required"));
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUserProfile(@Valid @RequestBody UpdateUserDto updateDto) {
        User authenticatedUser = userService.getAuthenticatedUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required"));

        if (updateDto.email() != null) {
            String email = updateDto.email().trim();
            if (!email.isBlank()) {
                authenticatedUser.setEmail(email);
            }
        }

        if (updateDto.phone() != null) {
            String phone = updateDto.phone().trim();
            if (!phone.isBlank()) {
                authenticatedUser.setPhone(phone);
            }
        }

        User updatedUser = userRepository.save(authenticatedUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}