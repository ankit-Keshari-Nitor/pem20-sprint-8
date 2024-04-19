package com.precisely.pem.controller;

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
    ActivityVersionService activityDefnService;

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
