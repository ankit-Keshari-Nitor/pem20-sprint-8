package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.services.ActivityDefnService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class ActivityControllerTest {
    @InjectMocks
    ActivityController activityController;

    @Mock
    ActivityDefnService activityDefnService;

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
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());

        ActivityDefnResp resp = new ActivityDefnResp();
        Mockito.when(activityDefnService.createActivityDefinition(Mockito.anyString(),Mockito.any(ActivityDefnReq.class)))
                .thenReturn(resp);
        ActivityDefnReq req = new ActivityDefnReq();
        ResponseEntity<Object> output = activityController.createActivityDefinition(req,sponsorContext);
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionList() throws Exception {
        String sponsorContext = "test";
        String name = "test";
        ActivityDefnPaginationRes resp = new ActivityDefnPaginationRes();
        List<ActivityDefnListResp> listResp = new ArrayList<>();
        resp.setContent(listResp);
        Mockito.when(activityDefnService.getAllDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityController.getActivityDefinitionList(sponsorContext,name, Status.DRAFT,Application.PEM,1,1, SortBy.modifyTs, SortDirection.ASC,"cashbank");
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionById() throws Exception {
        String sponsorContext = "test";
        String activityDefnKey = "test";
        ActivityDefnListResp resp = new ActivityDefnListResp();
        Mockito.when(activityDefnService.getActivityDefinitionByKey(Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityController.getActivityDefinitionByKey(sponsorContext,activityDefnKey);
        assertNotNull(output);
    }
}