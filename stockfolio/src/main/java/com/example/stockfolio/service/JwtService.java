package com.example.stockfolio.service;

import com.example.stockfolio.dto.AccessTokenPayloadDto;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtService {
    private final long EXP_TIME = Duration.ofHours(4).toMillis(); 
    /*Voidaan muuttaa tokenin aikaa, eli millon pitää kirjautua uudelleen */
    private final String PREFIX = "Bearer ";

    @Value("${jwt.secret}") /*PITÄÄ PYSYÄ VISUSTI SALASSA PERKELE!!! */
    private String jwtSecret;

    public AccessTokenPayloadDto getAccessToken(String username){
        Instant expiresAt = Instant.now().plusMillis(EXP_TIME); /*Insant modernimpi aikaleima kuin Date ja se on aina UTC -> tallentaa oikeen ajan riippumatta maasta */

        String accessToken = Jwts.builder().subject(username).expiration(Date.from(expiresAt))
            .signWith(getSigningKey())
            .compact(); /*Rakentaa jwt tokenin (username, exp_aika ja allekirjoitus) */

        return new AccessTokenPayloadDto(accessToken, expiresAt);
    }

    public String getAuthUser(HttpServletRequest request){
        String authorizationHeaderValue = request.getHeader(HttpHeaders.AUTHORIZATION); 
        /*Hakee "Authorization" header requestista, eli kun frontendistä tekee pyynnön niin hakee authorization kohdasta tiedon*/

        if(authorizationHeaderValue == null){
            return null;
        }

        try {
            String user = getJwtParser()
                        .parseSignedClaims(authorizationHeaderValue.replace(PREFIX, "")) /*Poistaa prefixin tokenista eli korvaa Bearer -> "" */
                        .getPayload()
                        .getSubject(); 
                        /*Parsii tokenin ja hakee käyttäjän/käyttäjänimen -> palauttaa usernamen tai null jos virhe*/

                return user;
        } catch (Exception e) {
            return null;
        }
    }

    private SecretKey getSigningKey() {
		byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes); /*Muuttaa jwtSecret stringin SecretKey olioksi (käytetään allekirjoittamiseen ja vahvistamiseen) */
	}
    private JwtParser getJwtParser() {
		return Jwts.parser().verifyWith(getSigningKey()).build();
	}/*Luo parserin joka vahvistaa allekirjotuksen */
}
