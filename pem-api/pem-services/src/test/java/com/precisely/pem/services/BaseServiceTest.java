package com.precisely.pem.services;

import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.SponsorRepo;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.stubbing.OngoingStubbing;
import org.modelmapper.ModelMapper;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public static final String TEST_ACTIVITY_DEFN_VERSION_KEY = "test_activity_defn_key";
    public static final String TEST_FILE_KEY = "file";
    public static final String TEST_FILE_VALUE = "test.txt";
    public static final String CONTENT_TYPE_TEXT = "text/plain";
    public static final String TEST_FILE_DATA = "This is a test file.";
    public static final String TEST_APPLICATION_NAME = "name";
    public static final String TEST_DESCRIPTION = "description";
    public static final String TEST_STATUS = "status";
    public static final String TEST_APPLICATION_KEY = "application";
    public static final String TEST_NAME = "test";

    //Response Messages
    public static final String ACTIVITY_DEFINITION_NOT_FOUND = "Activity Definition not found";
    public static final String ACTIVITY_DEFINITION_ALREADY_DELETED = "Activity Definition Already Deleted";
    public static final String ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND = "Activity Definition Version Data not found";
    public static final String ACTIVITY_DEFINITION_VERSION_NOT_FOUND = "Activity Definition Version not found";
    public static final String ACTIVITY_DEFINITION_VERSION_UPDATED = "Activity Definition Version Updated.";

    @Mock
    protected ActivityDefnRepo activityDefnRepo;
    @Mock
    protected SponsorRepo sponsorRepo;
    @Mock
    protected ActivityDefnDataRepo activityDefnDataRepo;
    @Mock
    protected ActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    protected ModelMapper mapper;
    @Mock
    protected UriComponentsBuilder uriBuilder;

    //Common Mock method initialization
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

}
