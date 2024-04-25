package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "ACTIVITY_DEFN_VERSION")
public class ActivityDefnVersion {
    @Id
    @Column(name="ACTIVITY_DEFN_KEY_VERSION")
    private String activityDefnKeyVersion;

    @Column(name="ACTIVITY_DEFN_KEY")
    private String activityDefnKey;

    @Column(name="ACTIVITY_DEFN_DATA_KEY")
    private String activityDefnDataKey;

    @Column(name="VERSION", columnDefinition="Decimal(10,1)")
    private Double version;

    @Column(name="STATUS")
    private String status;

    @Column(name="IS_DEFAULT")
    private Boolean isDefault;

    @Column(name="IS_ENCRYPTED")
    private Boolean isEncrypted;

    @Column(name="ENCRYPTION_KEY")
    private String encryptionKey;

    @Column(name="CREATE_TS")
    private LocalDateTime createTs;

    @Column(name="CREATED_BY")
    private String createdBy;

    @Column(name="MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name="MODIFIED_BY")
    private String modifiedBy;

    @Column(name="SCHEMA_VERSION", columnDefinition="Decimal(10,2)")
    private Double schemaVersion;

    @ManyToOne
    @JoinColumn(name = "activity_Defn_Details")
    private ActivityDefn activityDefn;

    @OneToOne
    @JoinColumn(name = "activity_Defn_Data")
    private ActivityDefnData activityDefnData;
}
