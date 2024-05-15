package com.precisely.pem.services;

import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ActivityInstServiceImpl implements ActivityInstService{
    @Override
    public ActivityInstResp createActivityInstance(String sponsorContext, ActivityInstReq activityInstReq) throws ResourceNotFoundException {
        validateSponsorContext(sponsorContext);
        return null;
    }

    private void validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext;SponsorIssue;Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
    }
}
