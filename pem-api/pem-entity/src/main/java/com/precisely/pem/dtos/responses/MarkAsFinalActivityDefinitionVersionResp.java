package com.precisely.pem.dtos.responses;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class MarkAsFinalActivityDefinitionVersionResp {
    private String status;
    private LocalDateTime modifyTs;

    public MarkAsFinalActivityDefinitionVersionResp() {
    }

    public MarkAsFinalActivityDefinitionVersionResp(String status, LocalDateTime modifyTs) {
        this.status = status;
        this.modifyTs = modifyTs;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getModifyTs() {
        return modifyTs;
    }

    public void setModifyTs(LocalDateTime modifyTs) {
        this.modifyTs = modifyTs;
    }
}
