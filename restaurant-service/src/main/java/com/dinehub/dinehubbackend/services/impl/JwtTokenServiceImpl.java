package com.dinehub.dinehubbackend.services.impl;

import com.dinehub.dinehubbackend.exceptions.token.TokenGenerationException;
import com.dinehub.dinehubbackend.services.JwtTokenService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;


@Service
public class JwtTokenServiceImpl implements JwtTokenService {

    private final static String SECRET_KEY = "O]gx05CFww";
    private final static int EXPIRATION_TIME_IN_MILLIS = 1000 * 60 * 24; //1 day
    public String extractUserName(String token) {
        try{
            return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getSubject();
        }catch (Exception e){
            System.out.println(e.getLocalizedMessage());
            return null;
        }
    }

    @Override
    public String generateToken(UserDetails userDetails) {

        try {
            String token = Jwts
                    .builder()
                    .setClaims(new HashMap<>())
                    .setSubject(userDetails.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_IN_MILLIS))
                    .signWith(SignatureAlgorithm.HS256,SECRET_KEY)
                    .compact();
            return token;
        }catch (Exception e){
            throw new TokenGenerationException("Error while generating token!");
        }

    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);

        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractTokenExpirationTime(token).before(new Date());
    }

    public Date extractTokenExpirationTime(String token){
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getExpiration();
    }

}
