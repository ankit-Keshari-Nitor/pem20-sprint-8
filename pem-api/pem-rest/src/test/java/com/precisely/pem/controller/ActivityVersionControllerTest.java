package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.services.ActivityVersionService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.services.ActivityVersionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ActivityVersionControllerTest {
    @InjectMocks
    ActivityVersionController activityVersionController;
    @Mock
    ActivityVersionService activityVersionService;
    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }
    @Mock
    HttpServletRequest req;
    @Test
    void testGetActivityDefinitionVersionsList() throws Exception {
        ActivityVersionDefnPaginationResp resp = new ActivityVersionDefnPaginationResp();
        Mockito.when(activityVersionService.getAllVersionDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyBoolean(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityVersionController.getActivityVersionDefinitionList("test",false,"test", Status.DRAFT,0,1, SortBy.modify_ts, SortDirection.ASC,"cashbank");
        assertNotNull(output);
    }
    @InjectMocks
    ActivityVersionController activityVersionController;
    @Mock
    ActivityVersionService activityDefnService;

    @BeforeEach
    public void setup(){
        try(AutoCloseable mockitoAnnotations =  MockitoAnnotations.openMocks(this)){

    @Test
    void testGetActivityDefinitionVersionById() throws Exception {
        ActivityDefnVersionDto resp = new ActivityDefnVersionDto();
        Mockito.when(activityVersionService.getVersionDefinitionById(Mockito.anyString(),Mockito.anyString(),Mockito.anyDouble()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityVersionController.getActivityVersionDefinitionById("test",1.0,"test");
        assertNotNull(output);
    }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void updateMarkAsFinal() throws Exception {
        Mockito.when(activityDefnService.markAsFinalActivityDefinitionVersion(ArgumentMatchers.anyString()))
                .thenReturn(MarkAsFinalActivityDefinitionVersionResp.builder().status("FINAL").build());

        ResponseEntity<Object> resp = activityVersionController.markActivityDefinitionStatusAsFinal("hsbc","fd2dfe53-b38c-40cf-acb7-9850d1930858","9ec7e29e-9cbe-4298-bb67-a53f86868592");
        assertNotNull(resp);
        assertEquals(resp.getStatusCode(), HttpStatus.CREATED);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersionNotFound() throws Exception {
        Mockito.when(activityDefnService.markAsFinalActivityDefinitionVersion(ArgumentMatchers.anyString()))
                .thenThrow(new Exception("Activity Definition Version not found"));

        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionController.markActivityDefinitionStatusAsFinal("hsbc","fd2dfe53-b38c-40cf-acb7-9850d1930858","9ec7e29e-9cbe-4298-bb67-a53f86868592");
        });
        assertEquals(exception.getMessage(),"Activity Definition Version not found");
    }
}

    @Test
    void testPostCreateActivityDefnVersion() throws SQLException, IOException, OnlyOneDraftVersionException {
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());
        ActivityDefnVersionResp resp = new ActivityDefnVersionResp();
        Mockito.when(activityVersionService.createActivityDefnVersion(Mockito.anyString(),Mockito.anyString(),Mockito.any(MultipartFile.class),Mockito.anyBoolean(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityVersionController.createActivityDefinition("test","test",file,false, Application.PEM);
        assertNotNull(output);
    }
}