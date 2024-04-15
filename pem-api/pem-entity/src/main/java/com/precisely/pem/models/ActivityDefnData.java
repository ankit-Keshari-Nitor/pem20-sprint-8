package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Blob;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "VCH_ACTIVITY_DEFN_DATA")
public class ActivityDefnData {
    @Id
    @Column(name="ACTIVITY_DEFN_DATA_KEY")
    private String activityDefnDataKey;

    @Column(name="DEF_DATA")
    private Blob defData;

    @Column(name="CREATE_TS")
    private LocalDateTime createTs;

    @Column(name="CREATED_BY")
    private String createdBy;

    @Column(name="MODIFY_TS")
    private LocalDateTime modifyTs;

    @Column(name="MODIFIED_BY")
    private String modifiedBy;

    @OneToOne
    private ActivityDefnVersion activityDefnVersion;
}
