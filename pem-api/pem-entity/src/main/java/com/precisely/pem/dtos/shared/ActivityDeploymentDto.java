package com.precisely.pem.dtos.shared;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;

@Data
@AllArgsConstructor
public class ActivityDeploymentDto {
    private String activityDefnKey;
    private String activityName;
    private String application;
    private String activityDefnKeyVersion;
    private String activityDefnDataKey;
    private String status;
    private Double version;
    private Blob defData;
}
