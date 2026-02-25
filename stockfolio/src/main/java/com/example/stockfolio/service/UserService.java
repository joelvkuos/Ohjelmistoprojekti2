package com.example.stockfolio.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.stockfolio.dto.RegisterUserDto;
import com.example.stockfolio.model.User;
import com.example.stockfolio.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> getAuthenticatedUser(){
        Authentication authentication = SecurityContextHolder 
            .getContext().getAuthentication(); /*Hakee SecurityContextHolderista käyttäjän, eli ei tarvii parametreja kun hakee käyttäjätietoja koodissa */

        if(authentication == null || authentication.getName() == null){
            return Optional.empty(); /*Jos ei löydy tietoja tai nimeä -> palauttaa empty */
        }

        return userRepository.findByUserName(authentication.getName());
    }

    public User registerUser(RegisterUserDto registration){
        String passwordHash = passwordEncoder.encode(registration.password());
        User newUser = new User(registration.username(), passwordHash, "USER", registration.email(), registration.phone());

        return userRepository.save(newUser); /*Rekisteröi uuden käyttäjän oletuksena nyt USER rooli ja tallentaa repositorioon*/

    }
    



    
}
