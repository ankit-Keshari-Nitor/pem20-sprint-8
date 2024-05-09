package com.precisely.pem.services;

import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.responses.ActivityDefnVersionListResp;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.exceptionhandler.SponsorNotFoundException;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityVersionService {
    ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir,String status) throws Exception;

    ActivityDefnVersionListResp getVersionDefinitionById(String activityDefnKey, String sponsorContext, String activityDefnVersionKey) throws Exception;

    ActivityDefnVersionResp createActivityDefnVersion(String sponsorContext, String activityDefnKey, ActivityVersionReq activityVersionReq) throws OnlyOneDraftVersionException, IOException, SQLException, SponsorNotFoundException;

    MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception;
}
