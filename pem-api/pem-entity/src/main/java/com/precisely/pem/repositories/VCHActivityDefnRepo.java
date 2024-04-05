package com.precisely.pem.repositories;

import com.precisely.pem.models.VCHActivityDefn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VCHActivityDefnRepo extends JpaRepository<VCHActivityDefn,String> {
    Page<VCHActivityDefn> findByActivityNameOrActivityDescription(String activityName, String activityDescription, Pageable pageable);
//    @Query("SELECT a from VCHActivityDefn a INNER JOIN a.versions v WHERE a.ACTIVITY_NAME LIKE %:activityName% OR a.ACTIVITY_DESCRIPTION LIKE %:activityDescription% AND v.STATUS=:status")
//    Page<VCHActivityDefn> findVCHActivityDefnByActivityNameOrActivityDescriptionAndVCHActivityDefnVersionStatus(@Param("activityName") String activityName, @Param("activityDescription") String activityDescription, @Param("status") String status, Pageable pageable);

    VCHActivityDefn findByActivityDefnKeyAndSponsorKey(String activityDefnKey,String sponsorKey);
}
