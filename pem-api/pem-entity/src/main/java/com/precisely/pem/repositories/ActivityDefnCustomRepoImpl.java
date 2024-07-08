package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnVersion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ActivityDefnCustomRepoImpl implements ActivityDefnCustomRepo {
    private final EntityManager entityManager;

    @Autowired
    ActivityDefnCustomRepoImpl(EntityManager entityManager) {
        super();
        this.entityManager = entityManager;
    }

    public Page<ActivityDefn> getActivityDefnsPage(String name, String description, List<String> status, String application, String sponsorKey, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        // Main query
        CriteriaQuery<ActivityDefn> query = cb.createQuery(ActivityDefn.class);
        Root<ActivityDefn> activityDefnRoot = query.from(ActivityDefn.class);
        Join<ActivityDefn, ActivityDefnVersion> versionsJoin = activityDefnRoot.join("versions");
        List<Predicate> predicates = buildPredicates(name, description, status, application, sponsorKey, cb, activityDefnRoot, versionsJoin);
        query.select(activityDefnRoot).where(cb.and(predicates.toArray(new Predicate[0])));

        if(pageable.getSort().isSorted()){
            List<Order> orders = new ArrayList<>();
            pageable.getSort().forEach(order -> {
                if(order.isAscending()){
                    orders.add(cb.asc(activityDefnRoot.get(order.getProperty())));
                }else{
                    orders.add(cb.desc(activityDefnRoot.get(order.getProperty())));
                }
            });
            query.orderBy(orders);
        }

        // Pagination
        TypedQuery<ActivityDefn> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        List<ActivityDefn> activityDefnList = typedQuery.getResultList();
        // Count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<ActivityDefn> countRoot = countQuery.from(ActivityDefn.class);
        Join<ActivityDefn, ActivityDefnVersion> countVersionsJoin = countRoot.join("versions");
        List<Predicate> countPredicates = buildPredicates(name, description, status, application, sponsorKey, cb, countRoot, countVersionsJoin);
        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(activityDefnList, pageable, totalRecords);
    }

    private List<Predicate> buildPredicates(String name, String description, List<String> status, String application, String sponsorKey, CriteriaBuilder cb, Root<ActivityDefn> root, Join<ActivityDefn, ActivityDefnVersion> versionsJoin) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(root.get("sponsorKey"), sponsorKey));
        predicates.add(cb.equal(root.get("application"), application));
        predicates.add(cb.isTrue(versionsJoin.get("isDefault")));
        predicates.add(versionsJoin.get("status").in(status));
        if (name != null && !name.isEmpty()) {
            if (name.contains("con:")) {
                String conName = name.replace("con:", "");
                predicates.add(cb.like(root.get("activityName"), "%" + conName + "%"));
            } else {
                predicates.add(cb.equal(root.get("activityName"), name));
            }
        }
        if (description != null && !description.isEmpty()) {
            predicates.add(cb.like(root.get("activityDescription"), "%" + description + "%"));
        }
        return predicates;
    }
}
