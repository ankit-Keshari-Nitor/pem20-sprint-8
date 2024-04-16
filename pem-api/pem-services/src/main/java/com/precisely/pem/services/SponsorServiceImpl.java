package com.precisely.pem.services;

import com.precisely.pem.repositories.VCHSponsorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SponsorServiceImpl implements SponsorService {

    private final VCHSponsorRepo sponsorRepo;
    @Autowired
    SponsorServiceImpl(VCHSponsorRepo sponsorRepo){
        this.sponsorRepo = sponsorRepo;
    }

    @Override
    public String getActiveSponsorKeyBySponsorContext(String sponsorContext){
        return sponsorRepo.getActiveSponsorKeyBySponsorContext(sponsorContext);
    }
}
