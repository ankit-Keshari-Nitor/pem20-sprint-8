package com.precisely.pem.exceptionhandler;

import com.precisely.pem.dtos.shared.ErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MultipartException;

import javax.naming.SizeLimitExceededException;
import java.util.prefs.InvalidPreferencesFormatException;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ResponseExceptionHandler{

    @ExceptionHandler({MultipartException.class, SizeLimitExceededException.class})
    protected ResponseEntity<Object> handleConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("File is either empty or file size exceeds 10MB.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidFileException.class)
    protected ResponseEntity<Object> handleFormatConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("File is invalid. Please upload xml file");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<Object> handleCharacterConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("Illegal character introduced. Kindly check your string.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(OnlyOneDraftVersionException.class)
    protected ResponseEntity<Object> handleVersionConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("A version with DRAFT status already exists. Kindly Verify");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidPreferencesFormatException.class)
    protected ResponseEntity<Object> handleCaseConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("Invalid format for given string. Please check your input.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    protected ResponseEntity<Object> handleGeneralConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setErrorDescription("Validation Failure");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }


}
