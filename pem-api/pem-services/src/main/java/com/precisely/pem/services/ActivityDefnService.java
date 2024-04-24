package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityDefnService {
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
                                                          String applicationName, String applicationDescription,
                                                          String status, String application, int pageNo, int pageSize, String sortBy,
                                                          String sortDir) throws Exception;

    public ActivityDefnResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException;

    public ActivityDefnListResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;
}