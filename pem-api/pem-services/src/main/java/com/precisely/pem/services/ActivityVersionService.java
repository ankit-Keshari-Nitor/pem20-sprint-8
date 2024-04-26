package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ActivityDefnVersionListResp;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityVersionService {
    ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir,String status) throws Exception;

    ActivityDefnVersionListResp getVersionDefinitionById(String activityDefnKey, String sponsorContext, String activityDefnKeyVersion) throws Exception;

    ActivityDefnVersionResp createActivityDefnVersion(String sponsorContext, String activityDefnKey, MultipartFile file, boolean isEncrypted, String app) throws OnlyOneDraftVersionException, IOException, SQLException;

    MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception;
}
