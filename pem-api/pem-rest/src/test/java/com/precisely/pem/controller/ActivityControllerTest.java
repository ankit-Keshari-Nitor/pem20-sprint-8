package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.MessageResp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ActivityControllerTest extends BaseControllerTest {

    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testCreateActivityDefinition() throws Exception {
        ActivityDefnResp resp = new ActivityDefnResp();
        Mockito.when(activityDefnService.createActivityDefinition(Mockito.anyString(),Mockito.any(ActivityDefnReq.class)))
                .thenReturn(resp);
        ActivityDefnReq req = new ActivityDefnReq();
        ResponseEntity<Object> output = activityController.createActivityDefinition(req,TEST_SPONSOR);
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionList() throws Exception {
        ActivityDefnPaginationRes resp = new ActivityDefnPaginationRes();
        List<ActivityDefnListResp> listResp = new ArrayList<>();
        resp.setContent(listResp);
        Mockito.when(activityDefnService.getAllDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityController.getActivityDefinitionList(TEST_SPONSOR,TEST_NAME, Status.DRAFT,Application.PEM,1,1, SortBy.modifyTs, SortDirection.ASC,TEST_SPONSOR);
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionById() throws Exception {
        ActivityDefnListResp resp = new ActivityDefnListResp();
        Mockito.when(activityDefnService.getActivityDefinitionByKey(Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityController.getActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY);
        assertNotNull(output);
    }


    @Test
    void deleteActivityDefinitionById() throws Exception {
        Mockito.when(activityDefnService.deleteActivityDefinitionById(ArgumentMatchers.anyString(),ArgumentMatchers.anyString()))
                .thenReturn(MessageResp.builder().build());

        ResponseEntity<Object> resp = activityController.deleteActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY);
        assertNotNull(resp);
        assertEquals(resp.getStatusCode(), HttpStatus.OK);
    }
}