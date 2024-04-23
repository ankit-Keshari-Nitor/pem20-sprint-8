//package com.precisely.pem.controller;
//
//import com.precisely.pem.commonUtil.Application;
//import com.precisely.pem.commonUtil.SortBy;
//import com.precisely.pem.commonUtil.SortDirection;
//import com.precisely.pem.commonUtil.Status;
//import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
//import com.precisely.pem.services.ActivityVersionService;
//import jakarta.servlet.http.HttpServletRequest;
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
//import java.io.IOException;
//import java.sql.SQLException;
//
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//class ActivityVersionControllerTest {
//    @InjectMocks
//    ActivityVersionController activityVersionController;
//    @Mock
//    ActivityVersionService activityVersionService;
//    @BeforeEach
//    void setup() throws Exception{
//        MockitoAnnotations.openMocks(this);
//    }
//    @Mock
//    HttpServletRequest req;
//    @Test
//    void testGetActivityDefinitionVersionsList() {
//        ResponseEntity<Object> resp = ResponseEntity.ok().build();
//        Mockito.when(activityVersionService.getAllVersionDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyBoolean(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString()))
//                .thenReturn(resp);
//        ResponseEntity<Object> output = activityVersionController.getActivityVersionDefinitionList("test",false,"test", Status.DRAFT,0,1, SortBy.modify_ts, SortDirection.ASC,"cashbank");
//        assertNotNull(output);
//    }
//
//    @Test
//    void testGetActivityDefinitionVersionById() throws Exception {
//        ResponseEntity<Object> resp = ResponseEntity.ok().build();
//        Mockito.when(activityVersionService.getVersionDefinitionById(Mockito.anyString(),Mockito.anyString(),Mockito.anyDouble()))
//                .thenReturn(resp);
//        ResponseEntity<Object> output = activityVersionController.getActivityVersionDefinitionById("test",1.0,"test");
//        assertNotNull(output);
//    }
//
//    @Test
//    void testPostCreateActivityDefnVersion() throws SQLException, IOException, OnlyOneDraftVersionException {
//        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());
//        ResponseEntity<Object> resp = ResponseEntity.ok().build();
//        Mockito.when(activityVersionService.createActivityDefnVersion(Mockito.anyString(),Mockito.anyString(),Mockito.any(MultipartFile.class),Mockito.anyBoolean(),Mockito.anyString()))
//                .thenReturn(resp);
//        ResponseEntity<Object> output = activityVersionController.createActivityDefinition("test","test",file,false, Application.PEM,req);
//        assertNotNull(output);
//    }
//}