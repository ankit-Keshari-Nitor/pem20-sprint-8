package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.sql.SQLException;

public interface VCHActivityDefinitionService {
    public VCHActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
                                                                    String applicationName, String applicationDescription,
                                                                    String status, String application,int pageNo, int pageSize, String sortBy,
                                                                    String sortDir);

    public VCHCreateActivityDefinitionResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException;

    public VCHActivityDefnDto getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;
}