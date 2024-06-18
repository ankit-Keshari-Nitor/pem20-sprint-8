package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityInst;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityInstRepo extends JpaRepository<ActivityInst,String> {
    ActivityInst findByActivityDefnKeyVersion(String activityDefnVersionKey);
    Page<ActivityInst> findBySponsorKeyAndNameContainingAndDescriptionContainingAndActivityDefnKeyVersionAndStatus(String sponsorKey, String conName, String description, String activityDefnVersionKey, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameAndDescriptionContainingAndActivityDefnKeyVersionAndStatus(String sponsorKey, String name, String description, String activityDefnVersionKey, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameContainingAndStatusAndAndActivityDefnKeyVersion(String sponsorKey, String conName, String status, String activityDefnVersionKey, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameAndStatusAndAndActivityDefnKeyVersion(String sponsorKey, String name, String status, String activityDefnVersionKey, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndDescriptionContainingAndActivityDefnKeyVersionAndStatus(String sponsorKey, String description, String activityDefnVersionKey, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndActivityDefnKeyVersionAndStatus(String sponsorKey, String activityDefnVersionKey, String status, Pageable pageable);

    ActivityInst findByActivityInstKey(String activityInstKey);

    Page<ActivityInst> findBySponsorKeyAndDescriptionContainingAndStatus(String sponsorKey, String description, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameContainingAndStatus(String sponsorKey, String conName, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndNameAndStatus(String sponsorKey, String name, String status, Pageable pageable);

    Page<ActivityInst> findBySponsorKeyAndStatus(String sponsorKey, String status, Pageable pageable);
}
