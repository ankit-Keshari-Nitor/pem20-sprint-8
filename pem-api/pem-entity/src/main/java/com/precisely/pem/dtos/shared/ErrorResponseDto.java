package com.precisely.pem.dtos.shared;

import java.io.Serializable;

public class ErrorResponseDto implements Serializable {
    private int errorCode;
    private String errorDescription;

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public void setErrorDescription(String errorDescription) {
        this.errorDescription = errorDescription;
    }
}
