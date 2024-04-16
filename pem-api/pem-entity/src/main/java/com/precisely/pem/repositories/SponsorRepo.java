package com.precisely.pem.repositories;

import com.precisely.pem.models.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SponsorRepo extends JpaRepository<Sponsor,String> {
    @Query(nativeQuery = true, value = "SELECT sponsor_key FROM SPONSOR WHERE domain_url = LOWER(:sponsorContext)")
    String getSponsorKey(@Param("sponsorContext") String sponsorContext);
}
