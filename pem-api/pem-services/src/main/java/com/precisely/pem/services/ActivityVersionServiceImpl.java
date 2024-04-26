package com.precisely.pem.services;

import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityDefnDataDto;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.dtos.shared.ErrorResponseDto;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnDataRepo;
import com.precisely.pem.repositories.ActivityDefnRepo;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.SponsorRepo;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    public ActivityVersionDefnPaginationResp getAllVersionDefinitionList(String sponsorContext, String activityDefnKey, String description, boolean isDefault, int pageNo, int pageSize, String sortBy, String sortDir,String status) throws Exception {
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
        if(defnsPage == null || defnsPage.isEmpty()) {
            ErrorResponseDto errorDto = new ErrorResponseDto();
            errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
            errorDto.setErrorDescription("No Data Found");
            throw new Exception("No entries found for the combination");
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
    public ActivityDefnVersionListResp getVersionDefinitionById(String activityDefnKey, String sponsorContext, String activityDefnKeyVersion) throws Exception {
        String SponsorKey = sponsorRepo.getSponsorKey(sponsorContext);
        Optional<ActivityDefnVersion> result = Optional.ofNullable(activityDefnVersionRepo.findVersion(activityDefnKey, SponsorKey, activityDefnKeyVersion));
        if(result.isEmpty()){
            ErrorResponseDto errorDto = new ErrorResponseDto();
            errorDto.setErrorDescription("No data Found");
            errorDto.setErrorCode(HttpStatus.NOT_FOUND.value());
            throw new Exception("No entries found for the combination");
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), ActivityDefnVersionListResp.class);
    }

    @Override
    public ActivityDefnVersionResp createActivityDefnVersion(String sponsorContext, String activityDefnKey,
                                                            MultipartFile file, boolean isEncrypted, String app) throws OnlyOneDraftVersionException, IOException, SQLException {
        Optional<ActivityDefn> activityDefn = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        ActivityDefnVersionResp activityDefnVersionResp = new ActivityDefnVersionResp();

        activityDefn = activityDefnRepo.findById(activityDefnKey);

        double version = activityDefn.get().getVersions().size();
        List<ActivityDefnVersion> defnVersions = activityDefn.get().getVersions();
        if(defnVersions.stream().anyMatch(s -> s.getStatus().equalsIgnoreCase(Status.DRAFT.toString()))){
            throw new OnlyOneDraftVersionException("A version with Draft version already exists. Kindly verify the version");
        }

        logger.info("count : " + activityDefn.get().getVersions().size());

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
                activityDefnData.getActivityDefnDataKey(), ++version,
                Status.DRAFT.toString(), false, isEncrypted,
                "", LocalDateTime.now(), "", LocalDateTime.now(),
                "", ApplicationConstants.SCHEMA_VERSION
        );
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

        activityDefnVersionResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnKeyVersion());

        return activityDefnVersionResp;
    }

    @Override
    public MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception {
        Optional<ActivityDefnVersion> activityDefnVersion = activityDefnVersionRepo.findById(activityDefnVersionKey);
        if(activityDefnVersion.isEmpty()){
            throw  new Exception("Activity Definition Version not found" );
        }

        activityDefnVersion.get().setStatus(String.valueOf(Status.FINAL));
        activityDefnVersion.get().setModifyTs(LocalDateTime.now());
        ActivityDefnVersion savedActivityDefnVersion =  activityDefnVersionRepo.save(activityDefnVersion.get());
        ModelMapper mapper = new ModelMapper();
        return mapper.map(savedActivityDefnVersion, MarkAsFinalActivityDefinitionVersionResp.class);
    }
}
