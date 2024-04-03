package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@Table(name = "vch_activity_defn_version")
public class VCHActivityDefnVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ACTIVITY_DEFN_KEY_VERSION")
    private UUID activityDefnKeyVersion;

    @Column(name="ACTIVITY_DEFN_KEY")
    private UUID activityDefnKey;
    @Column(name="ACTIVITY_DEFN_DATA_KEY")
    private UUID activityDefnDataKey;
    @Column(name="VERSION")
    private String version;
    @Column(name="STATUS")
    private String status;
    @Column(name="IS_DEFAULT")
    private boolean isDefault;
    @Column(name="IS_ENCRYPTED")
    private boolean isEncrypted;
    @Column(name="ENCRYPTION_KEY")
    private String encryptionKey;
    @Column(name="CREATE_TS")
    private Date createTs;
    @Column(name="CREATED_BY")
    private String createdBy;
    @Column(name="MODIFY_TS")
    private Date modifyTs;
    @Column(name="MODIFIED_BY")
    private String modifiedBy;
}
