package com.precisely.pem.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.commonUtil.PcptInstStatus;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.dtos.task.TaskDTO;
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


import javax.sql.rowset.serial.SerialBlob;
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
        // Given
        String sponsorContext = "testContext";
        String pcptActivityInstKey = "testKey";

        SponsorInfo sponsorInfo = new SponsorInfo(); // Assuming this is a POJO
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("NOT_STARTED");
        pcptActivityInst.setActivityInstKey("activityInstKey");
        pcptActivityInst.setPcptContextData(new SerialBlob("testData".getBytes()));

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey("activityDefnVersionKey");

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnKey("activityDefnKey");

        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("activityName");

        ActivityProcDef activityProcDef = new ActivityProcDef();
        activityProcDef.setId("procDefId");

        when(pcptInstRepo.findByPcptActivityInstKey(pcptActivityInstKey)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey("activityInstKey")).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey("activityDefnVersionKey")).thenReturn(activityDefnVersion);
        when(activityDefnRepo.findByActivityDefnKey("activityDefnKey")).thenReturn(activityDefn);
        when(activityProcDefRepo.findByResourceName("activityName.bpmn")).thenReturn(Collections.singletonList(activityProcDef));
        when(pemActivitiService.startProcessInstanceById(eq("procDefId"), any(), any())).thenReturn("processInstanceId");

        // When
        MessageResp response = participantActivityInstServiceImpl.startActivity(sponsorContext, pcptActivityInstKey);

        // Then
        assertNotNull(response);
        assertEquals("SUCCESS", response.getResponse());
        verify(pcptInstRepo, times(1)).save(pcptActivityInst);
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

    @Test
    public void testGetTaskDetails() throws Exception {
        // Mock dependencies
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("Started");
        TaskDTO taskDTO = new TaskDTO();
        ActivityTaskDto activityTaskDto = new ActivityTaskDto();
        activityTaskDto.setPcptActivityInstTaskKey("testActivityInstKey");
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        when(pemActivitiService.getTaskDetails(anyString())).thenReturn(taskDTO);
        when(mapper.map(taskDTO, ActivityTaskDto.class)).thenReturn(activityTaskDto);
        ActivityTaskDto result = participantActivityInstServiceImpl.getTaskDetails("sponsorContext", "pcptActivityInstKey", "taskKey");
        assertEquals("pcptActivityInstKey", result.getPcptActivityInstTaskKey());
    }
    @Test
    public void testSubmitTask() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("Started");
        TaskDTO taskDTO = new TaskDTO();
        ActivityTaskDto activityTaskDto = new ActivityTaskDto();
        activityTaskDto.setPcptActivityInstTaskKey("testActivityInstKey");
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        when(pemActivitiService.getTaskDetails(anyString())).thenReturn(taskDTO);
        when(mapper.map(taskDTO, ActivityTaskDto.class)).thenReturn(activityTaskDto);
        MarkAsFinalActivityDefinitionVersionResp response = participantActivityInstServiceImpl.submitTask("sponsorContext", "pcptActivityInstKey", "taskKey","{\"fields\":[{\"id\":\"1f161396-681a-4ae8-b16f-4f4e4ed282ad\",\"type\":\"textinput\",\"labelText\":\"Email\",\"helperText\":\"Enter email\",\"min\":{\"value\":\"3\",\"message\":\"value should be min 3 char\"},\"max\":{\"value\":\"5\",\"message\":\"value should be max 5 char\"},\"isRequired\":{\"value\":true,\"message\":\"isRequired\"}},{\"id\":\"682127c1-f894-488b-97db-5d06bf8dff89\",\"type\":\"textarea\",\"labelText\":\"TextArea\"},{\"id\":\"1488e97a-975d-4822-b223-f0b0fccf6698\",\"type\":\"select\",\"labelText\":\"Select Filed\"},{\"id\":\"7450017e-e15a-4278-86fa-bb00c40069b5\",\"type\":\"checkbox\",\"labelText\":\"Check Box\"},{\"id\":\"a6bcd0f9-842c-4f6f-88f1-f232c2e59a30\",\"type\":\"radio\",\"labelText\":\"Radio\"},{\"id\":\"9431f756-10c0-4ca5-bab1-3ba27d33c0c3\",\"type\":\"toggle\",\"labelText\":\"Toggler\"},{\"id\":\"3b6ed547-f460-4ed7-9cc9-1c47f64e39e7\",\"type\":\"link\",\"labelText\":\"Link\"},{\"id\":\"ed3f7b49-0265-4fbe-8d4a-6be0a9775922\",\"type\":\"datepicker\",\"labelText\":\"Date Picker\"},{\"id\":\"29e61a98-968d-4303-b777-0959927aefe9\",\"type\":\"tab\",\"children\":[{\"id\":\"43969e1c-1490-47d8-b767-86c89bce91b3\",\"tabTitle\":\"Tab-1\",\"children\":[{\"id\":\"6baf6df7-9a83-4ead-be65-4711f6a4f887\",\"type\":\"radio\",\"labelText\":\"Radio Button\"}]},{\"id\":\"f68f60d9-4538-4047-8343-504a927c8a66\",\"tabTitle\":\"tab-2\",\"children\":[{\"id\":\"43989c6a-1e8c-4e40-b02b-743f6e0d3533\",\"type\":\"textarea\",\"labelText\":\"Text Area\"}]}]},{\"id\":\"6d13daa4-da42-4d16-851d-2df2b00fc8af\",\"type\":\"button\",\"labelText\":\"Submit\"}]}");
        assertEquals("Success", response.getStatus());
    }
}
