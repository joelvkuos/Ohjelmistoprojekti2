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

    @Override /*Varmistaa, että metodi toteutuu oikein */
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = userRepository.findByUserName(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found")); /*Hakee käyttäjää userrepositorysta */

        return org.springframework.security.core.userdetails.User.withUsername(user.getUserName())
        .password(user.getPasswordHash()).roles(user.getRole()).build(); /*Palauttaa userdetails objektin, jonka springboot ymmärtää */
    }
}
