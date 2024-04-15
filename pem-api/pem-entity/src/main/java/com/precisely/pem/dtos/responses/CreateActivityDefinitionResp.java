package com.precisely.pem.dtos.responses;

import lombok.Data;
@Data
public class CreateActivityDefinitionResp {
    public String location;
    public String activityDefnKey;
    public String activityDefnVersionKey;
}
