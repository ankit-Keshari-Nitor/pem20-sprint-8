package com.precisely.pem.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "ACTIVITY_DEFN")
public class ActivityDefn extends BaseFields {
    @Id
    @Column(name="ACTIVITY_DEFN_KEY")
    private String activityDefnKey;

    @Column(name="SPONSOR_KEY")
    @Size(min = 1, max = 50)
    private String sponsorKey;

    @Column(name="ACTIVITY_NAME", unique = true)
    @Size(min = 1, max = 80)
    private String activityName;

    @Column(name="ACTIVITY_DESCRIPTION")
    @Size(min = 1, max = 255)
    private String activityDescription;

    @Column(name="APPLICATION")
    private String application;

    @Column(name="IS_DELETED")
    private Boolean isDeleted;

    @Column(name="MIGRATION_STATUS")
    private boolean migrationStatus;

    @OneToMany(mappedBy = "activityDefn", cascade = CascadeType.ALL)
    private List<ActivityDefnVersion> versions;
}