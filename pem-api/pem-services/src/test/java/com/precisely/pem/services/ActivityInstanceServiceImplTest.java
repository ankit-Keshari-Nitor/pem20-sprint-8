package com.precisely.pem.services;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.precisely.pem.dtos.responses.ActivityInstPagnResp;
import com.precisely.pem.dtos.responses.ActivityInstListResp;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.ActivityInst;
import com.precisely.pem.repositories.ActivityInstRepo;
import com.precisely.pem.repositories.SponsorRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ActivityInstanceServiceImplTest {
    @Mock
    private ActivityInstRepo activityInstRepo;
    @Mock
    private ModelMapper mapper;
    @Mock
    private SponsorRepo sponsorRepo;
    @InjectMocks
    private ActivityInstServiceImpl activityInstService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey("TEST_SPONSOR").build());
    }

    @Test
    void testGetAllInstanceList_NoDataFound() {
        Page pageable = new PageImpl<>(getInstanceList());
        when(activityInstRepo.findBySponsorKeyAndActivityDefnKeyVersionAndStatus(eq("TEST_SPONSOR"), eq("TEST"), eq("test"), Mockito.any(Pageable.class)))
                .thenReturn(Page.empty());
        assertThrows(ResourceNotFoundException.class, () -> {
            activityInstService.getAllInstanceList("TEST_SPONSOR", "", "", "INPROGRESS", "activityDefnVersionKey", "", false, 0, 10, "modify_ts", "DESC");
        });
    }

    private List<ActivityInst> getInstanceList() {
        ActivityInst a = new ActivityInst();
        ActivityInst b = new ActivityInst();
        return Arrays.asList(a,b);
    }

    @Test
    void testGetAllInstanceList_Success() throws ResourceNotFoundException {
        Page pageable = new PageImpl<>(getInstanceList());
        List<ActivityInst> activityInstList = new ArrayList<>();
        ActivityInst activityInst = new ActivityInst();
        activityInstList.add(activityInst);
        when(activityInstRepo.findBySponsorKeyAndActivityDefnKeyVersionAndStatus(anyString(), anyString(), anyString(), Mockito.any(Pageable.class)))
                .thenReturn(pageable);
        ActivityInstListResp activityInstListResp = new ActivityInstListResp();
        when(mapper.map(activityInst, ActivityInstListResp.class)).thenReturn(activityInstListResp);
        ActivityInstPagnResp response = activityInstService.getAllInstanceList("TEST_SPONSOR", "", "", "INPROGRESS", "activityDefnVersionKey", "", false, 0, 10, "modify_ts", "DESC");
        assertEquals(2, response.getPage().getTotalElements());
    }

    @Test
    void testGetInstanceById_NotFound() {
        when(activityInstRepo.findByActivityInstKey(anyString())).thenReturn(null);
        assertThrows(ResourceNotFoundException.class, () -> {
            activityInstService.getInstanceByKey("sponsorContext", "activityInstKey");
        });
    }

    @Test
    void testGetInstanceById_Success() throws ResourceNotFoundException {
        ActivityInst activityInst = new ActivityInst();
        when(activityInstRepo.findByActivityInstKey(anyString())).thenReturn(activityInst);
        ActivityInstListResp activityInstListResp = new ActivityInstListResp();
        when(mapper.map(activityInst, ActivityInstListResp.class)).thenReturn(activityInstListResp);
        ActivityInstListResp response = activityInstService.getInstanceByKey("TEST_SPONSOR", "activityInstKey");
        assertEquals(activityInstListResp, response);
    }
}
