package com.example.stockfolio.dto;

import java.time.Instant;

public record AccessTokenPayloadDto(String accessToken, Instant expiresAt) {

}
