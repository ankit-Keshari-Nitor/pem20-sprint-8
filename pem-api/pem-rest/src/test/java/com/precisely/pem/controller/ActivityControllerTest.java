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
