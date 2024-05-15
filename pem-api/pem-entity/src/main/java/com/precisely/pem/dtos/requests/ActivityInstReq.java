package com.precisely.pem.dtos.requests;

import com.precisely.pem.Validator.NumericValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityInstReq {

    private String activityDefnVersionKey;

    @NotNull
    @SpecialCharValidator(fieldName = "name")
    private String name;

    @SpecialCharValidator(fieldName = "description")
    private String description;

    @NumericValidator
    private int alertInterval;

    private LocalDateTime alertStartDate;

    private Participants[] participants;

    private String contextData;

    private Boolean rolloutInternally;

    private AttributeValues[] attributeValues;

    private AttributeGroups[] attributeGroups;
}
