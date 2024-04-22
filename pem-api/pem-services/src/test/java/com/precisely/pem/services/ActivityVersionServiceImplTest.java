package com.precisely.pem.services;


import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.models.ActivityDefnVersion;
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

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.eq;

class ActivityVersionServiceImplTest {
    @InjectMocks
    ActivityVersionServiceImpl activityVersionService;
    @Mock
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    private ModelMapper mapper;
    @Mock
    private SponsorRepo sponsorRepo;
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
        ActivityVersionDefnPaginationResp resp = activityVersionService
                .getAllVersionDefinitionList(sponsorContext,activityDefnKey,
                        applicationDescription,isDefault,pageNo,pageSize,
                        sortBy,sortDir,status);
        assertEquals(2, resp.getContent().size());
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
        v2.setVersion(1.0);
        v2.setStatus("DRAFT");
        v2.setEncrypted(false);
        v2.setDefault(false);
        v2.setEncryptionKey("123");
        return Arrays.asList(v1,v2);
    }

    @Test
    void testGetAllVersionDefinitionById() throws Exception {
        Mockito.when(sponsorRepo.getSponsorKey(Mockito.anyString())).thenReturn("cashbank");
        Mockito.when(activityDefnVersionRepo.findVersion(Mockito.anyString(), Mockito.anyString(),Mockito.anyString()))
                .thenReturn(getVersion());
        ActivityDefnVersionDto dto;
        dto = activityVersionService.getVersionDefinitionById("test","test","test");
        assertNotNull(dto);
    }
}