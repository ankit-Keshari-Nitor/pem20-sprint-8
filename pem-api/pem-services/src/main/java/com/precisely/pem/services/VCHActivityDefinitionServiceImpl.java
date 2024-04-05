package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.VCHActivityDefinitionPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VCHActivityDefinitionServiceImpl implements VCHActivityDefinitionService {
    @Autowired
    private VCHSponsorRepo vchSponsorRepo;
    @Autowired
    private VCHActivityDefnRepo vchActivityDefnRepo;
    @Autowired
    private VCHActivityDefnDataRepo vchActivityDefnDataRepo;
    @Autowired
    private VCHActivityDefnVersionRepo vchActivityDefnVersionRepo;

    Logger logger = LoggerFactory.getLogger(VCHActivityDefinitionServiceImpl.class);

    @Override
    public VCHActivityDefinitionPaginationRes getAllDefinitionList(String sponsorContext, int pageNo, int pageSize, String sortBy, String sortDir) {
        VCHActivityDefinitionPaginationRes vchActivityDefinitionPaginationRes = new VCHActivityDefinitionPaginationRes();
        PaginationDto paginationDto = new PaginationDto();


        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        String sponsorKey = vchSponsorRepo.getSponsorKey(sponsorContext);

        Page<VCHActivityDefn> defnsPage = vchActivityDefnRepo.findAllBySponsorKey(sponsorKey, pageable);

        List<VCHActivityDefn> listOfDefns = defnsPage.getContent();
        List<VCHActivityDefnDto> defnContent = listOfDefns.stream()
                .map(this::mapToDTO).collect(Collectors.toList());
        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int numberOfElements = defnsPage.getNumberOfElements();
        int size = defnsPage.getSize();
        boolean isLast = defnsPage.isLast();
        boolean isFirst = defnsPage.isFirst();

        paginationDto.setPageNo(pageNo);
        paginationDto.setFirst(isFirst);
        paginationDto.setLast(isLast);
        paginationDto.setPageSize(size);
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
    public VCHCreateActivityDefinitionResp createActivityDefinition(String sponsorContext, String name, String description, MultipartFile file, String app) throws IOException, SQLException {
        VCHCreateActivityDefinitionResp vchCreateActivityDefinitionResp = new VCHCreateActivityDefinitionResp();
        VCHActivityDefn vchActivityDefn = new VCHActivityDefn();
        VCHActivityDefnData vchActivityDefnData = new VCHActivityDefnData();
        VCHActivityDefnVersion vchActivityDefnVersion = new VCHActivityDefnVersion();

        logger.info("sponsorkey : " + vchSponsorRepo.getSponsorKey(sponsorContext));

        //Populating the Activity Definition Object
        vchActivityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        vchActivityDefn.setSponsorKey(vchSponsorRepo.getSponsorKey(sponsorContext));//This data is populated from VCH_SPONSOR table.
        vchActivityDefn.setActivityName(name);
        vchActivityDefn.setActivityDescription(description);
        vchActivityDefn.setApplication(app);
        vchActivityDefn.setDeleted(false);
        vchActivityDefn.setCreatedBy("");//Not sure from where we have to populate this value
        vchActivityDefn.setCreateTs(LocalDateTime.now());
        vchActivityDefn.setModifiedBy("");//Not sure from where we have to populate this value
        vchActivityDefn.setModifyTs(LocalDateTime.now());

        vchActivityDefn = vchActivityDefnRepo.save(vchActivityDefn);

        byte[] bytes = file.getBytes();
        Blob blob = new SerialBlob(bytes);

        vchActivityDefnData.setActivityDefnDataKey(UUID.randomUUID().toString());
        vchActivityDefnData.setCreateTs(LocalDateTime.now());
        vchActivityDefnData.setCreatedBy("");
        vchActivityDefnData.setModifyTs(LocalDateTime.now());
        vchActivityDefnData.setModifiedBy("");
        vchActivityDefnData.setDefData(blob);

        vchActivityDefnData = vchActivityDefnDataRepo.save(vchActivityDefnData);

        // Get the file name
        String fileName = file.getOriginalFilename();

        logger.info("filename : " + fileName);

        vchActivityDefnVersion.setActivityDefnKeyVersion(UUID.randomUUID().toString());
        vchActivityDefnVersion.setActivityDefnKey(vchActivityDefn.getActivityDefnKey());
        vchActivityDefnVersion.setActivityDefnDataKey(vchActivityDefnData.getActivityDefnDataKey());
        vchActivityDefnVersion.setDefault(false);
        vchActivityDefnVersion.setEncrypted(false);
        vchActivityDefnVersion.setEncryptionKey("");
        vchActivityDefnVersion.setStatus(String.valueOf(ActivityDefnStatus.DRAFT));
        vchActivityDefnVersion.setVersion("");
        vchActivityDefnVersion.setCreateTs(LocalDateTime.now());
        vchActivityDefnVersion.setCreatedBy("");
        vchActivityDefnVersion.setModifyTs(LocalDateTime.now());
        vchActivityDefnVersion.setModifiedBy("");

        vchActivityDefnVersion = vchActivityDefnVersionRepo.save(vchActivityDefnVersion);

        Link location = Link.of("/sponsors/"+sponsorContext+
                "/v2/activityDefinitions/"+ vchActivityDefn.getActivityDefnKey());

        logger.info("location : " + location.getHref());

        vchCreateActivityDefinitionResp.setActivityDefnKey(vchActivityDefn.getActivityDefnKey());
        vchCreateActivityDefinitionResp.setActivityDefnVersionKey(vchActivityDefnVersion.getActivityDefnKeyVersion());
        vchCreateActivityDefinitionResp.setLocation(location.getHref());

        return vchCreateActivityDefinitionResp;
    }

    @Override
    public VCHActivityDefnDto getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {

        String SponsorKey = vchSponsorRepo.getSponsorKey(sponsorContext);
        Optional<VCHActivityDefn> result =  vchActivityDefnRepo.findAllByActivityDefnKeyAndSponsorKey(activityDefnKey, SponsorKey);;
        if(result.isEmpty()){
            throw  new Exception("ActivityDefn not found" );
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), VCHActivityDefnDto.class);
    }
}
