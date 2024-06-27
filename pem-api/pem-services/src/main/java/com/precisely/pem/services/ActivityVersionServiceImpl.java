package com.precisely.pem.services;

import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.requests.UpdateActivityVersionReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.*;
import com.precisely.pem.exceptionhandler.*;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.BpmnConvertService;
import com.precisely.pem.service.PEMActivitiService;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ActivityVersionServiceImpl implements ActivityVersionService{
    @Autowired
    private SponsorRepo sponsorRepo;
    @Autowired
    private ActivityDefnRepo activityDefnRepo;
    @Autowired
    private ActivityDefnDataRepo activityDefnDataRepo;
    @Autowired
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Autowired
    PEMActivitiService pemActivitiService;
    @Autowired
    private ActivityDefnDeploymentCustomRepo activityDefnDeploymentCustomRepo;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private BpmnConvertService bpmnConvertService;

    @Override
    public ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, Boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir,String status) throws Exception {
        ActivityVersionDefnPaginationResp activityVersionDefnPaginationResp = new ActivityVersionDefnPaginationResp();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Page<ActivityDefnVersion> defnsPage = null;
        if(description != null && !description.isEmpty())
            defnsPage = activityDefnVersionRepo.findByActivityDefnKeyAndStatusAndActivityDefnSponsorKeyAndIsDefaultAndDescriptionContaining(activityDefnKey,status,sponsorInfo.getSponsorKey(),isDefault,description,pageable);
        else
            defnsPage = activityDefnVersionRepo.findByActivityDefnKeyAndStatusAndActivityDefnSponsorKeyAndIsDefault(activityDefnKey,status,sponsorInfo.getSponsorKey(),isDefault,pageable);

        if(defnsPage == null || defnsPage.isEmpty()) {
            throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
        }
        List<ActivityDefnVersion> listOfDefns = defnsPage.getContent();
        List<ActivityDefnVersionListResp> defnContent = new ArrayList<>();

        defnContent = listOfDefns.stream()
                .map(p -> mapper.map(p, ActivityDefnVersionListResp.class))
                .collect(Collectors.toList());

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int numberOfElements = defnsPage.getNumberOfElements();
        int size = defnsPage.getSize();


        paginationDto.setNumber(numberOfElements);
        paginationDto.setSize(size);
        paginationDto.setTotalPages(totalPage);
        paginationDto.setTotalElements(totalElements);

        activityVersionDefnPaginationResp.setContent(defnContent);
        activityVersionDefnPaginationResp.setPage(paginationDto);

        return activityVersionDefnPaginationResp;
    }

    @Override
    public ActivityDefnVersionListResp getVersionDefinitionById(String activityDefnKey, String sponsorContext, String activityDefnVersionKey) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<ActivityDefnVersion> result = Optional.ofNullable(activityDefnVersionRepo.findByActivityDefnKeyAndActivityDefnVersionKeyAndActivityDefnSponsorKey(activityDefnKey, activityDefnVersionKey,sponsorInfo.getSponsorKey()));
        if(result.isEmpty()){
            throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), ActivityDefnVersionListResp.class);
    }

    @Override
    public ActivityDefnVersionResp createActivityDefnVersion(String sponsorContext, String activityDefnKey,
                                                             ActivityVersionReq activityVersionReq) throws OnlyOneDraftVersionException, IOException, SQLException, ResourceNotFoundException, AlreadyDeletedException, BpmnConverterException {
        ActivityDefn activityDefn = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        ActivityDefnVersionResp activityDefnVersionResp = new ActivityDefnVersionResp();

        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

        activityDefn = activityDefnRepo.findByActivityDefnKey(activityDefnKey);

        if(!Objects.isNull(activityDefn)){
            if(activityDefn.getIsDeleted()){
                throw new AlreadyDeletedException("CannotCreateVersion","The activity definition is already deleted. Cannot create a version for activityDefnKey '" + activityDefnKey +"'");
            }
        } else {
            throw new ResourceNotFoundException("activityDefnKey", "NoDataFound", "Activity Definition with key '" + activityDefnKey + "' not found. Kindly check the activityDefnKey.");
        }

        double version = activityDefn.getVersions().size();
        List<ActivityDefnVersion> defnVersions = activityDefn.getVersions();
        if(defnVersions.stream().anyMatch(s -> s.getStatus().equalsIgnoreCase(Status.DRAFT.toString()))){
            throw new OnlyOneDraftVersionException("NA;OneDraftAllowed;A version with the 'Draft' status already exists for the activity definition key '" + activityDefnKey +"'. Please verify the version.");
        }

        log.info("count : " + activityDefn.getVersions().size());

        ActivityDefnVersionDto activityDefnVersionDto = new ActivityDefnVersionDto(
                UUID.randomUUID().toString(), activityDefnKey,
                null, ++version,
                Status.DRAFT.toString(), false, activityVersionReq.getIsEncrypted(),
                "", LocalDateTime.now(), "", LocalDateTime.now(),
                "", ApplicationConstants.SCHEMA_VERSION,activityVersionReq.getDescription()
        );
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

        Blob blob = bpmnConvertService.getBpmnConvertedBlob(activityVersionReq.getFile().getInputStream(), BpmnConverterRequest.builder()
                .processId(activityDefnVersion.getActivityDefnVersionKey())
                .build());

        ActivityDefnDataDto vchActivityDefnDataDto = new ActivityDefnDataDto(
                UUID.randomUUID().toString(), blob, LocalDateTime.now(),
                "", LocalDateTime.now(), ""
        );

        //Populating the Activity Definition Version Object
        activityDefnData = mapper.map(vchActivityDefnDataDto, ActivityDefnData.class);
        activityDefnData = activityDefnDataRepo.save(activityDefnData);

        //update ActivityDefnDataKey activity definition version
        activityDefnVersion.setActivityDefnDataKey(activityDefnData.getActivityDefnDataKey());
        activityDefnVersionRepo.save(activityDefnVersion);

        activityDefnVersionResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnVersionKey());
        activityDefnVersionResp.setActivityDefnKey(activityDefnKey);

        return activityDefnVersionResp;
    }

    @Override
    public MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception {
        Optional<ActivityDefnVersion> activityDefnVersion = activityDefnVersionRepo.findById(activityDefnVersionKey);
        if(activityDefnVersion.isEmpty())
            throw new ResourceNotFoundException("activityDefnVersionKey", "NoDataFound", "Activity Definition Version with key '" + activityDefnVersionKey + "' not found. Kindly check the activityDefnVersionKey.");

        if(activityDefnVersion.get().getStatus().equalsIgnoreCase(Status.FINAL.getStatus()) ||
                activityDefnVersion.get().getStatus().equalsIgnoreCase(Status.DELETE.getStatus())){
            throw new ResourceNotFoundException("NA", "InvalidVersionStatus","Activity Definition Version is in FINAL/DELETE status.");
        }
        activityDefnVersion.get().setStatus(String.valueOf(Status.FINAL));
        activityDefnVersion.get().setModifyTs(LocalDateTime.now());
        if(activityDefnVersion.get().getIsDefault()){
            deployDefaultADVersion(activityDefnVersionKey);
        }
        ActivityDefnVersion savedActivityDefnVersion =  activityDefnVersionRepo.save(activityDefnVersion.get());
        ModelMapper mapper = new ModelMapper();
        return mapper.map(savedActivityDefnVersion, MarkAsFinalActivityDefinitionVersionResp.class);
    }

    @Override
    public MessageResp updateActivityDefnVersion(String sponsorContext, String activityDefnKey, String activityDefnVersionKey, UpdateActivityVersionReq updateActivityVersionReq) throws Exception {

        validateUpdateActivityDefnReq(updateActivityVersionReq);

        Optional<ActivityDefnVersion> activityDefnVersion = activityDefnVersionRepo.findById(activityDefnVersionKey);
        if(activityDefnVersion.isEmpty())
            throw new ResourceNotFoundException("activityDefnVersionKey", "NoDataFound", "Activity Definition Version with key '" + activityDefnVersionKey + "' not found. Kindly check the activityDefnVersionKey.");

        String activityStatus = activityDefnVersion.get().getStatus();
        if(activityStatus.equalsIgnoreCase(Status.FINAL.toString()) || activityStatus.equalsIgnoreCase(Status.DELETE.getStatus()))
            throw new ResourceNotFoundException("InvalidVersionStatus","Activity Definition Version is in FINAL/DELETE status.");


        Optional<ActivityDefnData> activityDefnData = activityDefnDataRepo.findById(activityDefnVersion.get().getActivityDefnDataKey());
        if(activityDefnData.isEmpty())
            throw new ResourceNotFoundException("activityDefnData", "NoDataFound","Activity Definition Version Data with key '" + activityDefnVersion.get().getActivityDefnDataKey() + "' not found. Kindly check the activityDefnDataKey.");

        //Populating the Activity Definition Data Object
        if(Objects.nonNull(updateActivityVersionReq.getFile())){
            Blob blob = bpmnConvertService.getBpmnConvertedBlob(updateActivityVersionReq.getFile().getInputStream(), BpmnConverterRequest.builder()
                            .processId(activityDefnVersion.get().getActivityDefnVersionKey())
                            .build());

            activityDefnData.get().setDefData(blob);
            activityDefnData.get().setModifyTs(LocalDateTime.now());

            activityDefnDataRepo.save(activityDefnData.get());
        }


        if( Objects.nonNull(updateActivityVersionReq.getIsEncrypted()) )
            activityDefnVersion.get().setIsEncrypted(updateActivityVersionReq.getIsEncrypted());
        if(Objects.nonNull(updateActivityVersionReq.getDescription()))
            activityDefnVersion.get().setDescription(updateActivityVersionReq.getDescription());

        activityDefnVersion.get().setModifyTs(LocalDateTime.now());
        activityDefnVersionRepo.save(activityDefnVersion.get());


        return MessageResp.builder().response("Activity Definition Version Updated.").build();
    }

    @Override
    public MarkAsFinalActivityDefinitionVersionResp markAsDefaultActivityDefinitionVersion(String sponsorContext, String activityDefnKey,String activityDefnVersionKey) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<ActivityDefnVersion> versionObj = activityDefnVersionRepo.findById(activityDefnVersionKey);

        if(versionObj.isEmpty())
            throw new ResourceNotFoundException("NoDataFound","No data was found for the provided query parameter combination.");

        if(!versionObj.get().getStatus().equalsIgnoreCase(Status.FINAL.getStatus()))
            throw new ResourceNotFoundException("InvalidVersionStatus","Version Status is DRAFT/DELETE.Hence can not mark it to Default.");

        if(versionObj.get().getIsDefault())
            throw new ResourceNotFoundException("AlreadyMarkedAsDefault","Version is already marked as Default.");

        ActivityDefnVersion version =versionObj.get();
        version.setIsDefault(true);

        List<ActivityDefnVersion> finalVersionList = activityDefnVersionRepo
                .findByActivityDefnKeyAndStatusAndActivityDefnSponsorKey(activityDefnKey,Status.FINAL.getStatus(),
                        sponsorInfo.getSponsorKey());
        if(finalVersionList.size() > 1) {
            Optional<ActivityDefnVersion> currentFinalVersionObj = finalVersionList
                    .stream()
                    .filter(p -> p.getIsDefault() && !p.getActivityDefnVersionKey().equalsIgnoreCase(activityDefnVersionKey))
                    .findAny();
            ActivityDefnVersion currentFinalVersion = null;
            if (currentFinalVersionObj.isPresent()) {
                currentFinalVersion = currentFinalVersionObj.get();
                currentFinalVersion.setIsDefault(false);
                activityDefnVersionRepo.save(currentFinalVersion);
            }
        }
        version = activityDefnVersionRepo.save(version);
        deployDefaultADVersion(version.getActivityDefnVersionKey());
        return new MarkAsFinalActivityDefinitionVersionResp("Success",LocalDateTime.now().toString());
    }

    @Override
    public ActivityDataResponse getActivityDataForSpecificVersion(String sponsorContext, String activityDefnKey, String activityDefnVersionKey) throws Exception{
        Optional<ActivityDefnVersion> activityDefnVersion = activityDefnVersionRepo.findById(activityDefnVersionKey);
        if(activityDefnVersion.isEmpty())
            throw new ResourceNotFoundException("activityDefnVersionKey", "NoDataFound", "Activity Definition Version with key '" + activityDefnVersionKey + "' not found. Kindly check the activityDefnVersionKey.");

        Optional<ActivityDefnData> activityDefnData = activityDefnDataRepo.findById(activityDefnVersion.get().getActivityDefnDataKey());
        if(activityDefnData.isEmpty())
            throw new ResourceNotFoundException("activityDefnData", "NoDataFound","Activity Definition Version Data with key '" + activityDefnVersion.get().getActivityDefnDataKey() + "' not found. Kindly check the activityDefnDataKey.");

        InputStreamResource resource = bpmnConvertService.getPemBpmnJsonData(activityDefnData.get().getDefData());

        return ActivityDataResponse
                .builder()
                .streamResource(resource)
                .fileName(activityDefnVersion.get().getActivityDefnDataKey()+".json")
                .build();
    }

    public void deployDefaultADVersion(String activityDefnVersionKey) throws SQLException, ResourceNotFoundException {
        log.info("Starting the deployment process for {}",activityDefnVersionKey);
        List<Object[]> dtoList = activityDefnDeploymentCustomRepo.findActivitiesByActivityDefnVersionKey(activityDefnVersionKey);
        if(Objects.isNull(dtoList) || dtoList.isEmpty()){
            throw new ResourceNotFoundException("ActivitiesNotFound", "Could not find the activities for version key " + activityDefnVersionKey);
        }
        ActivityDeploymentDto activityDeploymentDto = null;
        if(dtoList != null) {
            log.info(dtoList.toString());
            for (Object[] dto : dtoList){
                activityDeploymentDto = new ActivityDeploymentDto((String)dto[0],(String)dto[1],(String)dto[2],(String)dto[3],(String)dto[4],(String)dto[5],(Double)dto[6],(Blob)dto[7]);
            }

            Blob blobData = activityDeploymentDto.getDefData();
            int blobLength = (int) blobData.length();
            byte[] byteArr = blobData.getBytes(1l, blobLength);
            String deploymentKey = pemActivitiService.deployProcessDefinition(activityDeploymentDto.getActivityName(), byteArr);
            log.info("deploymentKey : " + deploymentKey);
        }
        log.info("Deployment process completed for {}",activityDefnVersionKey);
    }

    private static void validateUpdateActivityDefnReq(UpdateActivityVersionReq updateActivityVersionReq) throws Exception {
        if(Objects.isNull(updateActivityVersionReq.getFile()) && Objects.isNull(updateActivityVersionReq.getDescription()) && Objects.isNull(updateActivityVersionReq.getIsEncrypted())){
            throw new ParamMissingException("","InputParamNeeded","Complete Request Body cannot be empty, please provide atleast one input parameter for update");
        }
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        log.info("sponsorkey : " + sponsorInfo.getSponsorKey());
        return sponsorInfo;
    }
}
