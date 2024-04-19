package com.precisely.pem.controller;

import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.services.ActivityDefinitionVersionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.junit.jupiter.api.Assertions.*;

public class ActivityControllerTest {
    @InjectMocks
    VCHActivityController activityController;
    @Mock
    ActivityDefinitionVersionService activityDefnService;


    @BeforeEach
    public void setup(){
        try(AutoCloseable mockitoAnnotations =  MockitoAnnotations.openMocks(this)){

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @Test
    void updateMarkAsFinal() throws Exception {
        Mockito.when(activityDefnService.markAsFinalActivityDefinitionVersion(ArgumentMatchers.anyString()))
                .thenReturn(MarkAsFinalActivityDefinitionVersionResp.builder().status("FINAL").build());

        MarkAsFinalActivityDefinitionVersionResp resp = activityController.markActivityDefinitionStatusAsFinal("hsbc","fd2dfe53-b38c-40cf-acb7-9850d1930858","9ec7e29e-9cbe-4298-bb67-a53f86868592");
        assertNotNull(resp);
        assertEquals(resp.getStatus(),"FINAL");
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersionNotFound() throws Exception {
        Mockito.when(activityDefnService.markAsFinalActivityDefinitionVersion(ArgumentMatchers.anyString()))
                .thenThrow(new Exception("Activity Definition Version not found"));

        Exception exception = assertThrows(Exception.class, () ->{
            activityController.markActivityDefinitionStatusAsFinal("hsbc","fd2dfe53-b38c-40cf-acb7-9850d1930858","9ec7e29e-9cbe-4298-bb67-a53f86868592");
        });
        assertEquals(exception.getMessage(),"Activity Definition Version not found");
    }
}

//package com.precisely.pem.controller;
//
//import com.precisely.pem.commonUtil.Application;
//import com.precisely.pem.commonUtil.SortBy;
//import com.precisely.pem.commonUtil.SortDirection;
//import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
//import com.precisely.pem.dtos.responses.ActivityDefnResp;
//import com.precisely.pem.dtos.responses.GetActivityDefnByIdResp;
//import com.precisely.pem.services.ActivityDefnService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.ResponseEntity;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.web.multipart.MultipartFile;
//
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//class ActivityControllerTest {
//    @InjectMocks
//    ActivityController activityController;
//
//    @Mock
//    ActivityDefnService activityDefnService;
//
//    @BeforeEach
//    void setup() throws Exception{
//        MockitoAnnotations.openMocks(this);
//    }
//    @Test
//    void testCreateActivityDefinition() throws Exception {
//        String sponsorContext = "test";
//        String name = "test";
//        String description = "test";
//        String application = "PEM";
//        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());;
//        ActivityDefnResp resp = new ActivityDefnResp();
//        Mockito.when(activityDefnService.createActivityDefinition(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.any(MultipartFile.class),Mockito.anyString()))
//                .thenReturn(resp);
//        ResponseEntity<Object> output = activityController.createActivityDefinition(name,description,file, Application.PEM,sponsorContext);
//        assertNotNull(output);
//    }
//
//    @Test
//    void testGetActivityDefinitionList() {
//        String sponsorContext = "test";
//        String name = "test";
//        ActivityDefnPaginationRes resp = new ActivityDefnPaginationRes();
//        Mockito.when(activityDefnService.getAllDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString()))
//                .thenReturn(resp);
//        ResponseEntity<Object> output = activityController.getActivityDefinitionList(sponsorContext,name,"DRAFT","PEM",1,1, SortBy.modify_ts, SortDirection.ASC,"cashbank");
//        assertNotNull(output);
//    }
//
//    @Test
//    void testGetActivityDefinitionById() throws Exception {
//        String sponsorContext = "test";
//        String activityDefnKey = "test";
//        GetActivityDefnByIdResp resp = new GetActivityDefnByIdResp();
//        Mockito.when(activityDefnService.getActivityDefinitionByKey(Mockito.anyString(),Mockito.anyString()))
//                .thenReturn(resp);
//        ResponseEntity<Object> output = activityController.getActivityDefinitionByKey(sponsorContext,activityDefnKey);
//        assertNotNull(output);
//    }
//}