package com.example.stockfolio.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.stockfolio.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private JwtService jwtService;

}