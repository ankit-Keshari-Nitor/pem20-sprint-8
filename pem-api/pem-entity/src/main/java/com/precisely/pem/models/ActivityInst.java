package com.precisely.pem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Blob;
import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ACTIVITY_INST")
public class ActivityInst extends BaseEntity{
    @Id
    @Column(name="ACTIVITY_INST_KEY")
    private String activityInstKey;

    @Column(name="ACTIVITY_DEFN_KEY")
    private String activityDefnKey;

    @Column(name="ACTIVITY_DEFN_KEY_VERSION")
    private String activityDefnKeyVersion;

    @Column(name="ACTIVITY_INST_NAME")
    private String name;

    @Column(name="ACTIVITY_INST_DESCRIPTION")
    private String description;

    @Column(name="ACTIVITY_INST_STATUS")
    private String status;

    @Column(name="START_DATE")
    private LocalDate startDate;

    @Column(name="DUE_DATE")
    private String dueDate;

    @Column(name="END_DATE")
    private String endDate;

    @Column(name="ALERT_DATE")
    private String alertDate;

    @Column(name="ALERT_FREQUENCY")
    private int alertFrequency;

    @Column(name="CONTEXT_DATA")
    private Blob defData;

    @Column(name="IS_ENCRYPTED")
    private Boolean isEncrypted;

    @Column(name="IS_DELETED")
    private Boolean isDeleted;

    @Column(name="IS_CREATED_BY_PARTNER")
    private Boolean isCreatedByPartner;

    @Column(name="TASK_SKIPPED")
    private String taskSkipped;

    @Column(name="APPLICATION")
    private String application;

    @Column(name="SPONSOR_KEY")
    private String sponsorKey;

    @Column(name="EMAIL_PREFERENCE")
    private String emailPref;
}
