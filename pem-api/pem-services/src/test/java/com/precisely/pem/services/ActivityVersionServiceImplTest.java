package com.precisely.pem.services;


import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.requests.UpdateActivityVersionReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.stubbing.OngoingStubbing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;

class ActivityVersionServiceImplTest extends BaseServiceTest{

    @InjectMocks
    ActivityVersionServiceImpl activityVersionService;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        SponsorInfo sponsorInfo = new SponsorInfo("cashbank","test");
        TenantContext.setTenantContext(sponsorInfo);
    }
    @Test
    void testGetAllVersionDefinitionList() throws Exception {
        String sponsorContext = "cashbank";
        String activityDefnKey = "name";
        String applicationDescription = "test";
        String status = "status";
        int pageNo = 0;
        int pageSize = 10;
        String sortBy = "sortBy";
        String sortDir = "sortDir";
        boolean isDefault = false;
        Page<ActivityDefnVersion> defnsPage = new PageImpl<>(getVersionList());
        Mockito.when(activityDefnVersionRepo.findByActivityDefnKeyAndStatusAndActivityDefnSponsorKeyAndDescriptionContaining(eq(activityDefnKey),eq(status),eq(sponsorContext),
                        eq(applicationDescription),Mockito.any(Pageable.class)))
                .thenReturn(defnsPage);
        ActivityDefnVersionDto dto = new ActivityDefnVersionDto();
        Mockito.when(mapper.map(Mockito.any(ActivityDefnVersion.class),eq(ActivityDefnVersionDto.class)))
                .thenReturn(dto);
        ActivityVersionDefnPaginationResp resp = activityVersionService
                .getAllVersionDefinitionList(sponsorContext, activityDefnKey,
                        applicationDescription, isDefault, pageNo, pageSize,
                        sortBy, sortDir, status);
//        assertEquals(2, resp.getContent().size());
        assertNotNull(resp);
    }

    private ActivityDefnVersion getVersion() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setEncryptionKey("123");
        return v1;
    }
    private List<ActivityDefnVersion> getVersionList() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setEncryptionKey("123");

        ActivityDefnVersion v2 = new ActivityDefnVersion();
        v2.setVersion(2.0);
        v2.setStatus("DRAFT");
        v2.setIsEncrypted(false);
        v2.setIsDefault(false);
        v2.setEncryptionKey("123");
        return Arrays.asList(v1,v2);
    }

    @Test
    void testGetAllVersionDefinitionById() throws Exception {
        Mockito.when(sponsorRepo.getSponsorKey(Mockito.anyString())).thenReturn("cashbank");
        Mockito.when(activityDefnVersionRepo.findByActivityDefnKeyAndActivityDefnKeyVersionAndActivityDefnSponsorKey(Mockito.anyString(), Mockito.anyString(),Mockito.anyString()))
                .thenReturn(getVersion());
        ActivityDefnVersionListResp dto = activityVersionService.getVersionDefinitionById("test", "test", "test");
        assertNotNull(dto);
    }
    @Test
    void testPostCreateActivityDefnVersion() throws SQLException, IOException, OnlyOneDraftVersionException, ResourceNotFoundException, ResourceNotFoundException {
        ActivityDefnServiceImplTest activityDefnServiceImplTest = new ActivityDefnServiceImplTest();

        Optional<ActivityDefn> activityDefn = Optional.ofNullable(activityDefnServiceImplTest.getVchActivityDefnObj());
        ActivityDefnVersion activityDefnVersion = activityDefnServiceImplTest.getVCHActivityDefnVersionObj();
        ActivityDefnData activityDefnData = activityDefnServiceImplTest.getVchActivityDefnDataObj();
        activityDefn.get().setVersions(Arrays.asList(activityDefnVersion));
//        Mockito.when(req.getRequestURL()).thenReturn(new StringBuffer("http://localhost:9080/"));
        Mockito.when(sponsorRepo.getSponsorKey(Mockito.anyString())).thenReturn("cashbank");
        Mockito.when(activityDefnRepo.findById(Mockito.anyString())).thenReturn(activityDefn);
        Mockito.when(activityDefnDataRepo.save(Mockito.any())).thenReturn(activityDefnData);
        Mockito.when(activityDefnVersionRepo.save(Mockito.any())).thenReturn(activityDefnVersion);

        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());
        ActivityVersionReq activityVersionReq = new ActivityVersionReq();
        activityVersionReq.setIsEncrypted(true);
        activityVersionReq.setFile(file);
        activityVersionReq.setApplication(Application.PEM);
        ActivityDefnVersionResp resp = activityVersionService.createActivityDefnVersion("test", "test", activityVersionReq);
        assertNotNull(resp);
    }

    @Test
    void updateMarkAsFinal() throws Exception {
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();

        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        mockActivityDefnVersionSave(activityDefnVersion).thenReturn(activityDefnVersion);

        MarkAsFinalActivityDefinitionVersionResp dto = new MarkAsFinalActivityDefinitionVersionResp();
        Mockito.when(mapper.map(Mockito.any(ActivityDefnVersion.class),eq(MarkAsFinalActivityDefinitionVersionResp.class)))
                .thenReturn(dto);
        MarkAsFinalActivityDefinitionVersionResp resp = activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY);

        assertEquals(Status.FINAL.getStatus(),resp.getStatus());
        assertNotNull(resp.getModifyTs());
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersionNotFound(){
        Optional<ActivityDefnVersion> activityDefnVersion = Optional.empty();
        mockActivityDefnVersionFindById().thenReturn(activityDefnVersion);
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(),ACTIVITY_DEFINITION_VERSION_NOT_FOUND);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersion_AlreadyFinal(){
        ActivityDefnVersion activityDefnVersion = getVCHActivityDefnVersionObj();

        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_VERSION_IS_IN_FINAL_DELETE_STATUS);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersion_Deleted(){
        ActivityDefnVersion activityDefnVersion = getDeletedVCHActivityDefnVersionObj();

        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(),ACTIVITY_DEFINITION_VERSION_IS_IN_FINAL_DELETE_STATUS);
    }

    @Test
    void updateActivityDefinitionVersion() throws Exception {
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        mockActivityDefnVersionSave(activityDefnVersion).thenReturn(activityDefnVersion);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        mockActivityDefnDataSave(activityDefnData).thenReturn(activityDefnData);

        MultipartFile file = getMultipartFile();
        MessageResp resp = activityVersionService.
                updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                        UpdateActivityVersionReq.builder().description(TEST_DESCRIPTION).file(file).isEncrypted(Boolean.TRUE).build());

        assertNotNull(resp);
        assertEquals(ACTIVITY_DEFINITION_VERSION_UPDATED,resp.getResponse());

    }

    @Test
    void updateActivityDefinitionVersion_PartialRequest() throws Exception {
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        mockActivityDefnVersionSave(activityDefnVersion).thenReturn(activityDefnVersion);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        mockActivityDefnDataSave(activityDefnData).thenReturn(activityDefnData);

        MultipartFile file = getMultipartFile();
        MessageResp resp = activityVersionService.
                updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                        UpdateActivityVersionReq.builder().file(file).build());

        assertNotNull(resp);
        assertEquals(ACTIVITY_DEFINITION_VERSION_UPDATED,resp.getResponse());

    }

    @Test
    void updateActivityDefinitionVersion_ActivityDefnVersionNotFound() throws Exception {

        MultipartFile multipartFile = getMultipartFile();

        Optional<ActivityDefnVersion> activityDefnVersion = Optional.empty();
        mockActivityDefnVersionFindById().thenReturn(activityDefnVersion);

        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionService.
                    updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                            UpdateActivityVersionReq.builder().description(TEST_DESCRIPTION).file(multipartFile).isEncrypted(Boolean.TRUE).build());
        });
        assertEquals(ACTIVITY_DEFINITION_VERSION_NOT_FOUND,exception.getMessage());

    }


    @Test
    void updateActivityDefinitionVersion_ActivityDefnDataNotFound() throws Exception {

        MultipartFile multipartFile = getMultipartFile();

        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));


        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionService.
                    updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                            UpdateActivityVersionReq.builder().description(TEST_DESCRIPTION).file(multipartFile).isEncrypted(Boolean.TRUE).build());
        });
        assertEquals(ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND,exception.getMessage());

    }

    @Test
    void updateActivityDefinitionVersion_EmtpyRequest() throws Exception {

        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        Exception exception = assertThrows(Exception.class, () -> activityVersionService.
                updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                        UpdateActivityVersionReq.builder().build()));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_VERSION_REQUIRED_SINGLE_FIELD_TO_UPDATE);

    }

}
