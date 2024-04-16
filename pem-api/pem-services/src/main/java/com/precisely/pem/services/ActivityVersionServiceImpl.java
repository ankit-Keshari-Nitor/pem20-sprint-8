package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.shared.ActivityDefnDataDto;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.SponsorRepo;
import com.precisely.pem.util.ActivityDefnStatus;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActivityVersionServiceImpl implements ActivityVersionService{
    Logger logger = LoggerFactory.getLogger(ActivityVersionServiceImpl.class);
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
    public ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir,String status) {
        ActivityVersionDefnPaginationResp activityVersionDefnPaginationResp = new ActivityVersionDefnPaginationResp();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        System.out.println(sort.get());
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        String context = sponsorRepo.getSponsorKey(sponsorContext);
        description = (description != null && !description.isEmpty()) ? description : "";

        Page<ActivityDefnVersion> defnsPage = activityDefnVersionRepo.findVersionList(context,description,activityDefnKey,status,pageable);
        List<ActivityDefnVersion> listOfDefns = defnsPage.getContent();
        List<ActivityDefnVersionDto> defnContent = new ArrayList<>();

        defnContent = listOfDefns.stream()
                .map(p -> mapper.map(p, ActivityDefnVersionDto.class))
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
    public ActivityDefnVersionDto getVersionDefinitionById(String activityDefnKey, String sponsorContext, String versionId) throws Exception {
        String SponsorKey = sponsorRepo.getSponsorKey(sponsorContext);
        Optional<ActivityDefnVersion> result = Optional.ofNullable(activityDefnVersionRepo.findVersion(activityDefnKey, SponsorKey,versionId));
        if(result.isEmpty()){
            throw  new Exception("ActivityDefn not found" );
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), ActivityDefnVersionDto.class);
    }

    @Override
    public ResponseEntity<Object> createActivityDefnVersion(String sponsorContext, String activityDefnKey,
                                                            MultipartFile file, boolean isEncrypted,
                                                            boolean isDefault, String status,
                                                            HttpServletRequest request) throws SQLException, IOException {
        Optional<ActivityDefn> activityDefn = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        ActivityDefnVersionResp activityDefnVersionResp = new ActivityDefnVersionResp();

        activityDefn = activityDefnRepo.findById(activityDefnKey);

        activityDefn.get().getVersions().stream().count();

        logger.info("count : " + (long) activityDefn.get().getVersions().size());

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
                UUID.randomUUID().toString(), activityDefnKey,
                activityDefnData.getActivityDefnDataKey(), 0,
                status, isDefault, isEncrypted,
                "", LocalDateTime.now(), "", LocalDateTime.now(), ""
        );
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

        String url = request.getRequestURL().toString() + "/" + activityDefnVersion.getActivityDefnKeyVersion();

        logger.info("location : " + request.getRequestURL().toString());

        //activityDefnVersionResp.setVersion();
        activityDefnVersionResp.setName(activityDefn.get().getActivityName());
        activityDefnVersionResp.setLocation(url);

        return new ResponseEntity<>(activityDefnVersionResp, HttpStatus.CREATED);
    }
}
