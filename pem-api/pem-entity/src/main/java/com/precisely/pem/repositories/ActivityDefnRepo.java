package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnRepo extends JpaRepository<ActivityDefn,String> {
    ActivityDefn findByActivityDefnKeyAndSponsorKey(String activityDefnKey, String sponsorKey);
    Page<ActivityDefn> findBySponsorKeyAndActivityNameContainingAndActivityDescriptionContainingAndApplicationAndVersionsStatus(String sponsorContext,
                                    String applicationName,String applicationDescription, String application,
                                    String status,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatus(String sponsorContext,
                                                                                                                    String applicationName,String applicationDescription, String application,
                                                                                                                    String status,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusAndActivityNameContaining(String sponsorContext,
                                    String application,String status,String applicationName,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatus(String sponsorContext,String application,
                                    String status,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusAndActivityDescriptionContaining(String context,
                                    String application, String status, String description, Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusAndActivityName(String context, String application,
                                    String status, String name, Pageable pageable);

    ActivityDefn findByActivityName(String name);

    ActivityDefn findByActivityDefnKey(String activityDefnKey);
}
