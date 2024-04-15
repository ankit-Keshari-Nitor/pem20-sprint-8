package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.CreateActivityDefinitionResp;
import com.precisely.pem.dtos.responses.GetActivitiyDefnByIdResp;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface VCHActivityDefinitionService {
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
                                                          String applicationName, String applicationDescription,
                                                          String status, String application, int pageNo, int pageSize, String sortBy,
                                                          String sortDir);

    public CreateActivityDefinitionResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException;

    public GetActivitiyDefnByIdResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;
}