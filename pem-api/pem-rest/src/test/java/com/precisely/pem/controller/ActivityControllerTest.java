package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.MessageResp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class ActivityControllerTest extends BaseControllerTest {

    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateActivityDefinition() throws Exception {
        ActivityDefnReq activityDefnReq = new ActivityDefnReq();
        ActivityDefnResp activityDefnResp = new ActivityDefnResp();

        when(activityDefnService.createActivityDefinition(anyString(), any(ActivityDefnReq.class)))
                .thenReturn(activityDefnResp);

        ActivityDefnReq req = new ActivityDefnReq();
        ResponseEntity<Object> response = activityController.createActivityDefinition(req,TEST_SPONSOR);
        assertEquals(response.getStatusCode(), HttpStatus.CREATED);
        assertEquals(response.getBody(),activityDefnResp);
    }

    @Test
    public void testGetActivityDefinitionList() throws Exception {
        ActivityDefnPaginationRes activityDefnPaginationRes = getActivityDefnPaginationRes();

        when(activityDefnService.getAllDefinitionList(anyString(), anyString(), anyString(),
                anyString(), anyList(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(activityDefnPaginationRes);

        ResponseEntity<Object> response = activityController.getActivityDefinitionList(
                null, null, new ArrayList<>(), Application.PEM, 0, 10, SortBy.modifyTs, SortDirection.DESC, TEST_SPONSOR);

        assertEquals(response.getStatusCode(),HttpStatus.OK);
        assertEquals(response.getBody(),activityDefnPaginationRes);
    }

    @Test
    public void testGetActivityDefinitionByKey() throws Exception {
        ActivityDefnListResp activityDefnListResp = new ActivityDefnListResp();

        when(activityDefnService.getActivityDefinitionByKey(anyString(), anyString()))
                .thenReturn(activityDefnListResp);

        ResponseEntity<Object> response = activityController.getActivityDefinitionByKey("sponsor1", "123");

        assertEquals(response.getStatusCode(),HttpStatus.OK);
        assertEquals(response.getBody(),activityDefnListResp);
    }


    @Test
    void deleteActivityDefinitionById() throws Exception {
        when(activityDefnService.deleteActivityDefinitionById(anyString(), anyString()))
                .thenReturn(MessageResp.builder().build());

        ResponseEntity<Object> resp = activityController.deleteActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY);
        assertNotNull(resp);
        assertEquals(resp.getStatusCode(), HttpStatus.OK);
    }
}