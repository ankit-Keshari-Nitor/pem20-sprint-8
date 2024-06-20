package com.precisely.pem.services;

import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.UpdateActivityReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.*;
import com.precisely.pem.exceptionhandler.*;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.BpmnConvertService;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
    import com.precisely.pem.commonUtil.ApplicationConstants;
    import com.precisely.pem.commonUtil.Status;
    import com.precisely.pem.dtos.BpmnConverterRequest;
    import com.precisely.pem.dtos.requests.ActivityDefnReq;
    import com.precisely.pem.dtos.requests.UpdateActivityReq;
    import com.precisely.pem.dtos.responses.*;
    import com.precisely.pem.dtos.shared.*;
    import com.precisely.pem.exceptionhandler.*;
    import com.precisely.pem.models.ActivityDefn;
    import com.precisely.pem.models.ActivityDefnData;
    import com.precisely.pem.models.ActivityDefnVersion;
    import com.precisely.pem.repositories.*;
    import com.precisely.pem.service.BpmnConvertService;
    import lombok.extern.log4j.Log4j2;
    import org.modelmapper.ModelMapper;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Log4j2
@Service
public class ActivityDefnServiceImpl implements ActivityDefnService {
    @Autowired
    private SponsorRepo sponsorRepo;
    @Autowired
    private ActivityDefnRepo activityDefnRepo;
    @Autowired
    private ActivityDefnDataRepo activityDefnDataRepo;
    @Autowired
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private ActivityDefinitionVersionCustomRepo activityDefinitionVersionCustomRepo;
    @Autowired
    private BpmnConvertService bpmnConvertService;

