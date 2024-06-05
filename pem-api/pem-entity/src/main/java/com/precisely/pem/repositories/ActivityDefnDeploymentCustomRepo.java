package com.precisely.pem.repositories;

import com.precisely.pem.dtos.shared.ActivityDeploymentDto;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ActivityDefnDeploymentCustomRepo extends JpaRepository<ActivityDefn,String> {
    @Query("SELECT a.activityDefnKey, a.activityName, a.application, " +
            "v.activityDefnKeyVersion, v.activityDefnDataKey, v.status, v.version, ad.defData " +
            "FROM ActivityDefn a " +
            "JOIN a.versions v " +
            "JOIN v.activityDefnData ad " +
            "WHERE v.activityDefnKeyVersion = :activityDefnKeyVersion")
    List<Object[]> findActivitiesByActivityDefnKeyVersion(@Param("activityDefnKeyVersion") String activityDefnKeyVersion);
}
