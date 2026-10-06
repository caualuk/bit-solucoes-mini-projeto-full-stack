package br.com.bitsolucoes.portal_solicitacoes.security;

import br.com.bitsolucoes.portal_solicitacoes.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class TokenProvider {

    private final JwtProperties jwtProperties;

    // Gerar um token
    public String buildToken(String username) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtProperties.expiration());

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.secret().getBytes());
    }

    // Validar o token
    public boolean isTokenValid(String token) {
        try{
            getClaims(token);
            return true;
        } catch (Exception e ) {
            return false;
        }
    }

    // Extrair informações do token
    public String getUsername(String token){
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
