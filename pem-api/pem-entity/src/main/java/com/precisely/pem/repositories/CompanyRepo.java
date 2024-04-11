package com.precisely.pem.repositories;

import com.precisely.pem.models.Company;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepo extends JpaRepository<Company, String> {
    Optional<Company> findById(@NotNull String companyKey);
}
