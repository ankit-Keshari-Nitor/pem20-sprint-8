package com.precisely.pem.commonUtil;

public enum Status {
    DRAFT ("DRAFT"), FINAL ("FINAL"), DELETE ("DELETE");
    private String status;
    Status(String status) {
        this.status = status;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
