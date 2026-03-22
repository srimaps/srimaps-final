package com.srimaps.backend.repository;

import com.srimaps.backend.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Integer> {

    Optional<Driver> findByUsername(String username);

    Optional<Driver> findByUsernameAndPasswordAndIsActiveTrue(String username, String password);
}
