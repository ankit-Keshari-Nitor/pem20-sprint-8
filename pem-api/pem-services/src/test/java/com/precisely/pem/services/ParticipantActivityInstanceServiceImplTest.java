package com.precisely.pem.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.dtos.requests.ProcessDataEvaluation;
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
import org.mockito.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ParticipantActivityInstanceServiceImplTest extends BaseServiceTest{

    @InjectMocks
    protected ParticipantActivityInstServiceImpl participantActivityInstServiceImpl;
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
    public void testGetTaskDetails_success() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String taskKey = "taskKey";
        SponsorInfo sponsorInfo = new SponsorInfo();
        sponsorInfo.setSponsorKey("sponsorKey");
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        TaskDTO taskDTO = new TaskDTO();
        ActivityTaskDto activityTaskDto = new ActivityTaskDto();
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        when(pemActivitiService.getUserNodeDetails(anyString())).thenReturn(taskDTO);
        when(mapper.map(any(TaskDTO.class), eq(ActivityTaskDto.class))).thenReturn(activityTaskDto);
        ActivityTaskDto result = participantActivityInstServiceImpl.getNodeDetails(sponsorContext, pcptActivityInstKey, taskKey);
        assertNotNull(result);
        verify(pemActivitiService, times(1)).getUserNodeDetails(taskKey);
    }

    @Test
    public void testSubmitTaskWhenPcptInstIsStartedAndNotDraft() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String taskKey = "taskKey";
        String data = "data";
        Boolean isDraft = false;
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        MarkAsFinalActivityDefinitionVersionResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, taskKey, data, isDraft);
        assertNotNull(response);
        verify(pemActivitiService).completeUserNode(taskKey, data);
    }

    @Test
    public void testSubmitTaskWhenPcptInstIsStartedAndDraft() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String taskKey = "taskKey";
        String data = "data";
        Boolean isDraft = true;
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        MarkAsFinalActivityDefinitionVersionResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, taskKey, data, isDraft);
        assertNotNull(response);
        Map<String, Object> expectedVariables = new HashMap<>();
        expectedVariables.put("draft", data);
        verify(pemActivitiService).setTaskVariables(taskKey, expectedVariables);
    }

    @Test
    public void testGetNodeDetails_success() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        SponsorInfo sponsorInfo = new SponsorInfo();
        sponsorInfo.setSponsorKey("sponsorKey");
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        TaskDTO taskDTO = new TaskDTO();
        ActivityTaskDto activityTaskDto = new ActivityTaskDto();
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        when(pemActivitiService.getUserNodeDetails(anyString())).thenReturn(taskDTO);
        when(mapper.map(any(TaskDTO.class), eq(ActivityTaskDto.class))).thenReturn(activityTaskDto);
        ActivityTaskDto result = participantActivityInstServiceImpl.getNodeDetails(sponsorContext, pcptActivityInstKey, nodeKey);
        assertNotNull(result);
        verify(pemActivitiService, times(1)).getUserNodeDetails(nodeKey);
    }

    @Test
    public void testSubmitNodeWhenPcptInstIsStartedAndNotDraft() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        String data = "data";
        Boolean isDraft = false;
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        MarkAsFinalActivityDefinitionVersionResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, nodeKey, data, isDraft);
        assertNotNull(response);
        verify(pemActivitiService).completeUserNode(nodeKey, data);
    }

    @Test
    public void testSubmitNodeWhenPcptInstIsStartedAndDraft() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        String data = "data";
        Boolean isDraft = true;
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        MarkAsFinalActivityDefinitionVersionResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, nodeKey, data, isDraft);
        assertNotNull(response);
        Map<String, Object> expectedVariables = new HashMap<>();
        expectedVariables.put("draft", data);
        verify(pemActivitiService).setTaskVariables(nodeKey, expectedVariables);
    }

    @Test
    public void evaluatePath_Success() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);
        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(pcptActivityInst));

        when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(getMockedProcessVariables());

        List<String> paths = new ArrayList<>();
        paths.add("$.applications.SSP.FTP_Netmap");
        paths.add("$.applications.SSP.ciphers.cipher[*]");
        paths.add("$.applications.SponsorConfigurations.CustomProtocols.protocol[?(@._name == 'http-protocol')]");
        ProcessEvaluationResponse response = participantActivityInstServiceImpl.evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,
                ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build());

        assertEquals(TEST_CONTEXT_DATA_FIELD, response.getProcessEvaluationResult().get(0).getValue());
        assertNotNull(response.getProcessEvaluationResult().get(1).getValue());
        assertNotNull(response.getProcessEvaluationResult().get(2).getValue());

    }

    @Test
    public void evaluatePath_PcptInstanceKeyNotFound_Failure() {

        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.empty());

        List<String> paths = new ArrayList<>();
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.
                evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build()));

        assertNotNull(exception);
        assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_FOUND,exception.getMessage());
    }

    @Test
    public void evaluatePath_ProcessDataNotFound_Failure() {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);
        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(pcptActivityInst));

        when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(null );
        List<String> paths = new ArrayList<>();
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.
                evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build()));

        assertNotNull(exception);
        assertEquals(PCPT_ACTIVITY_INSTANCE_PROCESS_DATA_NOT_FOUND,exception.getMessage());
    }

    @Test
    public void evaluatePath_PcptActivityNotStarted_Failure() {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(pcptActivityInst));

        List<String> paths = new ArrayList<>();
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.
                evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build()));

        assertNotNull(exception);
        assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_STARTED,exception.getMessage());
    }

    private static Map<String, Object>  getMockedProcessVariables() throws IOException {
        ClassPathResource classPathResource = new ClassPathResource(CONTEXT_DATA_SAMPLE_JSON);
        Path filePath = Paths.get(classPathResource.getURI());
        String contextDataJson = new String(Files.readAllBytes(filePath));
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(contextDataJson, new TypeReference<HashMap<String, Object>>() {});
    }
}
