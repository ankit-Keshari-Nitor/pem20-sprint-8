package com.precisely.pem.services;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.UpdateActivityReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.MessageResp;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.ActivityDefnDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.DuplicateEntryException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.ActivityDefn;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;


class ActivityDefnServiceImplTest extends BaseServiceTest{

    @InjectMocks
    protected ActivityDefnServiceImpl activityDefinitionService;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
        }

    @Test
    void testGetAllDefinitionList() throws Exception {
        Page<ActivityDefn> page = new PageImpl<>(getListOfVchActivityDefnObj());
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        Mockito.when(activityDefnRepo.findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatus(
                eq(TEST_STATUS), eq(TEST_SPONSOR), eq(TEST_APPLICATION_KEY), eq(TEST_APPLICATION_NAME), eq(TEST_DESCRIPTION),
                Mockito.any(Pageable.class))).thenReturn(page);
        ActivityDefnDto dtoObj = new ActivityDefnDto();
        dtoObj.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        Mockito.when(mapper.map(Mockito.any(ActivityDefn.class), eq(ActivityDefnDto.class))).thenReturn(dtoObj);
//        assertNotNull(activityDefinitionService.getAllDefinitionList(
//                sponsorContext, applicationName, applicationDescription, status, application,
//                pageNo, pageSize, sortBy, sortDir));
    }


    @Test
    void testCreateActivityDefinition() throws SQLException, IOException, DuplicateEntryException, ResourceNotFoundException {
    mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        Mockito.when(activityDefnRepo.save(Mockito.any())).thenReturn(getVchActivityDefnObj());
        Mockito.when(activityDefnDataRepo.save(Mockito.any())).thenReturn(getVchActivityDefnDataObj());
        Mockito.when(activityDefnVersionRepo.save(Mockito.any())).thenReturn(getVCHActivityDefnVersionObj());
        MultipartFile file = new MockMultipartFile(TEST_FILE_KEY, TEST_FILE_VALUE, CONTENT_TYPE_TEXT, TEST_FILE_DATA.getBytes());

        ActivityDefnReq activityDefnReq = new ActivityDefnReq();
        activityDefnReq.setApplication(Application.PEM);
        activityDefnReq.setDescription(TEST_DESCRIPTION);
        activityDefnReq.setName(TEST_NAME);
        activityDefnReq.setFile(file);

        assertNotNull(activityDefinitionService.createActivityDefinition(TEST_SPONSOR,activityDefnReq));
    }

    @Test
    void testFindByActivityDefnKeyAndSponsorKey() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getVchActivityDefnObj());
        ActivityDefnListResp resp;
        resp = activityDefinitionService.getActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY);
        assertNotNull(resp);
    }

    @Test
    void updateActivityDefinition_NotFoundActivityDefinition() throws Exception {
        mockActivityDefnKey().thenReturn(Optional.empty() );

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.updateActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY, UpdateActivityReq.builder().name(TEST_NAME).description(TEST_DESCRIPTION).build()));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_NOT_FOUND);
    }

    @Test
    void updateActivityDefinition_AlreadyDeletedActivityDefinition() throws Exception {
        mockActivityDefnKey().thenReturn(Optional.ofNullable(getDeletedVchActivityDefnObj()));

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.updateActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY, UpdateActivityReq.builder().name(TEST_NAME).description(TEST_DESCRIPTION).build()));
        assertEquals(exception.getMessage(), ACTIVITY_DEFN_KEY_WHICH_IS_ALREADY_IN_DELETED_STATE);
    }

    @Test
    void updateActivityDefinition_Positive() throws Exception {
        mockActivityDefnKey().thenReturn(Optional.ofNullable(getVchActivityDefnObj()));

        MessageResp resp =  activityDefinitionService.updateActivityDefinitionByKey(TEST_SPONSOR,TEST_KEY, UpdateActivityReq.builder().name(TEST_NAME).description(TEST_DESCRIPTION).build());
        assertNotNull(resp);
    }

    @Test
    void deleteActivityDefinition_WithAllDraftVersions() throws Exception {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getVchActivityDefnObj());

        mockFindByActivityDefnKey().thenReturn(getAllDraftVersionList());

        MessageResp response = activityDefinitionService.deleteActivityDefinitionById(TEST_SPONSOR, TEST_KEY);
        assertNotNull(response);
    }

    @Test
    void deleteActivityDefinition_WithPartialDraftVersions() throws Exception {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getVchActivityDefnObj());

        mockFindByActivityDefnKey().thenReturn(getPartialDraftVersionList());

        MessageResp response = activityDefinitionService.deleteActivityDefinitionById(TEST_SPONSOR,TEST_KEY);
        assertNotNull(response);
    }

    @Test
    void deleteActivityDefinition_NotFoundActivityDefinition() throws Exception {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(null );

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.deleteActivityDefinitionById(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_NOT_FOUND);
    }

    @Test
    void deleteActivityDefinition_AlreadyDeletedActivityDefinition(){
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getDeletedVchActivityDefnObj() );

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.deleteActivityDefinitionById(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_ALREADY_DELETED);
    }

}