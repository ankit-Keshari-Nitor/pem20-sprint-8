package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class ActivityDefnVersionListResp {
    public String activityDefnVersionKey;
    public long version;
    public Boolean isEncrypted;
    public String status;
}
