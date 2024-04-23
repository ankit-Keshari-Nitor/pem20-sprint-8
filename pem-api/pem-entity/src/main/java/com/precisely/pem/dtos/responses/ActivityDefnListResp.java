package com.precisely.pem.dtos.responses;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityDefnListResp {
    public String activityDefnKey;
    public String name;
    public String description;
    public String application;
    public String activityVersionLink;
    public boolean isDeleted;
}
