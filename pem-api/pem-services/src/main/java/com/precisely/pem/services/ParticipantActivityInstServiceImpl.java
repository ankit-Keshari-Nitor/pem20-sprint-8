package com.precisely.pem.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.commonUtil.PcptInstProgress;
import com.precisely.pem.commonUtil.PcptInstStatus;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityInstStatsDto;
import com.precisely.pem.dtos.shared.PaginationPcptInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.dtos.task.TaskDTO;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ParamMissingException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.PEMActivitiService;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
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

    @Autowired
    PEMActivitiService pemActivitiService;

    @Autowired
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Autowired
    private ActivityDefnRepo activityDefnRepo;

    @Autowired
    ActivityProcDefRepo activityProcDefRepo;

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
                activityInstKey = activityInstRepo.findByActivityDefnVersionKey(activityDefnVersionKey).getActivityInstKey();
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
                String startDate = String.valueOf(activityInstance.getStartDate());
                startDateMap.put(finalActivityInstKey, startDate!=null ? startDate:null);
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
            String startDate = String.valueOf(activityInstance.getStartDate());
            participantActivityInstResp.setApplication(activityInstance.getApplication());
            participantActivityInstResp.setStartDate(startDate !=null ? startDate:null);
        }
        return participantActivityInstResp;
    }

    @Override
    public MessageResp startActivity(String sponsorContext, String pcptActivityInstKey) throws ResourceNotFoundException, InvalidStatusException {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        PcptActivityInst pcptActivityInst = pcptInstRepo.findByPcptActivityInstKey(pcptActivityInstKey);
        if(Objects.isNull(pcptActivityInst)){
            throw new ResourceNotFoundException("PcptInstanceNotFound", "The participant instance with key '" + pcptActivityInstKey + "' not found.");
        }
        if(pcptActivityInst.getPcptInstStatus().equalsIgnoreCase(PcptInstStatus.STARTED.getPcptInstStatus()))
            throw new ResourceNotFoundException("AlreadyInStartedStatus", "The participant instance with key '" + pcptActivityInstKey + "' not found.");

        String activityInstanceKey = pcptActivityInst.getActivityInstKey();
        ActivityInst activityInst = activityInstRepo.findByActivityInstKey(activityInstanceKey);
        if(Objects.isNull(activityInst)){
            throw new ResourceNotFoundException("ActivityInstanceNotFound", "The activity instance with key '" + activityInstanceKey + "' not found.");
        }
        String activityDefnVersionKey = activityInst.getActivityDefnVersionKey();
        ActivityDefnVersion activityDefnVersion =  activityDefnVersionRepo.findByActivityDefnVersionKey(activityDefnVersionKey);
        if(Objects.isNull(activityDefnVersion)){
            throw new ResourceNotFoundException("ActivityVersionNotFound", "The activity definition version with key '" + activityDefnVersionKey + "' not found.");
        }
        String activityDefnKey = activityDefnVersion.getActivityDefnKey();
        ActivityDefn activityDefn = activityDefnRepo.findByActivityDefnKey(activityDefnKey);
        if(Objects.isNull(activityDefn)){
            throw new ResourceNotFoundException("ActivityDefnNotFound", "The activity definition with key '" + activityDefnKey + "' not found.");
        }
        String activityName = activityDefn.getActivityName();

        Blob contextDataBlob = pcptActivityInst.getPcptContextData();
        byte[] contextDataByte = null;
        try {
            contextDataByte = contextDataBlob.getBytes(1, (int) contextDataBlob.length());
        }catch (Exception e){
            log.info(e);
        }
        if(contextDataByte == null)
            throw new ResourceNotFoundException("NA", "The contextDataByte is empty.");

        String contextDataStr = new String(contextDataByte);
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = null;
        Map<String, Object> contextData = new HashMap<>();
        try{
            map = mapper.readValue(contextDataStr, new TypeReference<>() {});
            contextData.put("contextData",map);
        }catch (Exception e){
            log.info(e);
        }
        log.info("contextData Map content: " + contextData);
        log.info("Resource Name : " + activityName+".bpmn");
        List<ActivityProcDef> activityProcDefList = activityProcDefRepo.findByResourceName(activityName+".bpmn");
        if(Objects.isNull(activityProcDefList) || activityProcDefList.isEmpty()){
            throw new ResourceNotFoundException("ActivityProcDefListEmpty", "The activity process definition not found.");
        }
        String processInstanceId = pemActivitiService.startProcessInstanceById(activityProcDefList.get(0).getId(),null,map);
        log.info("processInstanceId = "+processInstanceId);
        if(Objects.isNull(processInstanceId)){
            throw new ResourceNotFoundException("CouldNotStartInstance", "The participant activity instance could not be started. Kindly check.");
        }
        pcptActivityInst.setActivityWorkflowInstKey(processInstanceId);
        pcptActivityInst.setPcptInstStatus(PcptInstStatus.STARTED.getPcptInstStatus());
        pcptInstRepo.save(pcptActivityInst);

        return MessageResp.builder()
                .response("SUCCESS")
                .build();
    }

    @Override
    public ActivityTaskDto getTaskDetails(String sponsorContext, String pcptActivityInstKey, String taskKey) throws Exception {
        ActivityTaskDto activityTaskDto = null;
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(),pcptActivityInstKey));
        if(result.get() != null) {
            PcptActivityInst pcptActivityInst = result.get();
            if(pcptActivityInst.getPcptInstStatus().equalsIgnoreCase(PcptInstStatus.STARTED.getPcptInstStatus())){
                TaskDTO taskDTO = pemActivitiService.getTaskDetails(taskKey);
                activityTaskDto = mapper.map(taskDTO, ActivityTaskDto.class);
                activityTaskDto.setPcptActivityInstTaskKey(pcptActivityInstKey);
                activityTaskDto.setActivityInstKey(result.get().getActivityInstKey());
                activityTaskDto.setSponsorKey(sponsorInfo.getSponsorKey());
            } else{
                throw new ResourceNotFoundException("NA", "The PCPT instance is not in the necessary status to get the task details, Current status is " + pcptActivityInst.getPcptInstStatus());
            }
        }else
            throw new ResourceNotFoundException("NA", "PCPT Instance not found.");

        return activityTaskDto;
    }

    @Override
    public MarkAsFinalActivityDefinitionVersionResp submitTask(String sponsorContext, String pcptActivityInstKey, String taskKey,String data) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(),pcptActivityInstKey));
        if(result.get() != null) {
            PcptActivityInst pcptActivityInst = result.get();
            if(pcptActivityInst.getPcptInstStatus().equalsIgnoreCase(PcptInstStatus.STARTED.getPcptInstStatus())){
                pemActivitiService.completeUserTask(taskKey, data);
            } else{
                throw new ResourceNotFoundException("NA", "The PCPT instance is not in the necessary status to submit the task, Current status is " + pcptActivityInst.getPcptInstStatus());
            }
        }else {
            throw new ResourceNotFoundException("NA", "PCPT Instance not found.");
        }
        return new MarkAsFinalActivityDefinitionVersionResp("Success",LocalDateTime.now().toString());
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        return sponsorInfo;
    }

}
