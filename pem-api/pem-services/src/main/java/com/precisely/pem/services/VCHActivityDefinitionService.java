package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.responses.VCHGetActivitiyDefnByIdResp;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface VCHActivityDefinitionService {
    public VCHActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
                                                             String applicationName, String applicationDescription,
                                                             String status, int pageNo, int pageSize, String sortBy,
                                                             String sortDir);

    public VCHCreateActivityDefinitionResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws Exception;

    VCHGetActivitiyDefnByIdResp findByActivityDefnKeyAndSponsorKey(String activityDefnKey, String sponsorKey);
}