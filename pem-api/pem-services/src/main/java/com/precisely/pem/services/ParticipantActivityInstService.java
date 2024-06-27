package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;

public interface ParticipantActivityInstService {
    ParticipantActivityInstPaginationResp getAllParticipantActivityInstances(String sponsorContext,String status,String activityInstKey,String activityDefnVersionKey,Boolean activityStats,
                                                                                      String currentTask,String partnerName, String progress,
                                                                                      int pageNo, int pageSize, String sortDir) throws Exception;
    ParticipantActivityInstResp getParticipantActivityInstanceByKey(String sponsorContext, String pcptActivityInstKey) throws Exception;
    MessageResp startActivity(String sponsorContext, String pcptActivityInstKey) throws ResourceNotFoundException, InvalidStatusException;
    ActivityTaskDto getTaskDetails(String sponsorContext, String pcptActivityInstKey, String taskKey) throws Exception;

    MarkAsFinalActivityDefinitionVersionResp submitTask(String sponsorContext, String pcptActivityInstKey, String taskKey, String data) throws Exception;
}
