package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityDefnService {
    public ResponseEntity<Object> getAllDefinitionList(String sponsorContext,
                                                          String applicationName, String applicationDescription,
                                                          String status, String application, int pageNo, int pageSize, String sortBy,
                                                          String sortDir);

    public ResponseEntity<Object> createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException;

    public ResponseEntity<Object> getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;

    DeleteActivityDefinition deleteActivityDefinitionById(String sponsorContext, String activityDefnKey) throws Exception;
}