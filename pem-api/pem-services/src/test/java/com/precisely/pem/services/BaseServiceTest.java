package com.precisely.pem.services;

import com.precisely.pem.commonUtil.InstStatus;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.requests.ContextDataNodes;
import com.precisely.pem.dtos.requests.Partners;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.BpmnConvertService;
import org.json.JSONObject;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.stubbing.OngoingStubbing;
import org.modelmapper.ModelMapper;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.anyString;

/**
 * BaseService class used to implement:
 *   Common Request/Response creation
 *   Constant messages and input fields value
 *   Common mock methods
 * */
public class BaseServiceTest {

    public static final String TEST_SPONSOR = "test_sponsor";
    public static final String TEST_KEY = "test_key";
    public static final String TEST_ACTIVITY_DEFN_KEY = "test_activity_defn_key";
    public static final String TEST_ACTIVITY_DEFN_VERSION_KEY = "test_activity_defn_version_key";
    public static final String TEST_ACTIVITY_DEFN_VERSION_DATA_KEY = "test_activity_defn_version_data_key";
    public static final String TEST_FILE_KEY = "file";
    public static final String TEST_FILE_VALUE = "test.json";
    public static final String CONTENT_TYPE_TEXT = "application/json";
    public static final String TEST_FILE_DATA = "This is a test file.";
    public static final String TEST_APPLICATION_NAME = "name";
    public static final String TEST_DESCRIPTION = "description";
    public static final String TEST_STATUS = "status";
    public static final String TEST_APPLICATION_KEY = "application";
    public static final String TEST_NAME = "test";
    public static final String TEST_ACTIVITY_INSTANCE_KEY = "test_activity_instance_key";
    public static final String TEST_PCPT_ACTIVITY_INSTANCE_KEY = "test_pcpt_activity_instance_key";
    public static final String TEST_PARTNER_KEY = "test_partner_key";
    public static final String TEST_PARTNER_NAME = "test_partner_name";
    public static final String TEST_CURRENT_TASK_NAME = "test_current_task_name";
    public static final String TEST_BPMN_PROCESS_ID = "test_bomn_process_id";
    public static final String TEST_CONTEXT_DATA = "{\"app\":\"name\"}";
    public static final String SAMPLE_DATA = "Test Blob Data";

    //Response Messages
    public static final String ACTIVITY_DEFINITION_NOT_FOUND = "Activity Definition with key '"+TEST_ACTIVITY_DEFN_KEY+"' not found. Kindly check the activityDefnKey.";
    public static final String ACTIVITY_DEFINITION_ALREADY_DELETED = "Activity Definition with key '" + TEST_ACTIVITY_DEFN_KEY + "' is already in Deleted state.";
    public static final String ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND = "Activity Definition Version Data with key '"+TEST_ACTIVITY_DEFN_VERSION_DATA_KEY+"' not found. Kindly check the activityDefnDataKey.";
    public static final String ACTIVITY_DEFINITION_VERSION_NOT_FOUND = "Activity Definition Version with key '"+TEST_ACTIVITY_DEFN_VERSION_KEY+"' not found. Kindly check the activityDefnVersionKey.";
    public static final String ACTIVITY_DEFINITION_VERSION_UPDATED = "Activity Definition Version Updated.";
    public static final String ACTIVITY_DEFINITION_VERSION_REQUIRED_SINGLE_FIELD_TO_UPDATE = "Complete Request Body cannot be empty, please provide atleast one input parameter for update";
    public static final String ACTIVITY_DEFINITION_VERSION_IS_IN_FINAL_DELETE_STATUS = "Activity Definition Version is in FINAL/DELETE status.";
    public static final String ACTIVITY_DEFN_KEY_WHICH_IS_ALREADY_IN_DELETED_STATE = "Cannot Update Activity Definition with key '"+TEST_ACTIVITY_DEFN_KEY+"' which is already in Deleted state.";

    @Mock
    protected ActivityDefnRepo activityDefnRepo;
    @Mock
    protected ActivityInstRepo activityInstRepo;
    @Mock
    protected SponsorRepo sponsorRepo;
    @Mock
    protected ActivityDefnDataRepo activityDefnDataRepo;
    @Mock
    protected ActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    protected ActivityDefnDeploymentCustomRepo activityDefnDeploymentCustomRepo;
    @Mock
    protected PartnerRepo partnerRepo;
    @Mock
    protected PcptInstRepo pcptInstRepo;
    @Mock
    protected ModelMapper mapper;
    @Mock
    BpmnConvertService bpmnConvertService;
    @Mock
    protected UriComponentsBuilder uriBuilder;

