    package com.precisely.pem.services;

    import com.precisely.pem.commonUtil.ApplicationConstants;
    import com.precisely.pem.commonUtil.Status;
    import com.precisely.pem.dtos.requests.ActivityDefnReq;
    import com.precisely.pem.dtos.responses.*;
    import com.precisely.pem.dtos.shared.*;
    import com.precisely.pem.exceptionhandler.DuplicateEntryException;
    import com.precisely.pem.exceptionhandler.ErrorResponseDto;
    import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
    import com.precisely.pem.exceptionhandler.SponsorNotFoundException;
    import com.precisely.pem.models.ActivityDefn;
    import com.precisely.pem.models.ActivityDefnData;
    import com.precisely.pem.models.ActivityDefnVersion;
    import com.precisely.pem.repositories.ActivityDefnDataRepo;
    import com.precisely.pem.repositories.ActivityDefnRepo;
    import com.precisely.pem.repositories.ActivityDefnVersionRepo;
    import com.precisely.pem.repositories.SponsorRepo;
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
            String context = sponsorRepo.getSponsorKey(sponsorContext);
            Page<ActivityDefn> defnsPage = null;
            if(name != null && !name.isEmpty() && name.contains("con:") && description != null && !description.isEmpty()) {
                String conName = name.replace("con:","");
                System.out.println("conName="+conName);
                defnsPage = activityDefnRepo.findBySponsorKeyAndActivityNameContainingAndActivityDescriptionContainingAndApplicationAndVersionsStatus(context,
                        conName, description, application, status, pageable);
            }else if(name != null && !name.isEmpty() && !name.contains("con:") && description != null && !description.isEmpty()) {
                defnsPage = activityDefnRepo.findBySponsorKeyAndActivityNameAndActivityDescriptionContainingAndApplicationAndVersionsStatus(context,
                        name, description, application, status, pageable);
            }else if(name != null && !name.isEmpty() && name.contains("con:")) {
                String conName = name.replace("con:","");
                System.out.println("conName="+conName);
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusAndActivityNameContaining(context,
                        application, status, conName, pageable);
            }else if(name != null && !name.isEmpty() && !name.contains("con:")) {
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusAndActivityName(context,
                        application, status, name, pageable);
            }else if(description != null && !description.isEmpty()) {
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatusAndActivityDescriptionContaining(context,
                        application, status, description, pageable);
            }else {
                defnsPage = activityDefnRepo.findBySponsorKeyAndApplicationAndVersionsStatus(context,
                        application, status, pageable);
            }
            if(defnsPage == null || defnsPage.isEmpty()) {
                ErrorResponseDto errorDto = new ErrorResponseDto();
                errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
                errorDto.setMessage("No Data Found");
                throw new ResourceNotFoundException("No data found for the combination.");
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
        public ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException, DuplicateEntryException, SponsorNotFoundException {
            ActivityDefnResp activityDefnResp = new ActivityDefnResp();
            ActivityDefn activityDefnobj = null;
            ActivityDefnData activityDefnData = null;
            ActivityDefnVersion activityDefnVersion = null;
            ModelMapper mapper = new ModelMapper();

            SponsorInfo sponsorInfo = TenantContext.getTenantContext();
            if(Objects.isNull(sponsorInfo)){
                throw new SponsorNotFoundException("Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
            }
            log.info("sponsorkey : " + sponsorInfo.getSponsorKey());

            Optional<ActivityDefn> duplicateEntry = Optional.ofNullable(activityDefnRepo.findByActivityName(activityDefnReq.getName()));
            if(!duplicateEntry.isEmpty()){
                throw new DuplicateEntryException("Entry already exists in database for name '"+duplicateEntry.get().getActivityName()+"'");
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

            String SponsorKey = sponsorRepo.getSponsorKey(sponsorContext);
            Optional<ActivityDefn> result = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, SponsorKey));;
            if(result.isEmpty()){
                ErrorResponseDto errorDto = new ErrorResponseDto();
                errorDto.setMessage("No data Found");
                errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
                throw new Exception("No entries found for the combination");
            }
            ModelMapper mapper = new ModelMapper();
            return mapper.map(result.get(), ActivityDefnListResp.class);
        }

        @Override
        @Transactional(rollbackFor = Exception.class)
        public MessageResp updateActivityDefinitionByKey(String sponsorContext, String name, String description, String activityDefnKey) throws Exception{
            String SponsorKey = sponsorRepo.getSponsorKey(sponsorContext);
            Optional<ActivityDefn> activityDefn = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, SponsorKey));
            if(activityDefn.isEmpty()){
                ErrorResponseDto errorDto = new ErrorResponseDto();
                errorDto.setMessage("No data Found");
                errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
                throw new Exception("No entries found for the combination");
            }
            activityDefn.get().setActivityName(name);
            activityDefn.get().setActivityDescription(description);
            ActivityDefn savedActivityDefn = activityDefnRepo.save(activityDefn.get());
            MessageResp messsageResp = new MessageResp();
            messsageResp.setResponse("Activity Name & Description Update successful");
            return messsageResp;

        }
    }
