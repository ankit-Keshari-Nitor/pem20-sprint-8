package com.precisely.pem.repositories;

import com.precisely.pem.models.VCHActivityDefn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VCHActivityDefnRepo extends JpaRepository<VCHActivityDefn,String> {
    Page<VCHActivityDefn> findAllBySponsorKey(String sponsorKey, Pageable pageable);

    Optional<VCHActivityDefn> findAllByActivityDefnKeyAndSponsorKey(String activityDefnKey, String sponsorKey);
}
