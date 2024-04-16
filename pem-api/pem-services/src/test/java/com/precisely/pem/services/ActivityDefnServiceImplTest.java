package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.GetActivityDefnByIdResp;
import com.precisely.pem.dtos.shared.ActivityDefnDto;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;


class ActivityDefnServiceImplTest {
    @InjectMocks
    ActivityDefnServiceImpl vchActivityDefinitionService;
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
    }

    @Test
    void testGetAllDefinitionList() {
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
        Mockito.when(activityDefnRepo.findByStatusAndSponsorContextAndApplicationAndByNameAndDescription(
                eq(status), eq("cashbank"), eq(application), eq(applicationName), eq(applicationDescription),
                Mockito.any(Pageable.class))).thenReturn(page);
        ActivityDefnDto dtoObj = new ActivityDefnDto();
        dtoObj.setActivityDefnKey("activityDefnKey");
        Mockito.when(mapper.map(Mockito.any(ActivityDefn.class), eq(ActivityDefnDto.class))).thenReturn(dtoObj);
        ActivityDefnPaginationRes result = vchActivityDefinitionService.getAllDefinitionList(
                sponsorContext, applicationName, applicationDescription, status, application,
                pageNo, pageSize, sortBy, sortDir);
        assertEquals(2, result.getContent().size());
    }

    @Test
    void testCreateActivityDefinition() throws SQLException, IOException {
        Mockito.when(sponsorRepo.getSponsorKey(anyString())).thenReturn("test");
        Mockito.when(activityDefnRepo.save(Mockito.any())).thenReturn(getVchActivityDefnObj());
        Mockito.when(activityDefnDataRepo.save(Mockito.any())).thenReturn(getVchActivityDefnDataObj());
        Mockito.when(activityDefnVersionRepo.save(Mockito.any())).thenReturn(getVCHActivityDefnVersionObj());
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());;
        ActivityDefnResp resp = vchActivityDefinitionService.createActivityDefinition(
                "test", "test", "test", file, "PEM");
        assertNotNull(resp);
    }

    @Test
    void testFindByActivityDefnKeyAndSponsorKey() throws Exception {
        Mockito.when(sponsorRepo.getSponsorKey(anyString())).thenReturn("test");
        Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(anyString(),anyString()))
                .thenReturn(getVchActivityDefnObj());
        GetActivityDefnByIdResp resp;
        resp = vchActivityDefinitionService.getActivityDefinitionByKey("test","test");
        assertNotNull(resp);
    }

    public ActivityDefn getVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setDeleted(false);
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
        activityDefn.setDeleted(false);
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
        activityDefn1.setDeleted(false);
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
        activityDefnVersion.setVersion(0);
        activityDefnVersion.setActivityDefnDataKey("test");
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setDefault(true);
        activityDefnVersion.setEncrypted(false);
        activityDefnVersion.setEncryptionKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus("FINAL");
        return activityDefnVersion;
    }
}