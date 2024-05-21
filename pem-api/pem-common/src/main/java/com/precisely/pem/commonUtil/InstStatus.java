package com.precisely.pem.commonUtil;

import lombok.Getter;

@Getter
public enum InstStatus {
    NEW ("NEW"), INPROGRESS ("INPROGRESS"), COMPLETED ("COMPLETED"), CLOSED ("CLOSED");
    private String instStatus;

    InstStatus(String instStatus) {
        this.instStatus = instStatus;
    }

    public void setInstStatus(String instStatus) {
        this.instStatus = instStatus;
    }
}
