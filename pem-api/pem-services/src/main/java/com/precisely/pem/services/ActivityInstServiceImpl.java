package com.precisely.pem.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.spi.json.JsonOrgJsonProvider;
import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.InstStatus;
import com.precisely.pem.commonUtil.PcptInstStatus;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.requests.ContextDataNodes;
import com.precisely.pem.dtos.requests.Partners;
import com.precisely.pem.dtos.responses.ActivityInstListResp;
import com.precisely.pem.dtos.responses.ActivityInstPagnResp;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.ActivityInstDto;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.models.ActivityInst;
import com.precisely.pem.models.PcptActivityInst;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.ActivityInstRepo;
import com.precisely.pem.repositories.PartnerRepo;
import com.precisely.pem.repositories.PcptInstRepo;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.json.JSONException;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ActivityInstServiceImpl implements ActivityInstService{

    @Autowired
    ActivityDefnVersionRepo activityDefnVersionRepo;

    @Autowired
    ActivityInstRepo activityInstRepo;

    @Autowired
    PcptInstRepo pcptInstRepo ;

    @Autowired
    PartnerRepo partnerRepo;

    @Autowired
    private ModelMapper mapper;

    @Override
    @Transactional
    public ActivityInstResp createActivityInstance(String sponsorContext, ActivityInstReq activityInstReq) throws ResourceNotFoundException, SQLException, JsonProcessingException, JSONException, InvalidStatusException {
        ActivityInstResp activityInstResp = new ActivityInstResp();
        ActivityInst activityInst = null;
        ActivityInstDto activityInstDto = null;

        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

        ActivityDefnVersion activityDefnVersion = activityDefnVersionRepo.findByActivityDefnKeyVersion(activityInstReq.getActivityDefnVersionKey());
        if(Objects.isNull(activityDefnVersion) || activityDefnVersion.getActivityDefnKeyVersion().isEmpty()){
            throw new ResourceNotFoundException("NoDataFound", "No data was found for activity version key '" + activityInstReq.getActivityDefnVersionKey() + "'.");
        } else if (!activityDefnVersion.getStatus().equalsIgnoreCase(Status.FINAL.getStatus())) {
            throw new InvalidStatusException("NotInFinalStatus", "The activity version with key '"+ activityDefnVersion.getActivityDefnKeyVersion() +"' is not in the 'FINAL' state.");
        }

        JSONObject contextData = new JSONObject(activityInstReq.getContextData());

        Configuration configuration = Configuration.builder()
                .jsonProvider(new JsonOrgJsonProvider())
                .build();

        byte[] bytes = contextData.toString().getBytes(StandardCharsets.UTF_8);
        Blob blob = new SerialBlob(bytes);

        activityInstDto = ActivityInstDto.builder()
                .activityInstKey(UUID.randomUUID().toString())
                .activityDefnKeyVersion(activityInstReq.getActivityDefnVersionKey())
                .activityDefnKey(activityDefnVersion.getActivityDefnKey())
                .name(activityInstReq.getName())
                .description(activityInstReq.getDescription())
                .status(InstStatus.STARTED.getInstStatus())
                .startDate(LocalDateTime.now().toString())
                .dueDate(activityInstReq.getDueDate().toLocalDate().toString())
                .endDate(null)
                .alertDate(activityInstReq.getAlertStartDate().toLocalDate().toString())
                .alertFrequency(activityInstReq.getAlertInterval())
                .defData(blob)
                .isEncrypted(false)
                .isDeleted(false)
                .isCreatedByPartner(false)
                .application(Application.PEM.getApp())
                .sponsorKey(sponsorInfo.getSponsorKey())
                .emailPref(null)
        .build();

        activityInst = mapper.map(activityInstDto, ActivityInst.class);
        activityInstRepo.save(activityInst);

        if(!activityInstReq.getRolloutInternally()) {
            validatePartners(activityInstReq.getPartners());
            for(Partners partner : activityInstReq.getPartners()){
                PcptActivityInst pcptActivityInst = null;
                PcptActivityInstDto pcptActivityInstDto = null;
                Blob pcptBlob = null;
                DocumentContext json = null;

                for(ContextDataNodes nodes : partner.getContextDataNodes()) {
                    json = JsonPath.using(configuration).parse(contextData).set(nodes.getNodeRef(),nodes.getNodeValue());
                }

                byte[] pcptBytes = json.json().toString().getBytes(StandardCharsets.UTF_8);
                pcptBlob = new SerialBlob(pcptBytes);

                pcptActivityInstDto = PcptActivityInstDto.builder()
                        .pcptActivityInstKey(UUID.randomUUID().toString())
                        .activityInstKey(activityInstDto.getActivityInstKey())
                        .activityWorkflowInstKey("")
                        .partnerKey(partner.getPartnerKey())
                        .completionDate(null)
                        .dueDate(activityInstDto.getDueDate())
                        .pcptInstStatus(PcptInstStatus.NOT_STARTED.getPcptInstStatus())
                        .sponsorKey(sponsorInfo.getSponsorKey())
                        .isDeleted(false)
                        .taskCompleted(false)
                        .isEncrypted(false)
                        .mailGroupKey("")
                        .isAlreadyRolledOut(false)
                        .pcptContextData(pcptBlob)
                        .build();

                pcptActivityInst = mapper.map(pcptActivityInstDto, PcptActivityInst.class);
                pcptInstRepo.save(pcptActivityInst);
            }
        }

        activityInstResp.setActivityInstKey(activityInstDto.getActivityInstKey());
        return activityInstResp;
    }

    @Override
    public ActivityInstListResp getInstanceByKey(String sponsorContext, String activityInstKey) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        ActivityInstListResp activityInstListResp = new ActivityInstListResp();

        ActivityInst activityInst = activityInstRepo.findByActivityInstKey(activityInstKey);
        if (Objects.isNull(activityInst))
            throw new ResourceNotFoundException("activityInstanceKey", "NoDataFound", "Activity Instance with key '" + activityInstKey + "' not found. Kindly check the activityInstKey.");

        activityInstListResp = mapper.map(activityInst,ActivityInstListResp.class);
        return activityInstListResp;
    }

    @Override
    public ActivityInstPagnResp getAllInstanceList(String sponsorContext, String name, String description, String status, String activityDefnVersionKey, String partnerKey, Boolean activityStats, int pageNo, int pageSize, String sortBy, String sortDir) throws ResourceNotFoundException {
        ActivityInstPagnResp resp = new ActivityInstPagnResp();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Page<ActivityInst> defnsPage = null;
        if(name != null && !name.isEmpty() && name.contains("con:") && description != null && !description.isEmpty() && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            String conName = name.replace("con:","");
            System.out.println("conName="+conName);
            defnsPage = activityInstRepo.findBySponsorKeyAndNameContainingAndDescriptionContainingAndActivityDefnKeyVersionAndStatus(sponsorInfo.getSponsorKey(),
                    conName, description, activityDefnVersionKey, status, pageable);
        }else if(name != null && !name.isEmpty() && !name.contains("con:") && description != null && !description.isEmpty() && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndNameAndDescriptionContainingAndActivityDefnKeyVersionAndStatus(sponsorInfo.getSponsorKey(),
                    name, description, activityDefnVersionKey, status, pageable);
        }else if(name != null && !name.isEmpty() && name.contains("con:") && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            String conName = name.replace("con:","");
            System.out.println("conName="+conName);
            defnsPage = activityInstRepo.findBySponsorKeyAndNameContainingAndStatusAndAndActivityDefnKeyVersion(sponsorInfo.getSponsorKey(),
                    conName, status, activityDefnVersionKey, pageable);
        }else if(name != null && !name.isEmpty() && !name.contains("con:") && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndNameAndStatusAndAndActivityDefnKeyVersion(sponsorInfo.getSponsorKey(),
                    name, status, activityDefnVersionKey, pageable);
        }else if(description != null && !description.isEmpty() && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndDescriptionContainingAndActivityDefnKeyVersionAndStatus(sponsorInfo.getSponsorKey(),
                    description, activityDefnVersionKey, status, pageable);
        }else if(activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()){
            defnsPage = activityInstRepo.findBySponsorKeyAndActivityDefnKeyVersionAndStatus(sponsorInfo.getSponsorKey(),
                    activityDefnVersionKey, status, pageable);
        } else if (description != null && !description.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndDescriptionContainingAndStatus(sponsorInfo.getSponsorKey(), description,
                    status, pageable);
        } else if (name != null && !name.isEmpty() && name.contains("con:")) {
            String conName = name.replace("con:","");
            System.out.println("conName="+conName);
            defnsPage = activityInstRepo.findBySponsorKeyAndNameContainingAndStatus(sponsorInfo.getSponsorKey(),
                    conName, status, pageable);
        }else if(name != null && !name.isEmpty() && !name.contains("con:")) {
            defnsPage = activityInstRepo.findBySponsorKeyAndNameAndStatus(sponsorInfo.getSponsorKey(),
                    name, status, pageable);
        }else{
            defnsPage = activityInstRepo.findBySponsorKeyAndStatus(sponsorInfo.getSponsorKey(), status, pageable);
        }
        if(defnsPage == null || defnsPage.isEmpty()) {
            throw new ResourceNotFoundException("","NoDataFound", "No data was found for the provided query parameter combination.");
        }
        List<ActivityInst> listOfDefns = defnsPage.getContent();
        List<ActivityInstListResp> defnContent = new ArrayList<>();
        defnContent = listOfDefns.stream()
                .map(p ->
                {
                    return mapper.map(p, ActivityInstListResp.class);
                }).collect(Collectors.toList());

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int size = defnsPage.getSize();

        paginationDto.setNumber(pageNo);
        paginationDto.setSize(size);
        paginationDto.setTotalPages(totalPage);
        paginationDto.setTotalElements(totalElements);

        resp.setContent(defnContent);
        resp.setPage(paginationDto);
        return resp;
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        log.info("sponsorkey : " + sponsorInfo.getSponsorKey());
        return sponsorInfo;
    }

    private void validatePartners(List<Partners> partners) throws ResourceNotFoundException {
        ArrayList<String> invalidPartnerKey = new ArrayList<>();
        ArrayList<String> noPartnerKey = new ArrayList<>();
        if(!Objects.isNull(partners) && ((long) partners.size() != 0)){
            for(Partners partner : partners){
                Optional<com.precisely.pem.models.Partners> partnerData=partnerRepo.findById(partner.getPartnerKey());
                if(partnerData.isEmpty()){
                    noPartnerKey.add(partner.getPartnerKey());
                } else if(!partnerData.get().getPartnerStatus().equalsIgnoreCase("APPROVED")) {
                    invalidPartnerKey.add(partner.getPartnerKey());
                }
            }
            if(!noPartnerKey.isEmpty()) {
                throw new ResourceNotFoundException("Partner", "The Partner with keys " + noPartnerKey + " not found. Please check partner details.");
            }
            if(!invalidPartnerKey.isEmpty()) {
                throw new ResourceNotFoundException("Partner", "The Partner with keys " + invalidPartnerKey + " are not 'APPROVED'. Please check partner details.");
            }
        }
    }
}
