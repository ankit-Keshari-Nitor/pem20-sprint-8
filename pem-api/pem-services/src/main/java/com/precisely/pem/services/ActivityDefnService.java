package com.precisely.pem.services;


import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityDefnService {
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext, String name, String description,
                                                          String application, String status, int pageNo, int pageSize,
                                                          String sortBy, String sortDir) throws Exception;
    public ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException;
    public ActivityDefnListResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;
}