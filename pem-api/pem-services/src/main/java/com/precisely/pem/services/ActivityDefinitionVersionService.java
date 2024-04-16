package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;

public interface ActivityDefinitionVersionService {
    MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception;
}
