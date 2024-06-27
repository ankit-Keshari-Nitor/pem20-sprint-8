package com.precisely.pem.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.commonUtil.PcptInstStatus;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.ActivityProcDefRepo;
import com.precisely.pem.service.PEMActivitiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;


import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ParticipantActivityInstanceServiceImplTest extends BaseServiceTest{

    @InjectMocks
    protected ParticipantActivityInstServiceImpl participantActivityInstServiceImpl;
    @Mock
    private ObjectMapper objectMapper;
    @Mock
    private ActivityProcDefRepo activityProcDefRepo;
    @Mock
    private PEMActivitiService pemActivitiService;
    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
    }

    @Test
    public void testGetPcptActivityInstanceOnScheduleList() throws Exception {
        Page<PcptActivityInst> page = new PageImpl<>(getListOfPcptActivityInstanceDefnObj());
        String TEST_CURRENT_DATE = LocalDateTime.now().toString();
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        when(pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndOnScheduleProgress(
                eq(TEST_SPONSOR), eq(TEST_ACTIVITY_INSTANCE_KEY), eq(TEST_STATUS), eq(TEST_CURRENT_TASK_NAME), eq(TEST_PARTNER_NAME),eq(TEST_CURRENT_DATE),
                Mockito.any(Pageable.class))).thenReturn(page);
        PcptActivityInstDto dtoObj = new PcptActivityInstDto();
        when(mapper.map(Mockito.any(PcptActivityInst.class), eq(PcptActivityInstDto.class))).thenReturn(dtoObj);

    }

    @Test
    public void testGetPcptActivityInstanceDelayedList() throws Exception {
        Page<PcptActivityInst> page = new PageImpl<>(getListOfPcptActivityInstanceDefnObj());
        String TEST_CURRENT_DATE = LocalDateTime.of(2024,5,20,0,0).toString();
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        when(pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndDelayedProgress(
                eq(TEST_SPONSOR), eq(TEST_ACTIVITY_INSTANCE_KEY), eq(TEST_STATUS), eq(TEST_CURRENT_TASK_NAME), eq(TEST_PARTNER_NAME),eq(TEST_CURRENT_DATE),
                Mockito.any(Pageable.class))).thenReturn(page);
        PcptActivityInstDto dtoObj = new PcptActivityInstDto();
        when(mapper.map(Mockito.any(PcptActivityInst.class), eq(PcptActivityInstDto.class))).thenReturn(dtoObj);

    }


    @Test
    void testGetByPcptActivityInstanceKeyAndSponsorKey() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());
        ParticipantActivityInstResp resp;
        resp = participantActivityInstServiceImpl.getParticipantActivityInstanceByKey(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY);
        assertNotNull(resp);
    }

    @Test
    public void testStartActivity_Success() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityInstKey("activityInstKey");
        Blob blob = mock(Blob.class);
        when(blob.length()).thenReturn(10L);
        when(blob.getBytes(1, 10)).thenReturn("{\r\n  \"activityDefnVersionKey\": \"f532a80a-19fb-4e02-acbe-2a1d1958a90b\",\r\n  \"name\": \"Shrirang\",\r\n  \"description\": \"Sample\",\r\n  \"alertStartDate\": \"2024-05-19T04:17:51.418Z\",\r\n  \"alertInterval\": 2,\r\n  \"dueDate\": \"2024-05-19T04:17:51.418Z\",\r\n  \"partners\": [\r\n    {\r\n      \"partnerKey\": \"041fba37-ee7a-433a-b0bc-91ad45de6c39\",\r\n      \"contextDataNodes\": [\r\n        {\r\n          \"nodeRef\": \"$.applications.SponsorConfigurations.CustomProtocols.protocol[0]._value\",\r\n          \"nodeValue\": \"HTTPS\"\r\n        },\r\n\t\t{\r\n          \"nodeRef\": \"$.applications.SponsorConfigurations.CustomProtocols.protocol[1]._value\",\r\n          \"nodeValue\": \"HTTPS\"\r\n        },\r\n\t\t{\r\n          \"nodeRef\": \"$.applications.PR._type\",\r\n          \"nodeValue\": \"Shrirang\"\r\n        }\r\n      ]\r\n    }\r\n  ],\r\n\"contextData\":\"\",\r\n  \"rolloutInternally\": false,\r\n  \"attributeValues\": [\r\n    {\r\n      \"attributeValueKey\": \"string\"\r\n    }\r\n  ],\r\n  \"attributeGroups\": [\r\n    {\r\n      \"attributeGroupKey\": \"string\"\r\n    }\r\n  ]\r\n}"
                .getBytes());
        pcptActivityInst.setPcptContextData(blob);
        pcptActivityInst.setPcptInstStatus("");
        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey("activityDefnVersionKey");
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnKey("activityDefnKey");
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("activityName");
        ActivityProcDef activityProcDef = new ActivityProcDef();
        activityProcDef.setId("processDefId");

        when(pcptInstRepo.findByPcptActivityInstKey(anyString())).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey(anyString())).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey(anyString())).thenReturn(activityDefnVersion);
        when(activityDefnRepo.findByActivityDefnKey(anyString())).thenReturn(activityDefn);
        when(activityProcDefRepo.findByResourceName(anyString())).thenReturn(List.of(activityProcDef));
        when(objectMapper.readValue(anyString(), (Class<Object>) any())).thenReturn(Collections.emptyMap());

        when(pemActivitiService.startProcessInstanceById(anyString(), anyString(), anyMap())).thenReturn("processInstanceId");

        MessageResp result = participantActivityInstServiceImpl.startActivity("sponsorContext", "pcptActivityInstKey");

        assertNotNull(result);
        assertEquals("SUCCESS", result.getResponse());

        verify(pcptInstRepo).findByPcptActivityInstKey(anyString());
        verify(activityInstRepo).findByActivityInstKey(anyString());
        verify(activityDefnVersionRepo).findByActivityDefnVersionKey(anyString());
        verify(activityDefnRepo).findByActivityDefnKey(anyString());
        verify(activityProcDefRepo).findByResourceName(anyString());
        verify(pcptInstRepo).save(pcptActivityInst);
    }
    @Test
    public void testStartActivity_ResourceNotFound() {
        when(pcptInstRepo.findByPcptActivityInstKey(anyString())).thenReturn(null);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            participantActivityInstServiceImpl.startActivity("sponsorContext", "pcptActivityInstKey");
        });

        String expectedMessage = "The participant instance with key 'pcptActivityInstKey' not found.";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));

        verify(pcptInstRepo, times(1)).findByPcptActivityInstKey(anyString());
    }
}
