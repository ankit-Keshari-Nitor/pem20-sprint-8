package com.precisely.pem.dtos.shared;

import lombok.Data;

import java.io.Serializable;
@Data
public class ErrorResponseDto implements Serializable {
    private int errorCode;
    private String errorDescription;
}
