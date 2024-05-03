    package com.precisely.pem.services;

    import com.precisely.pem.commonUtil.ApplicationConstants;
    import com.precisely.pem.commonUtil.Status;
    import com.precisely.pem.dtos.requests.ActivityDefnReq;
    import com.precisely.pem.dtos.responses.ActivityDefnListResp;
    import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
    import com.precisely.pem.dtos.responses.ActivityDefnResp;
    import com.precisely.pem.dtos.shared.ActivityDefnDataDto;
    import com.precisely.pem.dtos.shared.ActivityDefnDto;
    import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
    import com.precisely.pem.dtos.shared.PaginationDto;
    import com.precisely.pem.exceptionhandler.ErrorResponseDto;
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
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.*;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.SponsorRepo;
import com.precisely.pem.util.ActivityDefnStatus;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

    import javax.sql.rowset.serial.SerialBlob;
    import java.io.IOException;
    import java.sql.Blob;
    import java.sql.SQLException;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.Optional;
    import java.util.UUID;
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
                                            String description, String application,String status,
                                            int pageNo,int pageSize,String sortBy, String sortDir) throws Exception {
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
                errorDto.setErrorDescription("No Data Found");
                throw new Exception("No entries found for the combination");
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
        public ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException {
            ActivityDefnResp activityDefnResp = new ActivityDefnResp();
            ActivityDefn activityDefnobj = null;
            ActivityDefnData activityDefnData = null;
            ActivityDefnVersion activityDefnVersion = null;
            ModelMapper mapper = new ModelMapper();

            log.info("sponsorkey : " + sponsorRepo.getSponsorKey(sponsorContext));

            //Populating the Activity Definition Object
            ActivityDefnDto activityDefnDto = new ActivityDefnDto(
                    UUID.randomUUID().toString(), sponsorRepo.getSponsorKey(sponsorContext), activityDefnReq.getName(),
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
                errorDto.setErrorDescription("No data Found");
                errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
                throw new Exception("No entries found for the combination");
            }
            ModelMapper mapper = new ModelMapper();
            return mapper.map(result.get(), ActivityDefnListResp.class);
        }
    }
        String SponsorKey = sponsorRepo.getSponsorKey(sponsorContext);
        Optional<ActivityDefn> result = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, SponsorKey));;
        if(result.isEmpty()){
            ErrorResponseDto errorDto = new ErrorResponseDto();
            errorDto.setErrorDescription("No data Found");
            errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
            return new ResponseEntity<>(errorDto,HttpStatus.NOT_FOUND);
        }
        ModelMapper mapper = new ModelMapper();
        return ResponseEntity.ok().body(mapper.map(result.get(), ActivityDefnDto.class));
    }

    @Override
    public DeleteActivityDefinition deleteActivityDefinitionById(String sponsorContext, String activityDefnKey) throws Exception {
        String sponsorKey = TenantContext.getTenantContext().getSponsorKey();
        Optional<ActivityDefn> activityDefnOptional = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, sponsorKey));;
        if(activityDefnOptional.isEmpty()){
            throw  new Exception("Activity Definition not found" );
        }
        if(activityDefnOptional.get().isDeleted()){
            throw  new Exception("Activity Definition Already Deleted" );
        }

        /*
        Conditions
            1.All Versions are in DRAFT, hard delete all Data from tables
            2.If any one Version apart from DRAFT present, Mark that status as DELETE and IS_DELETED in Activity Defn as TRUE and hard Delete all DRAFT Versions
         */
        List<ActivityDefnVersion> activityDefnVersions = activityDefnVersionRepo.findByActivityDefnKey(activityDefnOptional.get().getActivityDefnKey());

        //check count of Versions with Status other than DRAFT
        long count = activityDefnVersions.stream().filter(activityDefnVersion -> !activityDefnVersion.getStatus().equalsIgnoreCase(Status.DRAFT.toString())).count();

        DeleteActivityDefinition response = DeleteActivityDefinition.builder().totalActivityVersions(activityDefnVersions.size()).build();
        if(count == 0 ){
            response.setActivityVersionsSoftDeleted(0);
            response.setActivityVersionsHardDeleted(activityDefnVersions.size());
            activityDefnRepo.deleteById(activityDefnKey);

        }else {
            //find Non-Draft Version and Update those with Soft Delete
            List<ActivityDefnVersion> nonDraftActivityDefnVersions = activityDefnVersions.stream()
                    .filter(activityDefnVersion -> !activityDefnVersion.getStatus().equalsIgnoreCase(Status.DRAFT.toString()))
                    .peek(activityDefnVersion -> activityDefnVersion.setStatus(Status.DELETE.getStatus())).toList();

            List<String> draftActivityDefnVersions = activityDefnVersions.stream()
                    .filter(activityDefnVersion -> activityDefnVersion.getStatus().equalsIgnoreCase(Status.DRAFT.toString()))
                    .map(ActivityDefnVersion::getActivityDefnKeyVersion)
                    .toList();
            activityDefnVersionRepo.deleteByKeys(draftActivityDefnVersions);

            activityDefnVersionRepo.saveAll(nonDraftActivityDefnVersions);

            activityDefnOptional.get().setDeleted(Boolean.TRUE);
            activityDefnRepo.save(activityDefnOptional.get());

            response.setActivityVersionsSoftDeleted(nonDraftActivityDefnVersions.size());
            response.setActivityVersionsHardDeleted(draftActivityDefnVersions.size());
        }
        return response;
    }
}
