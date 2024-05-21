package com.precisely.pem.exceptionhandler;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class AlreadyDeletedException extends Exception {
    String fieldName;
    String errorCode;
    String message;

    public AlreadyDeletedException(String fieldName, String errorCode, String message) {
        this.fieldName = fieldName;
        this.errorCode = errorCode;
        this.message = message;
    }

    public AlreadyDeletedException(String message) {
        super(message);
    }
}
