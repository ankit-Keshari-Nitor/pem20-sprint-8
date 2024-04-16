package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnRepo extends JpaRepository<ActivityDefn,String> {
    Page<ActivityDefn> findAllBySponsorKey(String sponsorKey, Pageable pageable);

    ActivityDefn findByActivityDefnKeyAndSponsorKey(String activityDefnKey, String sponsorKey);
    @Query(nativeQuery = true,value = "SELECT a.activity_defn_key,a.sponsor_key,a.activity_name, " +
            "a.activity_description, a.create_ts,a.created_by,a.modify_ts,a.modified_by, a.application, " +
            "a.is_deleted, a.migration_status " +
            "FROM ACTIVITY_DEFN a JOIN ACTIVITY_DEFN_VERSION b " +
            "ON a.activity_defn_key = b.activity_defn_key " +
            "WHERE  b.status=:status " +
            "AND a.sponsor_key=:sponsorContext " +
            "AND a.application=:application " +
            "AND a.activity_name LIKE %:applicationName% " +
            "AND a.activity_description LIKE %:applicationDescription% ")
    Page<ActivityDefn> findByStatusAndSponsorContextAndApplicationAndByNameAndDescription(@Param("status") String status, @Param("sponsorContext") String sponsorContext,
                                                                                          @Param("application") String application, @Param("applicationName") String applicationName,
                                                                                          @Param("applicationDescription") String applicationDescription, Pageable pageable);
}
