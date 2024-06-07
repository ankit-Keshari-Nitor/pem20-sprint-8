package com.precisely.pem.commonUtil;

import lombok.Getter;

@Getter
public enum InstStatus {
    STARTED ("STARTED"), CLOSED ("CLOSED");
    private String instStatus;

    InstStatus(String instStatus) {
        this.instStatus = instStatus;
    }

    public void setInstStatus(String instStatus) {
        this.instStatus = instStatus;
    }
}