    //Common Mock method initialization
    public OngoingStubbing<Optional<ActivityDefn>> mockActivityDefnKey() {
        return Mockito.when(activityDefnRepo.findById(ArgumentMatchers.anyString()));
    }

    public OngoingStubbing<ActivityDefn> mockActivityDefnKeyAndSoponsorKey() {
        return Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()));
    }

    public OngoingStubbing<List<ActivityDefnVersion>> mockFindByActivityDefnKey() {
        return Mockito.when(activityDefnVersionRepo.findByActivityDefnKey(ArgumentMatchers.anyString()));
    }

    protected OngoingStubbing<String> mockGetSponsorKey() {
        return Mockito.when(sponsorRepo.getSponsorKey(anyString()));
    }

    protected OngoingStubbing<ActivityDefnData> mockActivityDefnDataSave(ActivityDefnData activityDefnData) {
        return Mockito.when(activityDefnDataRepo.save(activityDefnData));
    }

    protected OngoingStubbing<Optional<ActivityDefnData>> mockActivityDefnDataFindById() {
        return Mockito.when(activityDefnDataRepo.findById(Mockito.any()));
    }

    protected OngoingStubbing<ActivityDefnVersion> mockActivityDefnVersionSave(ActivityDefnVersion activityDefnVersion) {
        return Mockito.when(activityDefnVersionRepo.save(activityDefnVersion));
    }

    protected OngoingStubbing<Optional<ActivityDefnVersion>> mockActivityDefnVersionFindById() {
        return Mockito.when(activityDefnVersionRepo.findById(Mockito.anyString()));
    }

    protected OngoingStubbing<PcptActivityInst> mockPcptActivityInstanceKeyAndSponsorKey(){
        return Mockito.when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(Mockito.anyString(), Mockito.anyString()));
    }

    //Static Request Object Creation
    protected static MultipartFile getMultipartFile() {
        return new MockMultipartFile(TEST_FILE_KEY, TEST_FILE_VALUE, CONTENT_TYPE_TEXT, TEST_FILE_DATA.getBytes());
    }

    protected List<ActivityDefnVersion> getPartialDraftVersionList() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setEncryptionKey("123");

        ActivityDefnVersion v2 = new ActivityDefnVersion();
        v2.setVersion(1.0);
        v2.setStatus("FINAL");
        v2.setIsEncrypted(false);
        v2.setIsDefault(false);
        v2.setEncryptionKey("123");
        return Arrays.asList(v1,v2);
    }

    protected List<ActivityDefnVersion> getAllDraftVersionList() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setEncryptionKey("123");

        ActivityDefnVersion v2 = new ActivityDefnVersion();
        v2.setVersion(1.0);
        v2.setStatus("DRAFT");
        v2.setIsEncrypted(false);
        v2.setIsDefault(false);
        v2.setEncryptionKey("123");
        return Arrays.asList(v1,v2);
    }

    protected ActivityDefn getDeletedVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setIsDeleted(Boolean.TRUE);
        activityDefn.setApplication("PEM");
        activityDefn.setCreatedBy("test");
        activityDefn.setCreateTs(LocalDateTime.now());
        activityDefn.setModifyTs(LocalDateTime.now());
        activityDefn.setModifiedBy("test");
        activityDefn.setMigrationStatus(false);
        return activityDefn;
    }


    protected ActivityDefn getVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setIsDeleted(false);
        activityDefn.setApplication("PEM");
        activityDefn.setCreatedBy("test");
        activityDefn.setCreateTs(LocalDateTime.now());
        activityDefn.setModifyTs(LocalDateTime.now());
        activityDefn.setModifiedBy("test");
        activityDefn.setMigrationStatus(false);
        return activityDefn;
    }

    protected List<ActivityDefn> getListOfVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setIsDeleted(false);
        activityDefn.setApplication("PEM");
        activityDefn.setCreatedBy("test");
        activityDefn.setCreateTs(LocalDateTime.now());
        activityDefn.setModifyTs(LocalDateTime.now());
        activityDefn.setModifiedBy("test");
        activityDefn.setMigrationStatus(false);

        ActivityDefn activityDefn1 = new ActivityDefn();
        activityDefn1.setActivityName("test1");
        activityDefn1.setActivityDescription("test1");
        activityDefn1.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn1.setSponsorKey(UUID.randomUUID().toString());
        activityDefn1.setIsDeleted(false);
        activityDefn1.setApplication("PP");
        activityDefn1.setCreatedBy("test1");
        activityDefn1.setCreateTs(LocalDateTime.now());
        activityDefn1.setModifyTs(LocalDateTime.now());
        activityDefn1.setModifiedBy("test1");
        activityDefn1.setMigrationStatus(false);
        return Arrays.asList(activityDefn, activityDefn1);
    }

    protected ActivityDefnData getVchActivityDefnDataObj(){
        ActivityDefnData activityDefnData = new ActivityDefnData();
        activityDefnData.setActivityDefnDataKey("test");
        activityDefnData.setActivityDefnDataKey("test");
        activityDefnData.setCreatedBy("test");
        activityDefnData.setCreateTs(LocalDateTime.now());
        return activityDefnData;
    }

    protected ActivityDefnVersion getVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);
        activityDefnVersion.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        activityDefnVersion.setVersion(0.0);
        activityDefnVersion.setActivityDefnDataKey("test");
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setIsDefault(true);
        activityDefnVersion.setIsEncrypted(false);
        activityDefnVersion.setEncryptionKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus("FINAL");
        return activityDefnVersion;
    }

    protected ActivityDefnVersion getDraftVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);
        activityDefnVersion.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        activityDefnVersion.setVersion(0.0);
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_VERSION_DATA_KEY);
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setIsDefault(true);
        activityDefnVersion.setIsEncrypted(false);
        activityDefnVersion.setEncryptionKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus("DRAFT");
        return activityDefnVersion;
    }

    protected ActivityDefnVersion getDeletedVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);
        activityDefnVersion.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        activityDefnVersion.setVersion(0.0);
        activityDefnVersion.setActivityDefnDataKey("test");
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setIsDefault(true);
        activityDefnVersion.setIsEncrypted(false);
        activityDefnVersion.setEncryptionKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus(Status.DELETE.getStatus());
        return activityDefnVersion;
    }

    protected List<PcptActivityInst> getListOfPcptActivityInstanceDefnObj(){
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptActivityInstKey(UUID.randomUUID().toString());
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey("test");
        pcptActivityInst.setPartnerKey(TEST_PARTNER_KEY);
        pcptActivityInst.setCompletionDate(LocalDateTime.now());
        pcptActivityInst.setDueDate(LocalDateTime.now());
        pcptActivityInst.setCurrentTask(TEST_CURRENT_TASK_NAME);
        pcptActivityInst.setPcptInstStatus(TEST_STATUS);
        pcptActivityInst.setIsDeleted(false);
        pcptActivityInst.setSponsorKey("test");
        pcptActivityInst.setTaskCompleted(false);
        pcptActivityInst.setIsEncrypted(false);
        pcptActivityInst.setMailGroupKey("test");
        pcptActivityInst.setIsAlreadyRolledOut(false);

        PcptActivityInst pcptActivityInst1 = new PcptActivityInst();
        pcptActivityInst1.setPcptActivityInstKey(UUID.randomUUID().toString());
        pcptActivityInst1.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst1.setActivityWorkflowInstKey("test1");
        pcptActivityInst1.setPartnerKey(TEST_PARTNER_KEY);
        pcptActivityInst1.setCompletionDate(LocalDateTime.now());
        pcptActivityInst1.setDueDate(LocalDateTime.now());
        pcptActivityInst1.setCurrentTask(TEST_CURRENT_TASK_NAME);
        pcptActivityInst1.setPcptInstStatus(TEST_STATUS);
        pcptActivityInst1.setIsDeleted(false);
        pcptActivityInst1.setSponsorKey("test1");
        pcptActivityInst1.setTaskCompleted(false);
        pcptActivityInst1.setIsEncrypted(false);
        pcptActivityInst1.setMailGroupKey("test1");
        pcptActivityInst1.setIsAlreadyRolledOut(false);
        return Arrays.asList(pcptActivityInst, pcptActivityInst1);
    }

    protected PcptActivityInst getPcptActivityInstanceDefnObj(){
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey("test");
        pcptActivityInst.setPartnerKey(TEST_PARTNER_KEY);
        pcptActivityInst.setCompletionDate(LocalDateTime.now());
        pcptActivityInst.setDueDate(LocalDateTime.now());
        pcptActivityInst.setCurrentTask(TEST_CURRENT_TASK_NAME);
        pcptActivityInst.setPcptInstStatus(TEST_STATUS);
        pcptActivityInst.setIsDeleted(false);
        pcptActivityInst.setSponsorKey("test");
        pcptActivityInst.setTaskCompleted(false);
        pcptActivityInst.setIsEncrypted(false);
        pcptActivityInst.setMailGroupKey("test");
        pcptActivityInst.setIsAlreadyRolledOut(false);
        return pcptActivityInst;
    }

    protected ActivityInst getActivityInstanceDefnObj(){
        return ActivityInst.builder()
                .activityInstKey(TEST_ACTIVITY_INSTANCE_KEY)
                .activityDefnKey(TEST_ACTIVITY_DEFN_KEY)
                .application(TEST_APPLICATION_NAME)
                .isEncrypted(false)
                .isCreatedByPartner(false)
                .isDeleted(false)
                .emailPref(null)
                .name(TEST_APPLICATION_NAME)
                .activityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)
                .sponsorKey("test")
                .status(InstStatus.STARTED.getInstStatus())
                .alertFrequency(1)
                .description(TEST_DESCRIPTION)
                .defData(null)
                .startDate(LocalDateTime.now())
                .alertDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .build();
    }

    protected ActivityInstReq getActivityInstanceDefnReq(){
        ActivityInstReq activityInstReq = new ActivityInstReq();
        activityInstReq.setActivityDefnVersionKey("testVersionKey");
        String contextData = "{\"testNode\":\"originalValue\"}";
        JSONObject jsonObject = new JSONObject(contextData);
        activityInstReq.setContextData(jsonObject.toString());
        activityInstReq.setName("testActivity");
        activityInstReq.setDescription("testDescription");
        activityInstReq.setDueDate(LocalDateTime.now());
        activityInstReq.setAlertStartDate(LocalDateTime.now());
        activityInstReq.setAlertInterval(1);
        activityInstReq.setPartners(getListPartners());
        activityInstReq.setRolloutInternally(false);
        return activityInstReq;
    }

    protected List<Partners> getListPartners(){
        List<Partners> partnersList = new ArrayList<>();
        List<ContextDataNodes> contextDataNodesList = getContextDataNodes();
        Partners partners = new Partners();
        partners.setPartnerKey(TEST_PARTNER_KEY);
        partners.setContextDataNodes(contextDataNodesList);
        partnersList.add(partners);
        return partnersList;
    }

    protected com.precisely.pem.models.Partners getPartnerData(){
        com.precisely.pem.models.Partners partners = new com.precisely.pem.models.Partners();
        partners.setPartnerKey(TEST_PARTNER_KEY);
        partners.setPartnerStatus("APPROVED");
        return partners;
    }

    protected List<ContextDataNodes> getContextDataNodes(){
        List<ContextDataNodes> contextDataNodesList = new ArrayList<>();
        ContextDataNodes contextDataNodes1 = new ContextDataNodes();
        contextDataNodes1.setNodeRef("$.testNode");
        contextDataNodes1.setNodeValue("HTTPS");
        contextDataNodesList.add(contextDataNodes1);
        return contextDataNodesList;
    }

    protected List<ActivityInst> getActivityInstanceList() {
        List<ActivityInst> activityInstList = new ArrayList<>();
        ActivityInst inst1 = ActivityInst.builder()
                .activityInstKey(TEST_ACTIVITY_INSTANCE_KEY)
                .activityDefnKey(TEST_ACTIVITY_DEFN_KEY)
                .application(TEST_APPLICATION_NAME)
                .isEncrypted(false)
                .isCreatedByPartner(false)
                .isDeleted(false)
                .emailPref(null)
                .name(TEST_APPLICATION_NAME)
                .activityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)
                .sponsorKey("test")
                .status(InstStatus.STARTED.getInstStatus())
                .alertFrequency(1)
                .description(TEST_DESCRIPTION)
                .defData(null)
                .startDate(LocalDateTime.now())
                .alertDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .build();
        ActivityInst inst2 = ActivityInst.builder()
                .activityInstKey(TEST_ACTIVITY_INSTANCE_KEY)
                .activityDefnKey(TEST_ACTIVITY_DEFN_KEY)
                .application(TEST_APPLICATION_NAME)
                .isEncrypted(false)
                .isCreatedByPartner(false)
                .isDeleted(false)
                .emailPref(null)
                .name(TEST_APPLICATION_NAME)
                .activityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)
                .sponsorKey("test")
                .status(InstStatus.STARTED.getInstStatus())
                .alertFrequency(1)
                .description(TEST_DESCRIPTION)
                .defData(null)
                .startDate(LocalDateTime.now())
                .alertDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .build();
        activityInstList.add(inst1);
        activityInstList.add(inst2);
        return activityInstList;
    }

}
