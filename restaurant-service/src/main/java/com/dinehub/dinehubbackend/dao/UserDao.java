package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDao extends JpaRepository<User,String> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);
}
