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

    @Column(name="VERSION")
    private int version;

    @Column(name="STATUS")
    private String status;

    @Column(name="IS_DEFAULT")
    private boolean isDefault;

    @Column(name="IS_ENCRYPTED")
    private boolean isEncrypted;

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

    @ManyToOne
    @JoinColumn(name = "VCHAD_ACTIVITY_DEFN_KEY")
    private ActivityDefn activityDefnDetails;

    @OneToOne(cascade = CascadeType.ALL)
    private ActivityDefnData contentData;
}
