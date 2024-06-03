package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class ActivityDefnVersionListResp {
    public String activityDefnKeyVersion;
    public String description;
    public Boolean isEncrypted;
    public Boolean isDefault;
    public String status;
}
