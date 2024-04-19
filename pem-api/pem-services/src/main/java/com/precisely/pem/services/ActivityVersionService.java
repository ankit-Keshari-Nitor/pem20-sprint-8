package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

public interface ActivityVersionService {
    ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir,String status);

    ActivityDefnVersionDto getVersionDefinitionById(String activityDefnKey, String sponsorContext, String versionId) throws Exception;

    ResponseEntity<Object> createActivityDefnVersion(String sponsorContext, String activityDefnKey, MultipartFile file, boolean isEncrypted, boolean isDefault, String status, HttpServletRequest request) throws SQLException, IOException;
}
