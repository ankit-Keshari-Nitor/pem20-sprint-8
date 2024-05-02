package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.SponsorInfo;

public interface SponsorService {
    SponsorInfo getActiveSponsorNameBySponsorContext(String sponsorContext);
}
