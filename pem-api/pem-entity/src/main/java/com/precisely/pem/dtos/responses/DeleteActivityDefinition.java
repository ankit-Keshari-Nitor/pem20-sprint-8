package com.precisely.pem.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeleteActivityDefinition {
    private Integer totalActivityVersions;
    private Integer activityVersionsHardDeleted;
    private Integer activityVersionsSoftDeleted;
}
