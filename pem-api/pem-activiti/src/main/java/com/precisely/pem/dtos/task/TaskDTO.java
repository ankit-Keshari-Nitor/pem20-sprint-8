package com.precisely.pem.dtos.task;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
public class TaskDTO {

    public Map<String, Object> variables;
    public String id;
    public String owner;
    public String assignee;
    public String name;
    public String description;
    public Date createdDate;
    public Date claimedDate;
    public Date dueDate;
    public int priority;
    public String processDefinitionId;
    public String processInstanceId;
    public String parentTaskId;
    TaskStatus getStatus;
    public String formKey;
    public Date completedDate;
    public Long duration;
    public Integer processDefinitionVersion;
    public String businessKey;
    public boolean standalone;
    public String taskDefinitionKey;
    public List<String> candidateUsers;

    public List<String> candidateGroups;

    public String completedBy;

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
