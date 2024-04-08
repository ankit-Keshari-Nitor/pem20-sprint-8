package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.responses.VCHGetActivitiyDefnByIdResp;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.VCHActivityDefnDataDto;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import com.precisely.pem.dtos.shared.VCHActivityDefnVersionDto;
import com.precisely.pem.models.VCHActivityDefn;
import com.precisely.pem.models.VCHActivityDefnData;
import com.precisely.pem.models.VCHActivityDefnVersion;
import com.precisely.pem.repositories.VCHActivityDefnDataRepo;
import com.precisely.pem.repositories.VCHActivityDefnRepo;
import com.precisely.pem.repositories.VCHActivityDefnVersionRepo;
import com.precisely.pem.repositories.VCHSponsorRepo;
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
    private VCHSponsorRepo vchSponsorRepo;
    @Autowired
    private VCHActivityDefnRepo vchActivityDefnRepo;
    @Autowired
    private VCHActivityDefnDataRepo vchActivityDefnDataRepo;
    @Autowired
    private VCHActivityDefnVersionRepo vchActivityDefnVersionRepo;
    @Autowired
    private ModelMapper mapper;

    Logger logger = LoggerFactory.getLogger(VCHActivityDefinitionServiceImpl.class);

    @Override
    public VCHActivityDefnPaginationRes getAllDefinitionList(String sponsorContext,
                                                             String applicationName, String applicationDescription,
                                                             String status, String application,int pageNo, int pageSize, String sortBy,
                                                             String sortDir) {
        VCHActivityDefnPaginationRes vchActivityDefinitionPaginationRes = new VCHActivityDefnPaginationRes();
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        System.out.println(sort.get());
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        String context = vchSponsorRepo.getSponsorKey(sponsorContext);
        applicationName = (applicationName != null && !applicationName.isEmpty()) ? applicationName : "";
        applicationDescription = (applicationDescription != null && !applicationDescription.isEmpty()) ? applicationDescription : "";

        Page<VCHActivityDefn> defnsPage = vchActivityDefnRepo.findByStatusAndSponsorContextAndApplicationAndByNameAndDescription(status,
                context,application,applicationName,applicationDescription,pageable);//name,desc
        List<VCHActivityDefn> listOfDefns = defnsPage.getContent();
        List<VCHActivityDefnDto> defnContent = new ArrayList<>();

        defnContent = listOfDefns.stream()
                .map(p ->
                {
                    VCHActivityDefnDto dtoObj = mapper.map(p, VCHActivityDefnDto.class);
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

    private VCHActivityDefnDto mapToDTO(VCHActivityDefn vchActivityDefn){
        ModelMapper mapper = new ModelMapper();
        return mapper.map(vchActivityDefn, VCHActivityDefnDto.class);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public VCHCreateActivityDefinitionResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException {
        VCHCreateActivityDefinitionResp vchCreateActivityDefinitionResp = new VCHCreateActivityDefinitionResp();
        VCHActivityDefn vchActivityDefn = null;
        VCHActivityDefnData vchActivityDefnData = null;
        VCHActivityDefnVersion vchActivityDefnVersion = null;
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        ModelMapper mapper = new ModelMapper();

        logger.info("sponsorkey : " + vchSponsorRepo.getSponsorKey(sponsorContext));

        //Populating the Activity Definition Object
        VCHActivityDefnDto vchActivityDefnDto = new VCHActivityDefnDto(
                UUID.randomUUID().toString(), vchSponsorRepo.getSponsorKey(sponsorContext), name,
                description, LocalDateTime.now(), "", LocalDateTime.now(), "",
                app, false, false,null);
        vchActivityDefn = mapper.map(vchActivityDefnDto, VCHActivityDefn.class);
        vchActivityDefn = vchActivityDefnRepo.save(vchActivityDefn);

        //Populating the Activity Definition Data Object
        byte[] bytes = file.getBytes();
        Blob blob = new SerialBlob(bytes);

        VCHActivityDefnDataDto vchActivityDefnDataDto = new VCHActivityDefnDataDto(
                UUID.randomUUID().toString(), blob, LocalDateTime.now(),
                "", LocalDateTime.now(), ""
        );

        //Populating the Activity Definition Version Object
        vchActivityDefnData = mapper.map(vchActivityDefnDataDto, VCHActivityDefnData.class);
        vchActivityDefnData = vchActivityDefnDataRepo.save(vchActivityDefnData);

        VCHActivityDefnVersionDto vchActivityDefnVersionDto = new VCHActivityDefnVersionDto(
                UUID.randomUUID().toString(), vchActivityDefn.getActivityDefnKey(),
                vchActivityDefnData.getActivityDefnDataKey(), "",
                String.valueOf(ActivityDefnStatus.DRAFT), false, false,
                "", LocalDateTime.now(), "", LocalDateTime.now(), ""
        );
        vchActivityDefnVersion = mapper.map(vchActivityDefnVersionDto, VCHActivityDefnVersion.class);
        vchActivityDefnVersion = vchActivityDefnVersionRepo.save(vchActivityDefnVersion);

        String url = urlInfo + builder.path("/sponsors/{sponsorContext}/v2/activityDefinitions").buildAndExpand(sponsorContext).toUriString() + "/" +vchActivityDefn.getActivityDefnKey();

        logger.info("location : " + url);

        vchCreateActivityDefinitionResp.setActivityDefnKey(vchActivityDefn.getActivityDefnKey());
        vchCreateActivityDefinitionResp.setActivityDefnVersionKey(vchActivityDefnVersion.getActivityDefnKeyVersion());
        vchCreateActivityDefinitionResp.setLocation(url);

        return vchCreateActivityDefinitionResp;
    }

    @Override
    public VCHGetActivitiyDefnByIdResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {

        String SponsorKey = vchSponsorRepo.getSponsorKey(sponsorContext);
        Optional<VCHActivityDefn> result = Optional.ofNullable(vchActivityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, SponsorKey));;
        if(result.isEmpty()){
            throw  new Exception("ActivityDefn not found" );
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), VCHGetActivitiyDefnByIdResp.class);
    }
}
