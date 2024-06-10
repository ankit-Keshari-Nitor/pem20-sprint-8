package com.precisely.pem.controller;
import com.precisely.pem.dtos.responses.MessageResp;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.services.ParticipantActivityInstService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
public class ParticipantActivityInstanceControllerTest {
    @Mock
    private ParticipantActivityInstService participantActivityInstService;
    @InjectMocks
    private ParticipantActivityInstanceController participantActivityInstanceController;
    private MessageResp messageResp;
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        messageResp = MessageResp.builder().response("SUCCESS").build();
    }
    @Test
    public void testStartActivity_Success() throws Exception {
        when(participantActivityInstService.startActivity(anyString(), anyString())).thenReturn(messageResp);
        ResponseEntity<Object> response = participantActivityInstanceController.startActivity("testSponsorContext", "testPcptActivityInstKey");
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(messageResp, response.getBody());
    }
    @Test
    public void testStartActivity_NotFound() throws Exception {
        when(participantActivityInstService.startActivity(anyString(), anyString()))
                .thenThrow(new ResourceNotFoundException("PcptInstanceNotFound", "The participant instance with key 'testPcptActivityInstKey' not found."));
        Exception exception = null;
        try {
            participantActivityInstanceController.startActivity("testSponsorContext", "testPcptActivityInstKey");
        } catch (ResourceNotFoundException e) {
            exception = e;
        }
        assertEquals("The participant instance with key 'testPcptActivityInstKey' not found.", exception.getMessage());
    }
}