    @Override
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext, String name,
                                                          String description, String application, List<String> status,
                                                          int pageNo, int pageSize, String sortBy, String sortDir) throws Exception {
        ActivityDefnPaginationRes vchActivityDefinitionPaginationRes = new ActivityDefnPaginationRes();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Page<ActivityDefn> defnsPage = null;
//        List<String> validStatuses = StatusEnumValidator.validateStatuses(status);
        status = getStatusListOfString(status);

        if (name != null && !name.isEmpty() && name.contains("con:") && description != null && !description.isEmpty()) {
            //This is for partial match for name and description with multiple status
            String conName = name.replace("con:", "");
            System.out.println("conName=" + conName);
            defnsPage = activityDefnRepo.findBySponsorKeyAndActivityNameContainingAndActivityDescriptionContainingAndApplicationAndVersionsStatusIn(sponsorInfo.getSponsorKey(),
                    conName, description, application, status, pageable);
        } else if (name != null && !name.isEmpty() && !name.contains("con:") && description != null && !description.isEmpty()) {
            //This is for exact name and partial description match with multiple status
            defnsPage = activityDefnRepo.findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatusIn(sponsorInfo.getSponsorKey(),
                    name, description, application, status, pageable);
        } else if (name != null && !name.isEmpty() && name.contains("con:")) {
            //This is for partial name match with multiple status
            String conName = name.replace("con:", "");
            System.out.println("conName=" + conName);
            defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusInAndActivityNameContaining(sponsorInfo.getSponsorKey(),
                    application, status, conName, pageable);
        } else if (name != null && !name.isEmpty() && !name.contains("con:")) {
            //This is for exact name match with multiple status
            defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusInAndActivityName(sponsorInfo.getSponsorKey(),
                    application, status, name, pageable);
        } else if (description != null && !description.isEmpty()) {
            //This is for partial description match with multiple status
            defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusInAndActivityDescriptionContaining(sponsorInfo.getSponsorKey(),
                    application, status, description, pageable);
        } else {
            //This is for matches based on multiple status
            defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusIn(sponsorInfo.getSponsorKey(),
                    application, status, pageable);
        }

        if (defnsPage == null || defnsPage.isEmpty()) {
            throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
        }

        List<ActivityDefn> listOfDefns = defnsPage.getContent();
        List<ActivityDefnListResp> defnContent = new ArrayList<>();

        defnContent = listOfDefns.stream()
                .map(p -> {
                    List<ActivityDefnVersion> versionList = p.getVersions();
                    ActivityDefnVersionListResp activityDefnVersionResp = new ActivityDefnVersionListResp();
                    if (versionList != null && !versionList.isEmpty()) {
                        activityDefnVersionResp = mapper.map(versionList.stream().filter(ActivityDefnVersion::getIsDefault).findAny().get(), ActivityDefnVersionListResp.class);
                    }
                    ActivityDefnListResp activityDefnListResp = mapper.map(p, ActivityDefnListResp.class);
                    activityDefnListResp.setVersions(activityDefnVersionResp);
                    return activityDefnListResp;
                }).collect(Collectors.toList());

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int size = defnsPage.getSize();

        paginationDto.setNumber(pageNo);
        paginationDto.setSize(size);
        paginationDto.setTotalPages(totalPage);
        paginationDto.setTotalElements(totalElements);

        vchActivityDefinitionPaginationRes.setContent(defnContent);
        vchActivityDefinitionPaginationRes.setPageContent(paginationDto);

        return vchActivityDefinitionPaginationRes;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException, DuplicateEntryException, ResourceNotFoundException, BpmnConverterException {
        ActivityDefnResp activityDefnResp = new ActivityDefnResp();
        ActivityDefn activityDefnobj = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        ModelMapper mapper = new ModelMapper();

        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

        Optional<ActivityDefn> duplicateEntry = Optional.ofNullable(activityDefnRepo.findByActivityName(activityDefnReq.getName()));
        if (duplicateEntry.isPresent()) {
            throw new DuplicateEntryException("name;DuplicateEntry;Entry already exists in database for name '" + duplicateEntry.get().getActivityName() + "'");
        }

        //Populating the Activity Definition Object
        ActivityDefnDto activityDefnDto = new ActivityDefnDto(
                UUID.randomUUID().toString(), sponsorInfo.getSponsorKey(), activityDefnReq.getName(),
                activityDefnReq.getDescription(), LocalDateTime.now(), "", LocalDateTime.now(), "",
                activityDefnReq.getApplication().toString(), false, false, null);
        activityDefnobj = mapper.map(activityDefnDto, ActivityDefn.class);
        activityDefnobj = activityDefnRepo.save(activityDefnobj);


        Blob blob = bpmnConvertService.getBpmnConvertedBlob(activityDefnReq.getFile().getInputStream());

        ActivityDefnDataDto vchActivityDefnDataDto = new ActivityDefnDataDto(
                UUID.randomUUID().toString(), blob, LocalDateTime.now(),
                "", LocalDateTime.now(), ""
        );

        //Populating the Activity Definition Version Object
        activityDefnData = mapper.map(vchActivityDefnDataDto, ActivityDefnData.class);
        activityDefnData = activityDefnDataRepo.save(activityDefnData);

        ActivityDefnVersionDto activityDefnVersionDto = new ActivityDefnVersionDto(
                UUID.randomUUID().toString(), activityDefnobj.getActivityDefnKey(),
                activityDefnData.getActivityDefnDataKey(), ApplicationConstants.DEFAULT_VERSION,
                String.valueOf(Status.DRAFT), true, false,
                "", LocalDateTime.now(), "", LocalDateTime.now(),
                "", ApplicationConstants.SCHEMA_VERSION, activityDefnReq.getDescription());
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

            Blob blob = bpmnConvertService.getBpmnConvertedBlob(activityDefnReq.getFile().getInputStream(),
                    BpmnConverterRequest.builder()
                            .processId(activityDefnVersion.getActivityDefnKeyVersion())
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

            activityDefnResp.setActivityDefnKey(activityDefnobj.getActivityDefnKey());
            activityDefnResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnKeyVersion());

        return activityDefnResp;
    }

    @Override
    public ActivityDefnListResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<ActivityDefn> result = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, sponsorInfo.getSponsorKey()));
        ;
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), ActivityDefnListResp.class);
    }

    @Override
    public MessageResp updateActivityDefinitionByKey(String sponsorContext, String activityDefnKey, UpdateActivityReq updateActivityReq) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<ActivityDefn> activityDefn = activityDefnRepo.findById(activityDefnKey);
        if (activityDefn.isEmpty()) {
            throw new ResourceNotFoundException("activityDefnKey", "NoDataFound", "Activity Definition with key '" + activityDefnKey + "' not found. Kindly check the activityDefnKey.");
        }
        if (activityDefn.get().getIsDeleted()) {
            throw new AlreadyDeletedException("activityDefnKey", "AlreadyDeleted", "Cannot Update Activity Definition with key '" + activityDefnKey + "' which is already in Deleted state.");
        }
        if (updateActivityReq.getName().isEmpty() && updateActivityReq.getDescription().isEmpty()) {
            throw new ParamMissingException("", "InputParamNeeded", "Both Activity name & description cannot be empty, please provide atleast one input parameter for update");
        }
        if (!updateActivityReq.getDescription().isEmpty()) {
            activityDefn.get().setActivityDescription(updateActivityReq.getDescription());
        }
        if (!updateActivityReq.getName().isEmpty()) {
            activityDefn.get().setActivityName(updateActivityReq.getName());
        }
        activityDefnRepo.save(activityDefn.get());
        MessageResp messsageResp = MessageResp.builder().build();
        messsageResp.setResponse("Activity Name & Description Update successful");
        return messsageResp;

    }

    @Override
    public MessageResp deleteActivityDefinitionById(String sponsorContext, String activityDefnKey) throws Exception {
        validateSponsorContext(sponsorContext);
        String sponsorKey = TenantContext.getTenantContext().getSponsorKey();
        Optional<ActivityDefn> activityDefnOptional = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, sponsorKey));

        if (activityDefnOptional.isEmpty())
            throw new ResourceNotFoundException("activityDefnKey", "NoDataFound", "Activity Definition with key '" + activityDefnKey + "' not found. Kindly check the activityDefnKey.");

        if (activityDefnOptional.get().getIsDeleted()) {
            throw new AlreadyDeletedException("activityDefnKey", "AlreadyDeleted", "Activity Definition with key '" + activityDefnKey + "' is already in Deleted state.");
        }

        /*
        Conditions
            1.All Versions are in DRAFT, hard delete all Data from tables
            2.If any one Version apart from DRAFT present, Mark that status as DELETE and IS_DELETED in Activity Defn as TRUE and hard Delete all DRAFT Versions
         */
        //check count of Versions with Status other than DRAFT
        long count = activityDefnVersionRepo.countByActivityDefnKeyAndStatusNot(activityDefnOptional.get().getActivityDefnKey(), Status.DRAFT.getStatus());

        MessageResp response = MessageResp.builder().build();
        if (count == 0) {
            activityDefnRepo.deleteById(activityDefnKey);
            response.setResponse("Activity Definition Records Deleted Successfully");

        } else {
            //Update Non-Draft Version with Soft Delete
            int updated = activityDefinitionVersionCustomRepo.updateActivityDefinitionVersion(Status.DELETE, Status.DRAFT, activityDefnOptional.get().getActivityDefnKey());
            //Hard Delete Draft Version with Soft Delete
            int deleted = activityDefinitionVersionCustomRepo.deleteByActivityDefnKeyAndStatus(activityDefnOptional.get().getActivityDefnKey(), Status.DRAFT.getStatus());

            activityDefnOptional.get().setIsDeleted(Boolean.TRUE);
            activityDefnRepo.save(activityDefnOptional.get());

            response.setResponse("Activity Definition Records Deleted Successfully");
        }
        return response;
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if (Objects.isNull(sponsorInfo)) {
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        log.info("sponsorkey : " + sponsorInfo.getSponsorKey());
        return sponsorInfo;
    }

    private List<String> getStatusListOfString(List<String> status) {
        if (status == null || status.isEmpty()) {
            status = Stream.of(Status.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
        }
        log.info("Status selected : {}", status);
        return status;
    }
