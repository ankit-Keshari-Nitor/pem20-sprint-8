package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.repositories.SponsorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SponsorServiceImpl implements SponsorService {

    private final SponsorRepo sponsorRepo;
    @Autowired
    SponsorServiceImpl(SponsorRepo sponsorRepo){
        this.sponsorRepo = sponsorRepo;
    }

    @Override
    public SponsorInfo getActiveSponsorNameBySponsorContext(String sponsorContext){
        return sponsorRepo.getActiveSponsorInfoBySponsorContext(sponsorContext);
    }
}
