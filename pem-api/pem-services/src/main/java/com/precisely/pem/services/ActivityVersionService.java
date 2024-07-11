package com.precisely.pem.services;

import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.requests.UpdateActivityVersionReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.exceptionhandler.AlreadyDeletedException;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface ActivityVersionService {
    ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, Boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir, List<String> status) throws Exception;

    ActivityDefnVersionListResp getVersionDefinitionById(String activityDefnKey, String sponsorContext, String activityDefnVersionKey) throws Exception;

    ActivityDefnVersionResp createActivityDefnVersion(String sponsorContext, String activityDefnKey, ActivityVersionReq activityVersionReq) throws OnlyOneDraftVersionException, IOException, SQLException, ResourceNotFoundException, AlreadyDeletedException, BpmnConverterException;

    MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception;

    MessageResp updateActivityDefnVersion(String sponsorContext, String activityDefnKey, String activityDefnVersionKey
                                                            , UpdateActivityVersionReq updateActivityVersionReq) throws Exception ;

    MarkAsFinalActivityDefinitionVersionResp markAsDefaultActivityDefinitionVersion(String sponsorContext, String activityDefnKey,String activityDefnVersionKey) throws Exception;

    ActivityDataResponse getActivityDataForSpecificVersion(String sponsorContext, String activityDefnKey,String activityDefnVersionKey)throws Exception;

    Object getActivityDefinitionContextData(String activityDefnVersionKey)throws Exception;

}
