package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@Table(name = "vch_activity_defn")
public class VCHActivityDefn {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ACTIVITY_DEFN_KEY")
    private UUID activityDefnKey;
    @Column(name="SPONSOR_KEY")
    private String sponsorKey;
    @Column(name="ACTIVITY_NAME")
    private String activityName;
    @Column(name="ACTIVITY_DESCRIPTION")
    private String activityDescription;
    @Column(name="CREATE_TS")
    private Date createTs;
    @Column(name="CREATED_BY")
    private String createdBy;
    @Column(name="MODIFY_TS")
    private Date modifyTs;
    @Column(name="MODIFIED_BY")
    private String modifiedBy;
    @Column(name="APPLICATION")
    private String application;
    @Column(name="IS_DELETED")
    private boolean isDeleted;
    @Column(name="MIGRATION_STATUS")
    private boolean migrationStatus;
}