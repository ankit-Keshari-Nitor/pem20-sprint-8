package com.precisely.pem.services;


import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.SponsorRepo;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.eq;

class ActivityVersionServiceImplTest {
    @InjectMocks
    ActivityVersionServiceImpl activityVersionService;
    @Mock
    private ActivityDefnRepo activityDefnRepo;
    @Mock
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    private ActivityDefnDataRepo activityDefnDataRepo;
    @Mock
    private ModelMapper mapper;
    @Mock
    private SponsorRepo sponsorRepo;
    @Mock
    private HttpServletRequest req;
    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testGetAllVersionDefinitionList() {
        String sponsorContext = "cashbank";
        String activityDefnKey = "name";
        String applicationDescription = "test";
        String status = "status";
        int pageNo = 0;
        int pageSize = 10;
        String sortBy = "sortBy";
        String sortDir = "sortDir";
        boolean isDefault = false;
        Mockito.when(sponsorRepo.getSponsorKey(Mockito.anyString()))
                .thenReturn("cashbank");
        Page<ActivityDefnVersion> defnsPage = new PageImpl<>(getVersionList());
        Mockito.when(activityDefnVersionRepo.findVersionList(eq(sponsorContext),
                        eq(applicationDescription),eq(activityDefnKey),
                        eq(status),Mockito.any(Pageable.class)))
                .thenReturn(defnsPage);
        ActivityDefnVersionDto dto = new ActivityDefnVersionDto();
        Mockito.when(mapper.map(Mockito.any(ActivityDefnVersion.class),eq(ActivityDefnVersionDto.class)))
                .thenReturn(dto);
        ResponseEntity<Object> resp = activityVersionService
                .getAllVersionDefinitionList(sponsorContext,activityDefnKey,
                        applicationDescription,isDefault,pageNo,pageSize,
                        sortBy,sortDir,status);
//        assertEquals(2, resp.getContent().size());
        assertNotNull(resp);
    }

    private ActivityDefnVersion getVersion() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setEncrypted(false);
        v1.setDefault(false);
        v1.setEncryptionKey("123");
        return v1;
    }
    private List<ActivityDefnVersion> getVersionList() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setEncrypted(false);
        v1.setDefault(false);
        v1.setEncryptionKey("123");

        ActivityDefnVersion v2 = new ActivityDefnVersion();
        v2.setVersion(2.0);
        v2.setStatus("DRAFT");
        v2.setEncrypted(false);
        v2.setDefault(false);
        v2.setEncryptionKey("123");
        return Arrays.asList(v1,v2);
    }

    @Test
    void testGetAllVersionDefinitionById() throws Exception {
        Mockito.when(sponsorRepo.getSponsorKey(Mockito.anyString())).thenReturn("cashbank");
        Mockito.when(activityDefnVersionRepo.findVersion(Mockito.anyString(), Mockito.anyString(),Mockito.anyDouble()))
                .thenReturn(getVersion());
        ResponseEntity<Object> dto;
        dto = activityVersionService.getVersionDefinitionById("test","test",1.0);
        assertNotNull(dto);
    }
    @Test
    void testPostCreateActivityDefnVersion() throws SQLException, IOException, OnlyOneDraftVersionException {
        ActivityDefnServiceImplTest activityDefnServiceImplTest = new ActivityDefnServiceImplTest();

        Optional<ActivityDefn> activityDefn = Optional.ofNullable(activityDefnServiceImplTest.getVchActivityDefnObj());
        ActivityDefnVersion activityDefnVersion = activityDefnServiceImplTest.getVCHActivityDefnVersionObj();
        ActivityDefnData activityDefnData = activityDefnServiceImplTest.getVchActivityDefnDataObj();
        activityDefn.get().setVersions(Arrays.asList(activityDefnVersion));
        Mockito.when(req.getRequestURL()).thenReturn(new StringBuffer("http://localhost:9080/"));
        Mockito.when(sponsorRepo.getSponsorKey(Mockito.anyString())).thenReturn("cashbank");
        Mockito.when(activityDefnRepo.findById(Mockito.anyString())).thenReturn(activityDefn);
        Mockito.when(activityDefnDataRepo.save(Mockito.any())).thenReturn(activityDefnData);
        Mockito.when(activityDefnVersionRepo.save(Mockito.any())).thenReturn(activityDefnVersion);

        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());;

        ResponseEntity<Object> resp = activityVersionService.createActivityDefnVersion("test","test",file,false,"test",req);
        assertNotNull(resp);
    }
}