package com.precisely.pem.services;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityDefnDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.SponsorRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;


class ActivityDefnServiceImplTest {
    @InjectMocks
    ActivityDefnServiceImpl activityDefinitionService;
    @Mock
    private SponsorRepo sponsorRepo;
    @Mock
    private ActivityDefnRepo activityDefnRepo;
    @Mock
    private ActivityDefnDataRepo activityDefnDataRepo;
    @Mock
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    private ModelMapper mapper;
    @Mock
    private UriComponentsBuilder uriBuilder;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey("8ad41d89-5067-42f2-b310-2e27aa1a21d1").build());
    }

    @Test
    void testGetAllDefinitionList() throws Exception {
        String sponsorContext = "context";
        String applicationName = "name";
        String applicationDescription = "description";
        String status = "status";
        String application = "application";
        int pageNo = 0;
        int pageSize = 10;
        String sortBy = "sortBy";
        String sortDir = "sortDir";
        Page<ActivityDefn> page = new PageImpl<>(getListOfVchActivityDefnObj());
        Mockito.when(sponsorRepo.getSponsorKey(anyString())).thenReturn("cashbank");
        Mockito.when(activityDefnRepo.findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatus(
                eq(status), eq("cashbank"), eq(application), eq(applicationName), eq(applicationDescription),
                Mockito.any(Pageable.class))).thenReturn(page);
        ActivityDefnDto dtoObj = new ActivityDefnDto();
        dtoObj.setActivityDefnKey("activityDefnKey");
        Mockito.when(mapper.map(Mockito.any(ActivityDefn.class), eq(ActivityDefnDto.class))).thenReturn(dtoObj);
//        assertNotNull(activityDefinitionService.getAllDefinitionList(
//                sponsorContext, applicationName, applicationDescription, status, application,
//                pageNo, pageSize, sortBy, sortDir));
    }

    @Test
    void testCreateActivityDefinition() throws SQLException, IOException {
        Mockito.when(sponsorRepo.getSponsorKey(anyString())).thenReturn("test");
        Mockito.when(activityDefnRepo.save(Mockito.any())).thenReturn(getVchActivityDefnObj());
        Mockito.when(activityDefnDataRepo.save(Mockito.any())).thenReturn(getVchActivityDefnDataObj());
        Mockito.when(activityDefnVersionRepo.save(Mockito.any())).thenReturn(getVCHActivityDefnVersionObj());
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());;

        ActivityDefnReq activityDefnReq = new ActivityDefnReq();
        activityDefnReq.setApplication(Application.PEM);
        activityDefnReq.setDescription("desc");
        activityDefnReq.setName("test");
        activityDefnReq.setFile(file);

        assertNotNull(activityDefinitionService.createActivityDefinition("test",activityDefnReq));
    }

    @Test
    void testFindByActivityDefnKeyAndSponsorKey() throws Exception {
        Mockito.when(sponsorRepo.getSponsorKey(anyString())).thenReturn("test");
        Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(anyString(),anyString()))
                .thenReturn(getVchActivityDefnObj());
        ActivityDefnListResp resp;
        resp = activityDefinitionService.getActivityDefinitionByKey("test","test");
        assertNotNull(resp);
    }

    @Test
    void deleteActivityDefinition_WithAllDraftVersions() throws Exception {
        Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(getVchActivityDefnObj());

        Mockito.when(activityDefnVersionRepo.findByActivityDefnKey(ArgumentMatchers.anyString())).thenReturn(getAllDraftVersionList());

        DeleteActivityDefinition response = activityDefinitionService.deleteActivityDefinitionById("test_sponsor","test_key");
        assertNotNull(response);
    }

    @Test
    void deleteActivityDefinition_WithPartialDraftVersions() throws Exception {
        Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(getVchActivityDefnObj());

        Mockito.when(activityDefnVersionRepo.findByActivityDefnKey(ArgumentMatchers.anyString())).thenReturn(getPartialDraftVersionList());

        DeleteActivityDefinition response = activityDefinitionService.deleteActivityDefinitionById("test_sponsor","test_key");
        assertNotNull(response);
    }

    @Test
    void deleteActivityDefinition_NotFoundActivityDefinition() throws Exception {
        Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(null );

        Exception exception = assertThrows(Exception.class, () ->{
            activityDefinitionService.deleteActivityDefinitionById("test_sponsor","test_key");
        });
        assertEquals(exception.getMessage(),"Activity Definition not found");
    }

    @Test
    void deleteActivityDefinition_AlreadyDeletedActivityDefinition(){
        Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()))
                .thenReturn(getDeletedVchActivityDefnObj() );

        Exception exception = assertThrows(Exception.class, () ->{
            activityDefinitionService.deleteActivityDefinitionById("test_sponsor","test_key");
        });
        assertEquals(exception.getMessage(),"Activity Definition Already Deleted");
    }

    public ActivityDefn getVchActivityDefnObj(){
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

    public List<ActivityDefn> getListOfVchActivityDefnObj(){
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

    public ActivityDefnData getVchActivityDefnDataObj(){
        ActivityDefnData activityDefnData = new ActivityDefnData();
        activityDefnData.setActivityDefnDataKey("test");
        activityDefnData.setActivityDefnDataKey("test");
        activityDefnData.setCreatedBy("test");
        activityDefnData.setCreateTs(LocalDateTime.now());
        return activityDefnData;
    }

    public ActivityDefnVersion getVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnKeyVersion("test");
        activityDefnVersion.setActivityDefnKey("test");
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

    public ActivityDefn getDeletedVchActivityDefnObj(){
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

    private List<ActivityDefnVersion> getAllDraftVersionList() {
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

    private List<ActivityDefnVersion> getPartialDraftVersionList() {
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
}