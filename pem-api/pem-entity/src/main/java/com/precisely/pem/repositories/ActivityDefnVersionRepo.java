package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefnVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnVersionRepo extends JpaRepository<ActivityDefnVersion,String> {
    @Query(nativeQuery = true, value = "SELECT * FROM ACTIVITY_DEFN_VERSION WHERE IS_DEFAULT = 1")
    ActivityDefnVersion findDefaultVersion();
    Page<ActivityDefnVersion> findByActivityDefnKeyAndStatusAndActivityDefnSponsorKeyAndActivityVersionDescriptionContaining(String activityDefnKey, String status, String context, String description, Pageable pageable);
    Page<ActivityDefnVersion> findByActivityDefnKeyAndStatusAndActivityDefnSponsorKey(String activityDefnKey, String status, String context, Pageable pageable);
    ActivityDefnVersion findByActivityDefnKeyAndVersionAndActivityDefnSponsorKey(String activityDefnKey,Double version, String context);
}