package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
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
        VCHCreateActivityDefinitionResp resp = new VCHCreateActivityDefinitionResp();
        Mockito.when(vchActivityDefinitionService.createActivityDefinition(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.any(MultipartFile.class),Mockito.anyString()))
                .thenReturn(resp);
        VCHCreateActivityDefinitionResp output = vchActivityController.createActivityDefinition(name,description,file,application,sponsorContext);
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionList() {
        String sponsorContext = "test";
        String name = "test";
        VCHActivityDefnPaginationRes resp = new VCHActivityDefnPaginationRes();
        Mockito.when(vchActivityDefinitionService.getAllDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        VCHActivityDefnPaginationRes output = vchActivityController.getActivityDefinitionList(sponsorContext,name,"DRAFT","PEM",1,1, SortBy.modifyTs, SortDirection.ASC,"cashbank");
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionById() throws Exception {
        String sponsorContext = "test";
        String activityDefnKey = "test";
        VCHActivityDefnDto resp = new VCHActivityDefnDto();
        Mockito.when(vchActivityDefinitionService.getActivityDefinitionByKey(Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        VCHActivityDefnDto output = vchActivityController.getActivityDefinitionByKey(sponsorContext,activityDefnKey);
        assertNotNull(output);
    }
}