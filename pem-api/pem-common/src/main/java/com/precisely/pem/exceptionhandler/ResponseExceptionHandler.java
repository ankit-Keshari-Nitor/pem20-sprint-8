package com.precisely.pem.exceptionhandler;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MultipartException;

import javax.naming.SizeLimitExceededException;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.prefs.InvalidPreferencesFormatException;

@ControllerAdvice
public class ResponseExceptionHandler{

    @ExceptionHandler({MultipartException.class, SizeLimitExceededException.class})
    protected ResponseEntity<Object> handleConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1002);
        errResp.setFieldName("file");
        errResp.setLocalDateTime(LocalDateTime.now().toString());
        errResp.setMessage(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidFileException.class)
    protected ResponseEntity<Object> handleFormatConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1003);
        errResp.setFieldName("file");
        errResp.setMessage(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<Object> handleResourceConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1004);
        errResp.setLocalDateTime(LocalDateTime.now().toString());
        errResp.setMessage("No data was found for the provided query parameter combination.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<Object> handleCharacterConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1005);
        errResp.setMessage("Illegal character introduced. Kindly check your string.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(OnlyOneDraftVersionException.class)
    protected ResponseEntity<Object> handleVersionConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1006);
        errResp.setLocalDateTime(LocalDateTime.now().toString());
        errResp.setMessage(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidPreferencesFormatException.class)
    protected ResponseEntity<Object> handleCaseConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1008);
        errResp.setMessage("Invalid format for given string. Please check your input.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    protected ResponseEntity<Object> handleGeneralConflict(HandlerMethodValidationException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1001);
        errResp.setMessage("Validation Failure");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValidException(Exception ex,  WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        if(ex instanceof MethodArgumentNotValidException exception) {
            exception.getBindingResult().getFieldErrors().forEach(objectError -> {
                errResp.setFieldName(objectError.getField());
                errResp.setFieldValue(Objects.requireNonNull(objectError.getRejectedValue()).toString());
                errResp.setLocalDateTime(LocalDateTime.now().toString());
                errResp.setErrorCode(1011);
            });
            exception.getBindingResult().getAllErrors().forEach(objectError -> {
                errResp.setMessage(objectError.getDefaultMessage());
            });
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(DuplicateEntryException.class)
    protected ResponseEntity<Object> handleDuplicateException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1007);
        errResp.setFieldName("name");
        errResp.setFieldValue(StringUtils.substringBetween(ex.getLocalizedMessage(), "'", "'"));
        errResp.setLocalDateTime(LocalDateTime.now().toString());
        errResp.setMessage(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(SponsorNotFoundException.class)
    protected ResponseEntity<Object> handleSponsorException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1010);
        errResp.setFieldName("sponsorContext");
        errResp.setFieldValue(StringUtils.substringBetween(ex.getLocalizedMessage(), "'", "'"));
        errResp.setLocalDateTime(LocalDateTime.now().toString());
        errResp.setMessage(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleGeneralException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(5000);
        errResp.setMessage(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }
}
