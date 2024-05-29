package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PcptInstProgress;
import com.precisely.pem.commonUtil.PcptInstStatus;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityInstStatsDto;
import com.precisely.pem.dtos.shared.PaginationPcptInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ParamMissingException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.ActivityInstRepo;
import com.precisely.pem.repositories.CompanyRepo;
import com.precisely.pem.repositories.PartnerRepo;
import com.precisely.pem.repositories.PcptInstRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ParticipantActivityInstServiceImpl implements ParticipantActivityInstService {

    @Autowired
    private CompanyRepo companyRepo;
    @Autowired
    private PartnerRepo partnerRepo;
    @Autowired
    private PcptInstRepo pcptInstRepo;
    @Autowired
    private ActivityInstRepo activityInstRepo;
    @Autowired
    private ModelMapper mapper;

    @Override
    public ParticipantActivityInstPaginationResp getAllParticipantActivityInstances(String sponsorContext, String status, String activityInstKey,String activityDefnVersionKey, Boolean activityStats, String currentTask, String partnerName, String progress, int pageNo, int pageSize, String sortDir) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        ParticipantActivityInstPaginationResp participantActivityInstPaginationResp = new ParticipantActivityInstPaginationResp();
        PaginationPcptInstDto paginationPcptInstDto = new PaginationPcptInstDto();
        ActivityInstStatsDto activityInstStatsDto = new ActivityInstStatsDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by("modifyTs").ascending()
                : Sort.by("modifyTs").descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<PcptActivityInst> defnsPage = null;
        if(activityInstKey.isEmpty() && activityDefnVersionKey.isEmpty()){
            throw new ParamMissingException("","InputParamNeeded","Either one of the two parameters activityInstKey and activityDefnVersionKey is required, both cannot be empty");
        }
        if (activityInstKey.isEmpty() || activityDefnVersionKey.isEmpty()) {
            if(activityInstKey.isEmpty()){
                activityInstKey = activityInstRepo.findByActivityDefnKeyVersion(activityDefnVersionKey).getActivityInstKey();
            }
        }
        if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty() && partnerName != null && !partnerName.isEmpty() && progress != null && !progress.isEmpty()){
            Date currentDate = Date.valueOf(LocalDateTime.now().toLocalDate());
            if(progress == PcptInstProgress.DELAYED.toString()){
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndDelayedProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, partnerName, currentDate.toString(), pageable);
            }else {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndOnScheduleProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, partnerName,currentDate.toString(), pageable);
            }
        }
        else  if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty() && partnerName != null && !partnerName.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerName(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, partnerName, pageable);
        }
        else if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty() && progress != null && !progress.isEmpty()) {
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndDelayedProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask,currentDate.toString(), pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndOnScheduleProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask,currentDate.toString(), pageable);
            }
        }
        else if(status != null && !status.isEmpty() && partnerName != null && !partnerName.isEmpty() && progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerNameAndDelayedProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), partnerName,currentDate.toString(), pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerNameAndOnScheduleProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), partnerName,currentDate.toString(), pageable);
            }
        }
        else if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTask(sponsorInfo.getSponsorKey(), activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, pageable);
        }
        else if(status != null && !status.isEmpty() && partnerName != null && !partnerName.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerName(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), partnerName, pageable);

        }
        else if(status != null && !status.isEmpty() && progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndDelayedProgress(sponsorInfo.getSponsorKey(),activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(),currentDate.toString(),pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndOnScheduleProgress(sponsorInfo.getSponsorKey(),activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(),currentDate.toString(),pageable);
            }
        }
        else if(partnerName != null && !partnerName.isEmpty() && progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage =  pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPartnerNameAndDelayedProgress(sponsorInfo.getSponsorKey(),activityInstKey,partnerName,currentDate.toString(),pageable);
            }else{
                defnsPage =  pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPartnerNameAndOnScheduleProgress(sponsorInfo.getSponsorKey(),activityInstKey,partnerName,currentDate.toString(),pageable);
            }

        }else if(progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndDelayedProgress(sponsorInfo.getSponsorKey(),activityInstKey,currentDate.toString(),pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndOnScheduleProgress(sponsorInfo.getSponsorKey(),activityInstKey,currentDate.toString(),pageable);
            }
        }
        else if(status != null && !status.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatus(sponsorInfo.getSponsorKey(),activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(),pageable);
        }
        else {
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKey(sponsorInfo.getSponsorKey(),activityInstKey, pageable);
        }
        if(defnsPage == null || defnsPage.isEmpty()) {
            return participantActivityInstPaginationResp;
        }


        List<PcptActivityInst> listOfDefns = defnsPage.getContent();
        List<ParticipantActivityInstListResp> defnContent = new ArrayList<>();
        defnContent = listOfDefns.stream()
                .map(p ->
                {
                    ParticipantActivityInstListResp resp = mapper.map(p, ParticipantActivityInstListResp.class);
                    try {
                        Blob contextDataBlob = p.getPcptContextData();
                        if (contextDataBlob != null) {
                            try (InputStream inputStream = contextDataBlob.getBinaryStream();
                                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                                byte[] buffer = new byte[4096];
                                int bytesRead;
                                while ((bytesRead = inputStream.read(buffer)) != -1) {
                                    outputStream.write(buffer, 0, bytesRead);
                                }

                                String contextDataString = new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
                                resp.setContextData(contextDataString);
                            }
                        } else {
                            resp.setContextData("");
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return resp;
                }).collect(Collectors.toList());


        String finalActivityInstKey = activityInstKey;

        Map<String, String> partnerNameMap = new HashMap<>();
        Map<String, String> startDateMap = new HashMap<>();
        Map<String, String> applicationMap = new HashMap<>();
        Map<String, ActivityInstStatsDto> activityStatsMap = new HashMap<>();

        defnContent.forEach(item -> {
            String partnerKey = item.getPartner().getPartnerKey();
            if (partnerKey != null && !partnerNameMap.containsKey(partnerKey)) {
                Partners partner = partnerRepo.findByPartnerKey(partnerKey);
                if (partner != null) {
                    String companyKey = partner.getCompanyKey();
                    Company company = companyRepo.findByCompanyKey(companyKey);
                    String companyName = company != null ? company.getCompanyName() : "Unknown";
                    // Store the company name in the map with the partner key
                    partnerNameMap.put(partnerKey, companyName);
                }
            }

            ActivityInst activityInstance = activityInstRepo.findById(finalActivityInstKey).orElse(null);
            if (activityInstance != null) {
                startDateMap.put(finalActivityInstKey, activityInstance.getStartDate().toString());
                applicationMap.put(finalActivityInstKey, activityInstance.getApplication());
            }

            ActivityInstStatsDto activityInstStatsDto1 = new ActivityInstStatsDto();
            if (activityStats) {
                activityInstStatsDto.setTasksCompleted(0);
                activityInstStatsDto.setTasksSkipped(0);
                activityInstStatsDto.setEstimatedDelay(0);
                activityInstStatsDto.setEstimatedCompletionDate(LocalDate.now().toString());
            }
            activityStatsMap.put(finalActivityInstKey, activityInstStatsDto1);
        });

        defnContent.forEach(item -> {
            String partnerKey = item.getPartner().getPartnerKey();
            if (partnerKey != null) {
                String companyName = partnerNameMap.getOrDefault(partnerKey, "Unknown");
                item.getPartner().setPartnerName(companyName);
            }
            if(activityStats) { item.setActivityStats(activityInstStatsDto); }
            String finalActivityInstKey1 = item.getActivityInstKey();
            if (finalActivityInstKey1 != null) {
                item.setStartDate(startDateMap.getOrDefault(finalActivityInstKey1, "Unknown"));
                item.setApplication(applicationMap.getOrDefault(finalActivityInstKey1, "Unknown"));
                if(activityStats){
                    ActivityInstStatsDto activityInstStatsDto1 = activityStatsMap.get(finalActivityInstKey);
                    item.setActivityStats(activityInstStatsDto1);
                }
            }
        });

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int size = defnsPage.getSize();

        paginationPcptInstDto.setNumber(pageNo);
        paginationPcptInstDto.setSize(size);
        paginationPcptInstDto.setTotalPages(totalPage);
        paginationPcptInstDto.setTotalElements(totalElements);

        participantActivityInstPaginationResp.setContent(defnContent);
        participantActivityInstPaginationResp.setPageContent(paginationPcptInstDto);

        return participantActivityInstPaginationResp;
    }

    @Override
    public ParticipantActivityInstResp getParticipantActivityInstanceByKey(String sponsorContext, String pcptActivityInstKey) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(),pcptActivityInstKey));
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("", "NoDataFound", "No data was found for the provided query parameter combination.");
        }
        ModelMapper mapper = new ModelMapper();
        ParticipantActivityInstResp participantActivityInstResp = mapper.map(result.get(), ParticipantActivityInstResp.class);

        Blob contextDataBlob = result.get().getPcptContextData();
        if (contextDataBlob != null) {
            try (InputStream inputStream = contextDataBlob.getBinaryStream();
                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                String contextDataString = new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
                participantActivityInstResp.setContextData(contextDataString);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            participantActivityInstResp.setContextData("");
        }

        if (participantActivityInstResp.getPartner().getPartnerKey() != null) {
            Partners partner = partnerRepo.findByPartnerKey(participantActivityInstResp.getPartner().getPartnerKey());
            if (partner != null) {
                String companyKey = partner.getCompanyKey();
                Company company = companyRepo.findByCompanyKey(companyKey);
                String companyName = company != null ? company.getCompanyName() : "Unknown";
                participantActivityInstResp.getPartner().setPartnerName(companyName);
            }
        }

        ActivityInst activityInstance = activityInstRepo.findById(participantActivityInstResp.getActivityInstKey()).orElse(null);
        if (activityInstance != null) {
            participantActivityInstResp.setApplication(activityInstance.getStartDate().toString());
            participantActivityInstResp.setStartDate(activityInstance.getStartDate().toString());
        }
        return participantActivityInstResp;
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        return sponsorInfo;
    }

}
