package com.dinehub.dinehubbackend.filters;

import com.dinehub.dinehubbackend.services.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenService tokenService;
    private final UserDetailsService userDetailsService;

    /** JWT FILTER FLOW
     * 1. Check if there is authorization header
     * 2. If yes, extract username from jwt, this would fail if there is any issue with jwt or if jwt is tampered
     * 2. If success, check if there is jwt token available and securityContextHolder is not authenticated
     * 3. If yes, extract user from DB
     * 4. If present, validate token
     * 5. If valid, authenticate user and continue the filter chain
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        System.out.println(request.getRequestURL());

        final String authToken = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if(authToken == null || !authToken.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        jwt = authToken.substring(7);
        userEmail = tokenService.extractUserName(jwt);

        if(jwt!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            if(tokenService.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,null,userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        filterChain.doFilter(request,response);

    }
}
