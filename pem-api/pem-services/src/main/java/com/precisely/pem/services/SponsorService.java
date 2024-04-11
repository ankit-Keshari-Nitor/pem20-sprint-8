package com.precisely.pem.services;

import com.precisely.pem.models.Company;

public interface SponsorService {
    String getSponsorKey(String sponsorContext);
    Company getCompanyByKey(String companyKey);
}
