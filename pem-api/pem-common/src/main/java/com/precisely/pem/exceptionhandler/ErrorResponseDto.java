package com.precisely.pem.exceptionhandler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDto implements Serializable {
    private int errorCode;
    private String fieldName;
    private String fieldValue;
    private LocalDateTime localDateTime;
    private String code;
    private String message;
}
