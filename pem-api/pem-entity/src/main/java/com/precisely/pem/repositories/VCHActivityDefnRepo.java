package com.precisely.pem.repositories;

import com.precisely.pem.models.VCHActivityDefn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VCHActivityDefnRepo extends JpaRepository<VCHActivityDefn,String> {
}
