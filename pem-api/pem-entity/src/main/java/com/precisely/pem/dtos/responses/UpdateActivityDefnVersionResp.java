package com.precisely.pem.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateActivityDefnVersionResp {
    private String activityDefnKey;
    private String activityDefnVersionKey;
    private Boolean isEncrypted;
    private String description;
}
