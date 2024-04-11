package com.precisely.pem.services;

import com.precisely.pem.models.Company;
import com.precisely.pem.repositories.CompanyRepo;
import com.precisely.pem.repositories.VCHSponsorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SponsorServiceImpl implements SponsorService {

    private VCHSponsorRepo sponsorRepo;

    private CompanyRepo companyRepo;

    @Autowired
    SponsorServiceImpl(VCHSponsorRepo sponsorRepo, CompanyRepo companyRepo){
        this.sponsorRepo = sponsorRepo;
        this.companyRepo = companyRepo;
    }

    @Override
    public String getSponsorKey(String sponsorContext) {
        return sponsorRepo.getCompanyKey(sponsorContext);
    }

    @Override
    public Company getCompanyByKey(String companyKey) {
        return companyRepo.findById(companyKey).get();
    }
}
