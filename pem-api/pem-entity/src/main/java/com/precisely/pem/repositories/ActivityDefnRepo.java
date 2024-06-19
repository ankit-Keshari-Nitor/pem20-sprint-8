package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityDefnRepo extends JpaRepository<ActivityDefn,String> {
    ActivityDefn findByActivityDefnKeyAndSponsorKey(String activityDefnKey, String sponsorKey);
    Page<ActivityDefn> findBySponsorKeyAndActivityNameContainingAndActivityDescriptionContainingAndApplicationAndVersionsStatusIn(String sponsorContext,
                                                                                                                                  String applicationName, String applicationDescription, String application,
                                                                                                                                  List<String> status, Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatusIn(String sponsorContext,
                                                                                                                        String applicationName,String applicationDescription, String application,
                                                                                                                        List<String> status,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusInAndActivityNameContaining(String sponsorContext,
                                                                                                  String application,List<String> status,String applicationName,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusIn(String sponsorContext,String application,
                                                                         List<String> status,Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusInAndActivityDescriptionContaining(String context,
                                                                                                         String application, List<String> status, String description, Pageable pageable);
    Page<ActivityDefn> findBySponsorKeyAndApplicationAndVersionsStatusInAndActivityName(String context, String application,
                                                                                        List<String> status, String name, Pageable pageable);

    ActivityDefn findByActivityName(String name);

    ActivityDefn findByActivityDefnKey(String activityDefnKey);
}
