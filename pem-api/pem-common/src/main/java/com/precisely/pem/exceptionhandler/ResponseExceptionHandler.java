package com.precisely.pem.exceptionhandler;

import jakarta.validation.ConstraintViolationException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MultipartException;

import javax.naming.SizeLimitExceededException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import java.util.prefs.InvalidPreferencesFormatException;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ResponseExceptionHandler{

    @ExceptionHandler({MultipartException.class})
    protected ResponseEntity<Object> handleMultipartException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1002);
        errResp.setErrorDescription("Request Body is Empty in Multipart request.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler({SizeLimitExceededException.class})
    protected ResponseEntity<Object> handleConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1002);
        errResp.setErrorDescription("File is either empty or file size exceeds 10MB.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidFileException.class)
    protected ResponseEntity<Object> handleFormatConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1003);
        errResp.setErrorDescription("File is invalid. Please upload xml file");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<Object> handleResourceConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1004);
        errResp.setErrorDescription("Data not found for the query param combination.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<Object> handleCharacterConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1005);
        errResp.setErrorDescription("Illegal character introduced. Kindly check your string.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(OnlyOneDraftVersionException.class)
    protected ResponseEntity<Object> handleVersionConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1006);
        errResp.setErrorDescription("A version with DRAFT status already exists. Kindly Verify");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleNameConflict(ConstraintViolationException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1007);
        errResp.setErrorDescription("A definition with the name already exist. Kindly change the name.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidPreferencesFormatException.class)
    protected ResponseEntity<Object> handleCaseConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1008);
        errResp.setErrorDescription("Invalid format for given string. Please check your input.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    protected ResponseEntity<Object> handleGeneralConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(1001);
        errResp.setErrorDescription("Validation Failure");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        JSONArray jsonArray = new JSONArray();
        ex.getBindingResult().getFieldErrors().forEach(objectError -> {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("fieldName",objectError.getField());
            jsonObject.put("fieldValue",objectError.getRejectedValue());
            jsonObject.put("code",objectError.getCode());
            jsonObject.put("time", LocalDateTime.now());
            jsonArray.put(jsonObject);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jsonArray.toString());
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleGeneralException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(5000);
        errResp.setErrorDescription(ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }
}
