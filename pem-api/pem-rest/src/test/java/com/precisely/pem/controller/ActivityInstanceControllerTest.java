package com.precisely.pem.controller;

import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.services.ActivityInstService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ActivityInstanceControllerTest extends BaseControllerTest{

    @InjectMocks
    ActivityInstanceController activityInstanceController;

    @Mock
    ActivityInstService activityInstService;

    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateActivityInstDefinition() throws Exception {
        ActivityInstResp resp = new ActivityInstResp();
        ActivityInstReq req = new ActivityInstReq();

        Mockito.when(activityInstService.createActivityInstance(Mockito.anyString(),Mockito.any(ActivityInstReq.class)))
                .thenReturn(resp);

        ResponseEntity<Object> output = activityInstanceController.createActivityInstance(req, TEST_SPONSOR);
        assertNotNull(output);
    }
}
