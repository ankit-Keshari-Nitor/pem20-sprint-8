package com.precisely.pem.models;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Blob;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@Table(name = "vch_activity_defn_data")
public class VCHActivityDefnData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ACTIVITY_DEFN_DATA_KEY")
    private UUID activityDefnDataKey;
    @Column(name="DEF_DATA")
    private Blob defData;
    @Column(name="CREATE_TS")
    private Date createTs;
    @Column(name="CREATED_BY")
    private String createdBy;
    @Column(name="MODIFY_TS")
    private Date modifyTs;
    @Column(name="MODIFIED_BY")
    private String modifiedBy;
}
