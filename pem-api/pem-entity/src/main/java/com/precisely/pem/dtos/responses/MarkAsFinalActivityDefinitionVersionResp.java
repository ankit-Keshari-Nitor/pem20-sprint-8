package com.precisely.pem.dtos.responses;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class MarkAsFinalActivityDefinitionVersionResp {
    private String status;
    private String modifyTs;

    public MarkAsFinalActivityDefinitionVersionResp() {
    }

    public MarkAsFinalActivityDefinitionVersionResp(String status, String modifyTs) {
        this.status = status;
        this.modifyTs = modifyTs;
    }
}
