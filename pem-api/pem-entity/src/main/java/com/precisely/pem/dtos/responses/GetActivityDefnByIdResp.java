package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class GetActivityDefnByIdResp {
    private String activityDefnKey;
    private String name;
    private String description;
}
