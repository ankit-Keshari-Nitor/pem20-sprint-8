package com.precisely.pem.repositories;

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
    @Query(nativeQuery = true, value = "SELECT * FROM ACTIVITY_DEFN_VERSION WHERE IS_DEFAULT = 1")
    ActivityDefnVersion findDefaultVersion();
    @Query(nativeQuery = true,value = "SELECT a.activity_defn_key_version,b.activity_description,a.is_encrypted, " +
            "a.is_default, a.status, a.activity_defn_data_key, a.activity_defn_key, a.create_ts, a.created_by, a.encryption_key, " +
            "a.modified_by, a.modify_ts, a.version,a.content_data_activity_defn_data_key,a.vchad_activity_defn_key " +
            "FROM VCH_ACTIVITY_DEFN_VERSION a JOIN VCH_ACTIVITY_DEFN b " +
            "ON a.activity_defn_key = b.activity_defn_key WHERE " +
            "a.activity_defn_key = :activityDefnKey " +
            "AND b.sponsor_key=:context " +
            "AND a.status=:status " +
            "AND b.activity_description LIKE %:description% ")
    Page<ActivityDefnVersion> findVersionList(@Param("context") String context, @Param("description") String description, @Param("activityDefnKey") String activityDefnKey, @Param("status")String status, Pageable pageable);
    @Query(nativeQuery = true, value = "SELECT a.activity_defn_key_version,b.activity_description,a.is_encrypted, " +
            "a.is_default, a.status, a.activity_defn_data_key, a.activity_defn_key, a.create_ts, a.created_by, a.encryption_key, " +
            "a.modified_by, a.modify_ts, a.version,a.content_data_activity_defn_data_key,a.vchad_activity_defn_key " +
            "FROM VCH_ACTIVITY_DEFN_VERSION a JOIN VCH_ACTIVITY_DEFN b " +
            "ON a.activity_defn_key = b.activity_defn_key WHERE " +
            "a.activity_defn_key =:activityDefnKey " +
            "AND b.sponsor_key=:context " +
            "AND a.version=:versionId")
    ActivityDefnVersion findVersion(@Param("activityDefnKey")String activityDefnKey,@Param("context") String context,@Param("versionId") String versionId);
    //OPTIMIZE: replace this Native query with JPQL


    List<ActivityDefnVersion> findByActivityDefnKey(String activityDefinitionKey);


    @Modifying
    @Transactional
    @Query("DELETE FROM ActivityDefnVersion a WHERE a.activityDefnKeyVersion IN :keys")
    void deleteByKeys(@Param("keys") List<String> keys);
}
