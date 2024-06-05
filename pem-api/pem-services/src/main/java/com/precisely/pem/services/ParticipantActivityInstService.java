package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ParticipantActivityInstPaginationResp;
import com.precisely.pem.dtos.responses.ParticipantActivityInstResp;

public interface ParticipantActivityInstService {
    public ParticipantActivityInstPaginationResp getAllParticipantActivityInstances(String sponsorContext,String status,String activityInstKey,String activityDefnVersionKey,Boolean activityStats,
                                                                                      String currentTask,String partnerName, String progress,
                                                                                      int pageNo, int pageSize, String sortDir) throws Exception;
    public ParticipantActivityInstResp getParticipantActivityInstanceByKey(String sponsorContext, String pcptActivityInstKey) throws Exception;
}
