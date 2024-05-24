    package com.precisely.pem.services;

    import com.precisely.pem.commonUtil.ApplicationConstants;
    import com.precisely.pem.commonUtil.Status;
    import com.precisely.pem.dtos.requests.ActivityDefnReq;
    import com.precisely.pem.dtos.requests.UpdateActivityReq;
    import com.precisely.pem.dtos.responses.*;
    import com.precisely.pem.dtos.shared.*;
    import com.precisely.pem.exceptionhandler.AlreadyDeletedException;
    import com.precisely.pem.exceptionhandler.DuplicateEntryException;
    import com.precisely.pem.exceptionhandler.ParamMissingException;
    import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
    import com.precisely.pem.models.ActivityDefn;
    import com.precisely.pem.models.ActivityDefnData;
    import com.precisely.pem.models.ActivityDefnVersion;
    import com.precisely.pem.repositories.*;
    import lombok.extern.log4j.Log4j2;
    import org.modelmapper.ModelMapper;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.http.HttpStatus;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import javax.sql.rowset.serial.SerialBlob;
    import java.io.IOException;
    import java.sql.Blob;
    import java.sql.SQLException;
    import java.time.LocalDateTime;
    import java.util.*;
    import java.util.stream.Collectors;

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

        @Override
        public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext, String name,
                                                              String description, String application, String status,
                                                              int pageNo, int pageSize, String sortBy, String sortDir) throws Exception {
            ActivityDefnPaginationRes vchActivityDefinitionPaginationRes = new ActivityDefnPaginationRes();
            PaginationDto paginationDto = new PaginationDto();
            Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                    Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
            SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
            Page<ActivityDefn> defnsPage = null;
            if(name != null && !name.isEmpty() && name.contains("con:") && description != null && !description.isEmpty()) {
                String conName = name.replace("con:","");
                System.out.println("conName="+conName);
                defnsPage = activityDefnRepo.findBySponsorKeyAndActivityNameContainingAndActivityDescriptionContainingAndApplicationAndVersionsStatus(sponsorInfo.getSponsorKey(),
                        conName, description, application, status, pageable);
            }else if(name != null && !name.isEmpty() && !name.contains("con:") && description != null && !description.isEmpty()) {
                defnsPage = activityDefnRepo.findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatus(sponsorInfo.getSponsorKey(),
                        name, description, application, status, pageable);
            }else if(name != null && !name.isEmpty() && name.contains("con:")) {
                String conName = name.replace("con:","");
                System.out.println("conName="+conName);
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusAndActivityNameContaining(sponsorInfo.getSponsorKey(),
                        application, status, conName, pageable);
            }else if(name != null && !name.isEmpty() && !name.contains("con:")) {
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusAndActivityName(sponsorInfo.getSponsorKey(),
                        application, status, name, pageable);
            }else if(description != null && !description.isEmpty()) {
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusAndActivityDescriptionContaining(sponsorInfo.getSponsorKey(),
                        application, status, description, pageable);
            }else {
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatus(sponsorInfo.getSponsorKey(),
                        application, status, pageable);
            }
            if(defnsPage == null || defnsPage.isEmpty()) {
                throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
            }
            List<ActivityDefn> listOfDefns = defnsPage.getContent();
            List<ActivityDefnListResp> defnContent = new ArrayList<>();

            defnContent = listOfDefns.stream()
                    .map(p ->
                    {
                        return mapper.map(p, ActivityDefnListResp.class);
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
        public ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException, DuplicateEntryException, ResourceNotFoundException {
            ActivityDefnResp activityDefnResp = new ActivityDefnResp();
            ActivityDefn activityDefnobj = null;
            ActivityDefnData activityDefnData = null;
            ActivityDefnVersion activityDefnVersion = null;
            ModelMapper mapper = new ModelMapper();

            SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

            Optional<ActivityDefn> duplicateEntry = Optional.ofNullable(activityDefnRepo.findByActivityName(activityDefnReq.getName()));
            if(!duplicateEntry.isEmpty()){
                throw new DuplicateEntryException("name;DuplicateEntry;Entry already exists in database for name '"+duplicateEntry.get().getActivityName()+"'");
            }

            //Populating the Activity Definition Object
            ActivityDefnDto activityDefnDto = new ActivityDefnDto(
                    UUID.randomUUID().toString(), sponsorInfo.getSponsorKey(), activityDefnReq.getName(),
                    activityDefnReq.getDescription(), LocalDateTime.now(), "", LocalDateTime.now(), "",
                    activityDefnReq.getApplication().toString(), false, false,null);
            activityDefnobj = mapper.map(activityDefnDto, ActivityDefn.class);
            activityDefnobj = activityDefnRepo.save(activityDefnobj);

            //Populating the Activity Definition Data Object
            byte[] bytes = activityDefnReq.getFile().getBytes();
            Blob blob = new SerialBlob(bytes);

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
                    "", ApplicationConstants.SCHEMA_VERSION,activityDefnReq.getDescription());
            activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
            activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

            activityDefnResp.setActivityDefnKey(activityDefnobj.getActivityDefnKey());
            activityDefnResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnKeyVersion());

            return activityDefnResp;
        }

        @Override
        public ActivityDefnListResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {
            SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
            Optional<ActivityDefn> result = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, sponsorInfo.getSponsorKey()));;
            if(result.isEmpty()){
                throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
            }
            ModelMapper mapper = new ModelMapper();
            return mapper.map(result.get(), ActivityDefnListResp.class);
        }

        @Override
        public MessageResp updateActivityDefinitionByKey(String sponsorContext, String activityDefnKey, UpdateActivityReq updateActivityReq) throws Exception {
            SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
            Optional<ActivityDefn> activityDefn = activityDefnRepo.findById(activityDefnKey);
            if(activityDefn.isEmpty()){
                throw new ResourceNotFoundException("activityDefnKey", "NoDataFound", "Activity Definition with key '" + activityDefnKey + "' not found. Kindly check the activityDefnKey.");
            }
            if (activityDefn.get().getIsDeleted()) {
                throw new AlreadyDeletedException("activityDefnKey","AlreadyDeleted","Cannot Update Activity Definition with key '" + activityDefnKey + "' which is already in Deleted state.");
            }
            if(updateActivityReq.getName().isEmpty() && updateActivityReq.getDescription().isEmpty()){
                throw new ParamMissingException("","InputParamNeeded","Both Activity name & description cannot be empty, please provide atleast one input parameter for update");
            }
            if(!updateActivityReq.getDescription().isEmpty()){
                activityDefn.get().setActivityDescription(updateActivityReq.getDescription());
            }
            if(!updateActivityReq.getName().isEmpty()){
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
                throw new AlreadyDeletedException("activityDefnKey","AlreadyDeleted","Activity Definition with key '" + activityDefnKey + "' is already in Deleted state.");
            }

        /*
        Conditions
            1.All Versions are in DRAFT, hard delete all Data from tables
            2.If any one Version apart from DRAFT present, Mark that status as DELETE and IS_DELETED in Activity Defn as TRUE and hard Delete all DRAFT Versions
         */
            //check count of Versions with Status other than DRAFT
            long count = activityDefnVersionRepo.countByActivityDefnKeyAndStatusNot(activityDefnOptional.get().getActivityDefnKey(),Status.DRAFT.getStatus());

            MessageResp response = MessageResp.builder().build();
            if (count == 0) {
                activityDefnRepo.deleteById(activityDefnKey);
                response.setResponse("Activity Definition Records Deleted Successfully");

            } else {
                //Update Non-Draft Version with Soft Delete
                int updated = activityDefinitionVersionCustomRepo.updateActivityDefinitionVersion(Status.DELETE,Status.DRAFT,activityDefnOptional.get().getActivityDefnKey());
                //Hard Delete Draft Version with Soft Delete
                int deleted = activityDefinitionVersionCustomRepo.deleteByActivityDefnKeyAndStatus(activityDefnOptional.get().getActivityDefnKey(),Status.DRAFT.getStatus());

                activityDefnOptional.get().setIsDeleted(Boolean.TRUE);
                activityDefnRepo.save(activityDefnOptional.get());

                response.setResponse("Activity Definition Records Deleted Successfully");
            }
            return response;
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
