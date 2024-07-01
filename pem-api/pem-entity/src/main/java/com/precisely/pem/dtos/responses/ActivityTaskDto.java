package com.precisely.pem.dtos.responses;

import lombok.Data;

import java.util.Date;
import java.util.Map;

@Data
public class ActivityTaskDto {
    private Map<String, Object> variables;
    private String owner;
    private String name;
    private Date createdDate;
    private Date claimedDate;
    private Date dueDate;
    private int priority;
    TaskStatus getStatus;
    private String pcptActivityInstTaskKey;
    private String activityInstKey;
    private String sponsorKey;

    public static enum TaskStatus {
        CREATED,
        ASSIGNED,
        SUSPENDED,
        COMPLETED,
        CANCELLED,
        DELETED;

        private TaskStatus() {
        }
    }
}
