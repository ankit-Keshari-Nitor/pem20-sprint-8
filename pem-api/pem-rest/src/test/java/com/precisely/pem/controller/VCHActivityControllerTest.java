package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.CreateActivityDefinitionResp;
import com.precisely.pem.dtos.responses.GetActivitiyDefnByIdResp;
import com.precisely.pem.services.VCHActivityDefinitionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class VCHActivityControllerTest {
    @InjectMocks
    VCHActivityController vchActivityController;

    @Mock
    VCHActivityDefinitionService vchActivityDefinitionService;

    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testCreateActivityDefinition() throws Exception {
        String sponsorContext = "test";
        String name = "test";
        String description = "test";
        String application = "PEM";
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());;
        CreateActivityDefinitionResp resp = new CreateActivityDefinitionResp();
        Mockito.when(vchActivityDefinitionService.createActivityDefinition(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.any(MultipartFile.class),Mockito.anyString()))
                .thenReturn(resp);
        CreateActivityDefinitionResp output = vchActivityController.createActivityDefinition(name,description,file, Application.PEM,sponsorContext);
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionList() {
        String sponsorContext = "test";
        String name = "test";
        ActivityDefnPaginationRes resp = new ActivityDefnPaginationRes();
        Mockito.when(vchActivityDefinitionService.getAllDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ActivityDefnPaginationRes output = vchActivityController.getActivityDefinitionList(sponsorContext,name,"DRAFT","PEM",1,1, SortBy.modify_ts, SortDirection.ASC,"cashbank");
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionById() throws Exception {
        String sponsorContext = "test";
        String activityDefnKey = "test";
        GetActivitiyDefnByIdResp resp = new GetActivitiyDefnByIdResp();
        Mockito.when(vchActivityDefinitionService.getActivityDefinitionByKey(Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        GetActivitiyDefnByIdResp output = vchActivityController.getActivityDefinitionByKey(sponsorContext,activityDefnKey);
        assertNotNull(output);
    }
}