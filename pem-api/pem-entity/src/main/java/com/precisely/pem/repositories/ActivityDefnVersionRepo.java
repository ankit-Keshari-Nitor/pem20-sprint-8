package com.precisely.pem.repositories;

import com.mysql.cj.log.Log;
import com.precisely.pem.models.ActivityDefnVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ActivityDefnVersionRepo extends JpaRepository<ActivityDefnVersion,String> {

    Page<ActivityDefnVersion> findByActivityDefnKeyAndStatusAndActivityDefnSponsorKeyAndIsDefaultAndDescriptionContaining(String activityDefnKey, String status, String context, Boolean isDefault, String description, Pageable pageable);
    Page<ActivityDefnVersion> findByActivityDefnKeyAndStatusAndActivityDefnSponsorKeyAndIsDefault(String activityDefnKey, String status, String context, Boolean isDefault, Pageable pageable);ActivityDefnVersion findByActivityDefnKeyAndActivityDefnKeyVersionAndActivityDefnSponsorKey(String activityDefnKey, String activityDefnVersionKey, String context);

    List<ActivityDefnVersion> findByActivityDefnKey(String activityDefinitionKey);

    long countByActivityDefnKeyAndStatusNot(String activityDefnKey, String status);

    List<ActivityDefnVersion> findByActivityDefnKeyAndStatusAndActivityDefnSponsorKey(String activityDefnKey, String status, String sponsorContext);
}