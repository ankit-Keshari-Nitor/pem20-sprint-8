package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.GetActivityDefnByIdResp;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityDefnService {
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
                                                          String applicationName, String applicationDescription,
                                                          String status, String application, int pageNo, int pageSize, String sortBy,
                                                          String sortDir);

    public ActivityDefnResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException;

    public GetActivityDefnByIdResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;

    public ResponseEntity<ActivityDefnVersionResp> createActivityDefnVersion(String sponsorContext, String activityDefnKey, MultipartFile file) throws SQLException, IOException;
}