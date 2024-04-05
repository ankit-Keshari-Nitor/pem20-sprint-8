package com.precisely.pem.exceptionhandler;

import com.precisely.pem.dtos.shared.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.naming.SizeLimitExceededException;

@ControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SizeLimitExceededException.class)
    protected ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("File is either empty or file size exceeds 10MB.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidFileException.class)
    protected ResponseEntity<Object> handleFormatConflict(RuntimeException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("File is invalid. Please upload xml file");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }
}
