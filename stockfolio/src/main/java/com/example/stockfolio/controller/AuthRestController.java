package com.example.stockfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.stockfolio.dto.AccessTokenPayloadDto;
import com.example.stockfolio.dto.LoginUserDto;
import com.example.stockfolio.service.JwtService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUserDto login, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        UsernamePasswordAuthenticationToken credentials = new UsernamePasswordAuthenticationToken(login.username(), login.password());

        try {
            Authentication auth = authenticationManager.authenticate(credentials);
            System.out.println("[DEBUG] Authenticated: " + auth.isAuthenticated());
            System.out.println("[DEBUG] Auth principal: " + auth.getPrincipal());
            System.out.println("[DEBUG] About to generate JWT for: " + auth.getName());
            AccessTokenPayloadDto accessTokenPayload = jwtService.getAccessToken(auth.getName());
            System.out.println("[DEBUG] JWT generated successfully");

            return ResponseEntity.ok().body(accessTokenPayload);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid username or password");
        }
    }
    
}