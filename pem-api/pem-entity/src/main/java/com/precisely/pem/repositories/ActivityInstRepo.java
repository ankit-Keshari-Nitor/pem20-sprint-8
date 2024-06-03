package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityInst;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityInstRepo extends JpaRepository<ActivityInst,String> {
    ActivityInst findByActivityDefnKeyVersion(String activityDefnVersionKey);
}
