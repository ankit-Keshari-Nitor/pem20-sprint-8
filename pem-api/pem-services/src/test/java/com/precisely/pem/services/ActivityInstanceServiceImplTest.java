package com.precisely.pem.services;

import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstListResp;
import com.precisely.pem.dtos.responses.ActivityInstPagnResp;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.ActivityInstDto;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.models.ActivityInst;
import com.precisely.pem.models.PcptActivityInst;
import org.json.JSONException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ActivityInstanceServiceImplTest extends BaseServiceTest {

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

    @Test
    public void testCreateActivityInstance_Success() throws Exception {
        ActivityInstDto activityInstDto = new ActivityInstDto();
        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        PcptActivityInst pcptActivityInst = new PcptActivityInst();

        when(activityDefnVersionRepo.findByActivityDefnKeyVersion(anyString())).thenReturn(getVCHActivityDefnVersionObj());
        when(partnerRepo.findById(getListPartners().get(0).getPartnerKey())).thenReturn(Optional.ofNullable(getPartnerData()));
        when(mapper.map(any(ActivityInstDto.class), eq(ActivityInst.class))).thenReturn(activityInst);
        when(mapper.map(any(PcptActivityInstDto.class), eq(PcptActivityInst.class))).thenReturn(pcptActivityInst);

        ActivityInstResp response = activityInstService.createActivityInstance("TEST_SPONSOR", getActivityInstanceDefnReq());

        assertNotNull(response);
        assertNotNull(response.getActivityInstKey());
        verify(activityInstRepo, times(1)).save(any(ActivityInst.class));
        verify(pcptInstRepo, times(getActivityInstanceDefnReq().getPartners().size())).save(any(PcptActivityInst.class));
    }

    @Test
    public void testCreateActivityInstance_ResourceNotFoundException_NoActivityDefnVersion() {
        when(activityDefnVersionRepo.findByActivityDefnKeyVersion(anyString())).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> {
            activityInstService.createActivityInstance("TEST_SPONSOR", getActivityInstanceDefnReq());
        });
    }

    @Test
    public void testCreateActivityInstance_ResourceNotFoundException_EmptyActivityDefnKey() {
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnKey("");

        assertThrows(ResourceNotFoundException.class, () -> {
            activityInstService.createActivityInstance("TEST_SPONSOR", getActivityInstanceDefnReq());
        });
    }

    @Test
    public void testCreateActivityInstance_JSONException() throws Exception {
        ActivityInstReq activityInstReq = getActivityInstanceDefnReq();
        activityInstReq.setContextData("invalidJSON");
        when(activityDefnVersionRepo.findByActivityDefnKeyVersion(anyString())).thenReturn(getVCHActivityDefnVersionObj());

        assertThrows(JSONException.class, () -> {
            activityInstService.createActivityInstance("TEST_SPONSOR", activityInstReq);
        });
    }
}
