package com.precisely.pem.repositories;

import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.models.ActivityDefnVersion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.CriteriaUpdate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ActivityDefinitionVersionCustomRepoImpl implements ActivityDefinitionVersionCustomRepo{

    private final EntityManager entityManager;

    @Autowired
    ActivityDefinitionVersionCustomRepoImpl(EntityManager entityManager) {
        super();
        this.entityManager = entityManager;
    }
    @Transactional
    public Integer updateActivityDefinitionVersion(Status newStatus,Status oldStatus,String activityDefnKey){
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaUpdate<ActivityDefnVersion> updateCriteria = criteriaBuilder.createCriteriaUpdate(ActivityDefnVersion.class);
        Root<ActivityDefnVersion> root = updateCriteria.from(ActivityDefnVersion.class);

        // Update multiple records using Criteria API
        updateCriteria.set(root.get("status"), newStatus.getStatus());
        updateCriteria.where(
                criteriaBuilder.and(
                        criteriaBuilder.notEqual(root.get("status"), oldStatus.getStatus()),
                        criteriaBuilder.equal(root.get("activityDefnKey"), activityDefnKey)
                )
        );

        return entityManager.createQuery(updateCriteria).executeUpdate();
    }

    @Transactional
    public Integer deleteByActivityDefnKeyAndStatus(String activityDefnKey, String status) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaDelete<ActivityDefnVersion> deleteCriteria = criteriaBuilder.createCriteriaDelete(ActivityDefnVersion.class);
        Root<ActivityDefnVersion> root = deleteCriteria.from(ActivityDefnVersion.class);

        deleteCriteria.where(
                criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("activityDefnKey"), activityDefnKey),
                        criteriaBuilder.equal(root.get("status"), status)
                )
        );

        return entityManager.createQuery(deleteCriteria).executeUpdate();
    }

}
