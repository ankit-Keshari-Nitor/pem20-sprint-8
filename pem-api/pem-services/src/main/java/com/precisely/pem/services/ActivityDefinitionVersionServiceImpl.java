package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import com.precisely.pem.models.VCHActivityDefnVersion;
import com.precisely.pem.repositories.VCHActivityDefnVersionRepo;
import com.precisely.pem.util.ActivityDefnStatus;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ActivityDefinitionVersionServiceImpl implements ActivityDefinitionVersionService{

    private final VCHActivityDefnVersionRepo activityDefnVersionRepo;

    @Autowired
    ActivityDefinitionVersionServiceImpl(VCHActivityDefnVersionRepo vchActivityDefnVersionRepo){
        this.activityDefnVersionRepo = vchActivityDefnVersionRepo;
    }

    @Override
    public MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersion(String activityDefnVersionKey) throws Exception {
        Optional<VCHActivityDefnVersion> activityDefnVersion = activityDefnVersionRepo.findById(activityDefnVersionKey);
        if(activityDefnVersion.isEmpty()){
            throw  new Exception("Activity Definition Version not found" );
        }

        activityDefnVersion.get().setStatus(String.valueOf(ActivityDefnStatus.FINAL));
        activityDefnVersion.get().setModifyTs(LocalDateTime.now());
        VCHActivityDefnVersion savedActivityDefnVersion =  activityDefnVersionRepo.save(activityDefnVersion.get());
        ModelMapper mapper = new ModelMapper();
        return mapper.map(savedActivityDefnVersion, MarkAsFinalActivityDefinitionVersionResp.class);
    }
}
