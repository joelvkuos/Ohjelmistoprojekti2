package com.example.stockfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.UserRepository;

@Service
public class UserDetailServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override 
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        System.out.println("[DEBUG] Loaded user: " + user.getUsername());
        System.out.println("[DEBUG] Password hash: " + user.getPasswordHash());
        System.out.println("[DEBUG] Role: " + user.getRole());
        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
        .password(user.getPasswordHash()).roles(user.getRole().replace("ROLE_", "")).build();
    }
}
