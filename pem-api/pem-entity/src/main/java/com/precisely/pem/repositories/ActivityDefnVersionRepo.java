package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefnVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityDefnVersionRepo extends JpaRepository<ActivityDefnVersion,String> {
    @Query(nativeQuery = true, value = "SELECT * FROM VCH_ACTIVITY_DEFN_VERSION WHERE IS_DEFAULT = 1")
    ActivityDefnVersion findDefaultVersion();
}
