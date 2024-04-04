package com.precisely.pem.repositories;

import com.precisely.pem.models.VCHActivityDefnVersion;
import com.precisely.pem.models.VCHSponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VCHSponsorRepo extends JpaRepository<VCHSponsor,String> {
    @Query(nativeQuery = true, value = "SELECT sponsor_key FROM VCH_SPONSOR WHERE domain_url = LOWER(:sponsorContext)")
    String getSponsorKey(@Param("sponsorContext") String sponsorContext);
}
