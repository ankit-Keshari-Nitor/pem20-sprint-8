package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.GetActivityDefnByIdResp;
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

@Service
public class ActivityDefnServiceImpl implements ActivityDefnService {
    @Value("${pem.openapi.dev-url}")
    private String urlInfo;

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

    Logger logger = LoggerFactory.getLogger(ActivityDefnServiceImpl.class);

    @Override
    public ResponseEntity<Object> getAllDefinitionList(String sponsorContext,
                                                       String applicationName, String applicationDescription,
                                                       String status, String application, int pageNo, int pageSize, String sortBy,
                                                       String sortDir) {
        ActivityDefnPaginationRes vchActivityDefinitionPaginationRes = new ActivityDefnPaginationRes();
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        System.out.println(sort.get());
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        String context = sponsorRepo.getSponsorKey(sponsorContext);
        applicationName = (applicationName != null && !applicationName.isEmpty()) ? applicationName : "";
        applicationDescription = (applicationDescription != null && !applicationDescription.isEmpty()) ? applicationDescription : "";

        Page<ActivityDefn> defnsPage = activityDefnRepo.findByStatusAndSponsorContextAndApplicationAndByNameAndDescription(status,
                context,application,applicationName,applicationDescription,pageable);
        if(defnsPage != null && !defnsPage.isEmpty()) {
            List<ActivityDefn> listOfDefns = defnsPage.getContent();
            List<ActivityDefnDto> defnContent = new ArrayList<>();

            defnContent = listOfDefns.stream()
                    .map(p ->
                    {
                        ActivityDefnDto dtoObj = mapper.map(p, ActivityDefnDto.class);
                        Link location = Link.of("/sponsors/" + sponsorContext +
                                "/v2/activityDefinitions/" + dtoObj.getActivityDefnKey() + "/versions");
                        dtoObj.setActivityVersionLink(urlInfo + location.getHref());
                        return dtoObj;
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

            return ResponseEntity.ok().body(vchActivityDefinitionPaginationRes);
        }else{
            ErrorResponseDto errorDto = new ErrorResponseDto();
            errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
            errorDto.setErrorDescription("No Data Found");
            return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
        }
    }

    private ActivityDefnDto mapToDTO(ActivityDefn activityDefn){
        ModelMapper mapper = new ModelMapper();
        return mapper.map(activityDefn, ActivityDefnDto.class);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<Object> createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException {
        ActivityDefnResp activityDefnResp = new ActivityDefnResp();
        ActivityDefn activityDefnobj = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        ModelMapper mapper = new ModelMapper();

        logger.info("sponsorkey : " + sponsorRepo.getSponsorKey(sponsorContext));
        //TODO use like this and change Logger to log4j2: TenantContext.getTenantContext().getSponsorKey();

        //Populating the Activity Definition Object
        ActivityDefnDto activityDefnDto = new ActivityDefnDto(
                UUID.randomUUID().toString(), sponsorRepo.getSponsorKey(sponsorContext), name,
                description, LocalDateTime.now(), "", LocalDateTime.now(), "",
                app, false, false,null);
        activityDefnobj = mapper.map(activityDefnDto, ActivityDefn.class);
        activityDefnobj = activityDefnRepo.save(activityDefnobj);

        //Populating the Activity Definition Data Object
        byte[] bytes = file.getBytes();
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
                activityDefnData.getActivityDefnDataKey(), 1,
                String.valueOf(ActivityDefnStatus.DRAFT), true, false,
                "", LocalDateTime.now(), "", LocalDateTime.now(), ""
        );
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

        String url = urlInfo + builder.path("/sponsors/{sponsorContext}/v2/activityDefinitions").buildAndExpand(sponsorContext).toUriString() + "/" + activityDefnobj.getActivityDefnKey();

        logger.info("location : " + url);

        activityDefnResp.setActivityDefnKey(activityDefnobj.getActivityDefnKey());
        activityDefnResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnKeyVersion());
        activityDefnResp.setLocation(url);

        return new ResponseEntity<>(activityDefnResp,HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<Object> getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {

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
}
