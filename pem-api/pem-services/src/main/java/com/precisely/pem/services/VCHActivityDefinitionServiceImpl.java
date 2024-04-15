package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.CreateActivityDefinitionResp;
import com.precisely.pem.dtos.responses.GetActivitiyDefnByIdResp;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.ActivityDefnDataDto;
import com.precisely.pem.dtos.shared.ActivityDefnDto;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
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
public class VCHActivityDefinitionServiceImpl implements VCHActivityDefinitionService {
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

    Logger logger = LoggerFactory.getLogger(VCHActivityDefinitionServiceImpl.class);

    @Override
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
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
                context,application,applicationName,applicationDescription,pageable);//name,desc
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
        int numberOfElements = defnsPage.getNumberOfElements();
        int size = defnsPage.getSize();


        paginationDto.setNumber(numberOfElements);
        paginationDto.setSize(size);
        paginationDto.setTotalPages(totalPage);
        paginationDto.setTotalElements(totalElements);

        vchActivityDefinitionPaginationRes.setContent(defnContent);
        vchActivityDefinitionPaginationRes.setPageContent(paginationDto);

        return vchActivityDefinitionPaginationRes;
    }

    private ActivityDefnDto mapToDTO(ActivityDefn activityDefn){
        ModelMapper mapper = new ModelMapper();
        return mapper.map(activityDefn, ActivityDefnDto.class);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public CreateActivityDefinitionResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException {
        CreateActivityDefinitionResp vchCreateActivityDefinitionResp = new CreateActivityDefinitionResp();
        ActivityDefn activityDefn = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        ModelMapper mapper = new ModelMapper();

        logger.info("sponsorkey : " + sponsorRepo.getSponsorKey(sponsorContext));

        //Populating the Activity Definition Object
        ActivityDefnDto activityDefnDto = new ActivityDefnDto(
                UUID.randomUUID().toString(), sponsorRepo.getSponsorKey(sponsorContext), name,
                description, LocalDateTime.now(), "", LocalDateTime.now(), "",
                app, false, false,null);
        activityDefn = mapper.map(activityDefnDto, ActivityDefn.class);
        activityDefn = activityDefnRepo.save(activityDefn);

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
                UUID.randomUUID().toString(), activityDefn.getActivityDefnKey(),
                activityDefnData.getActivityDefnDataKey(), "0",
                String.valueOf(ActivityDefnStatus.DRAFT), true, false,
                "", LocalDateTime.now(), "", LocalDateTime.now(), ""
        );
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

        String url = urlInfo + builder.path("/sponsors/{sponsorContext}/v2/activityDefinitions").buildAndExpand(sponsorContext).toUriString() + "/" + activityDefn.getActivityDefnKey();

        logger.info("location : " + url);

        vchCreateActivityDefinitionResp.setActivityDefnKey(activityDefn.getActivityDefnKey());
        vchCreateActivityDefinitionResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnKeyVersion());
        vchCreateActivityDefinitionResp.setLocation(url);

        return vchCreateActivityDefinitionResp;
    }

    @Override
    public GetActivitiyDefnByIdResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {

        String SponsorKey = sponsorRepo.getSponsorKey(sponsorContext);
        Optional<ActivityDefn> result = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, SponsorKey));;
        if(result.isEmpty()){
            throw  new Exception("ActivityDefn not found" );
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), GetActivitiyDefnByIdResp.class);
    }
}
