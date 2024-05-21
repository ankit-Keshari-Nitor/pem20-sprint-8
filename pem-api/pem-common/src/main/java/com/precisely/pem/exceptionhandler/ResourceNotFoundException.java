package com.precisely.pem.exceptionhandler;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ResourceNotFoundException extends Exception{
    String fieldName;
    String errorCode;
    String message;

    public ResourceNotFoundException(String fieldName, String errorCode, String message) {
        this.fieldName = fieldName;
        this.errorCode = errorCode;
        this.message = message;
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
