package com.precisely.pem.repositories;

import com.precisely.pem.commonUtil.Status;

public interface ActivityDefinitionVersionCustomRepo {
    Integer updateActivityDefinitionVersion(Status newStatus, Status oldStatus, String activityDefnKey);
    Integer deleteByActivityDefnKeyAndStatus(String activityDefnKey, String status);
}
