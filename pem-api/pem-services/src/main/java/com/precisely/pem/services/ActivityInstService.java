package com.precisely.pem.services;

import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;

import java.sql.SQLException;

public interface ActivityInstService {
    public ActivityInstResp createActivityInstance(String sponsorContext, ActivityInstReq activityInstReq) throws ResourceNotFoundException, SQLException;
}
