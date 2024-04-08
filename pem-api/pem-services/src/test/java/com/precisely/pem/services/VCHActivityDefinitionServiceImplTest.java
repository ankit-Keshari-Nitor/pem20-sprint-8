package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import com.precisely.pem.models.VCHActivityDefn;
import com.precisely.pem.models.VCHActivityDefnData;
import com.precisely.pem.models.VCHActivityDefnVersion;
import com.precisely.pem.repositories.VCHActivityDefnDataRepo;
import com.precisely.pem.repositories.VCHActivityDefnRepo;
import com.precisely.pem.repositories.VCHActivityDefnVersionRepo;
import com.precisely.pem.repositories.VCHSponsorRepo;
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


class VCHActivityDefinitionServiceImplTest {
    @InjectMocks
    VCHActivityDefinitionServiceImpl vchActivityDefinitionService;
    @Mock
    private VCHSponsorRepo vchSponsorRepo;
    @Mock
    private VCHActivityDefnRepo vchActivityDefnRepo;
    @Mock
    private VCHActivityDefnDataRepo vchActivityDefnDataRepo;
    @Mock
    private VCHActivityDefnVersionRepo vchActivityDefnVersionRepo;
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
        Page<VCHActivityDefn> page = new PageImpl<>(getListOfVchActivityDefnObj());
        Mockito.when(vchSponsorRepo.getSponsorKey(anyString())).thenReturn("cashbank");
        Mockito.when(vchActivityDefnRepo.findByStatusAndSponsorContextAndApplicationAndByNameAndDescription(
                eq(status), eq("cashbank"), eq(application), eq(applicationName), eq(applicationDescription),
                Mockito.any(Pageable.class))).thenReturn(page);
        VCHActivityDefnDto dtoObj = new VCHActivityDefnDto();
        dtoObj.setActivityDefnKey("activityDefnKey");
        Mockito.when(mapper.map(Mockito.any(VCHActivityDefn.class), eq(VCHActivityDefnDto.class))).thenReturn(dtoObj);
        VCHActivityDefnPaginationRes result = vchActivityDefinitionService.getAllDefinitionList(
                sponsorContext, applicationName, applicationDescription, status, application,
                pageNo, pageSize, sortBy, sortDir);
        assertEquals(2, result.getContent().size());
    }

    @Test
    void testCreateActivityDefinition() throws SQLException, IOException {
        Mockito.when(vchSponsorRepo.getSponsorKey(anyString())).thenReturn("test");
        Mockito.when(vchActivityDefnRepo.save(Mockito.any())).thenReturn(getVchActivityDefnObj());
        Mockito.when(vchActivityDefnDataRepo.save(Mockito.any())).thenReturn(getVchActivityDefnDataObj());
        Mockito.when(vchActivityDefnVersionRepo.save(Mockito.any())).thenReturn(getVCHActivityDefnVersionObj());
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());;
        VCHCreateActivityDefinitionResp resp = vchActivityDefinitionService.createActivityDefinition(
                "test", "test", "test", file, "PEM");
        assertNotNull(resp);
    }

    @Test
    void testFindByActivityDefnKeyAndSponsorKey() throws Exception {
        Mockito.when(vchSponsorRepo.getSponsorKey(anyString())).thenReturn("test");
        Mockito.when(vchActivityDefnRepo.findByActivityDefnKeyAndSponsorKey(anyString(),anyString()))
                .thenReturn(getVchActivityDefnObj());
        VCHActivityDefnDto resp;
        resp = vchActivityDefinitionService.getActivityDefinitionByKey("test","test");
        assertNotNull(resp);
    }

    public VCHActivityDefn getVchActivityDefnObj(){
        VCHActivityDefn vchActivityDefn = new VCHActivityDefn();
        vchActivityDefn.setActivityName("test");
        vchActivityDefn.setActivityDescription("test");
        vchActivityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        vchActivityDefn.setSponsorKey(UUID.randomUUID().toString());
        vchActivityDefn.setDeleted(false);
        vchActivityDefn.setApplication("PEM");
        vchActivityDefn.setCreatedBy("test");
        vchActivityDefn.setCreateTs(LocalDateTime.now());
        vchActivityDefn.setModifyTs(LocalDateTime.now());
        vchActivityDefn.setModifiedBy("test");
        vchActivityDefn.setMigrationStatus(false);
        return vchActivityDefn;
    }

    public List<VCHActivityDefn> getListOfVchActivityDefnObj(){
        VCHActivityDefn vchActivityDefn = new VCHActivityDefn();
        vchActivityDefn.setActivityName("test");
        vchActivityDefn.setActivityDescription("test");
        vchActivityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        vchActivityDefn.setSponsorKey(UUID.randomUUID().toString());
        vchActivityDefn.setDeleted(false);
        vchActivityDefn.setApplication("PEM");
        vchActivityDefn.setCreatedBy("test");
        vchActivityDefn.setCreateTs(LocalDateTime.now());
        vchActivityDefn.setModifyTs(LocalDateTime.now());
        vchActivityDefn.setModifiedBy("test");
        vchActivityDefn.setMigrationStatus(false);

        VCHActivityDefn vchActivityDefn1 = new VCHActivityDefn();
        vchActivityDefn1.setActivityName("test1");
        vchActivityDefn1.setActivityDescription("test1");
        vchActivityDefn1.setActivityDefnKey(UUID.randomUUID().toString());
        vchActivityDefn1.setSponsorKey(UUID.randomUUID().toString());
        vchActivityDefn1.setDeleted(false);
        vchActivityDefn1.setApplication("PP");
        vchActivityDefn1.setCreatedBy("test1");
        vchActivityDefn1.setCreateTs(LocalDateTime.now());
        vchActivityDefn1.setModifyTs(LocalDateTime.now());
        vchActivityDefn1.setModifiedBy("test1");
        vchActivityDefn1.setMigrationStatus(false);
        return Arrays.asList(vchActivityDefn,vchActivityDefn1);
    }

    public VCHActivityDefnData getVchActivityDefnDataObj(){
        VCHActivityDefnData vchActivityDefnData = new VCHActivityDefnData();
        vchActivityDefnData.setActivityDefnDataKey("test");
        vchActivityDefnData.setActivityDefnDataKey("test");
        vchActivityDefnData.setCreatedBy("test");
        vchActivityDefnData.setCreateTs(LocalDateTime.now());
        return vchActivityDefnData;
    }

    public VCHActivityDefnVersion getVCHActivityDefnVersionObj(){
        VCHActivityDefnVersion vchActivityDefnVersion = new VCHActivityDefnVersion();
        vchActivityDefnVersion.setActivityDefnKeyVersion("test");
        vchActivityDefnVersion.setActivityDefnKey("test");
        vchActivityDefnVersion.setVersion("test");
        vchActivityDefnVersion.setActivityDefnDataKey("test");
        vchActivityDefnVersion.setCreatedBy("test");
        vchActivityDefnVersion.setCreateTs(LocalDateTime.now());
        vchActivityDefnVersion.setDefault(true);
        vchActivityDefnVersion.setEncrypted(false);
        vchActivityDefnVersion.setEncryptionKey("test");
        vchActivityDefnVersion.setModifiedBy("test");
        vchActivityDefnVersion.setModifyTs(LocalDateTime.now());
        vchActivityDefnVersion.setStatus("FINAL");
        return vchActivityDefnVersion;
    }
}