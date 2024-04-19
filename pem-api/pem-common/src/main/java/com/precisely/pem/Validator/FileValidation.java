package com.precisely.pem.Validator;

import com.precisely.pem.exceptionhandler.InvalidFileException;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.SneakyThrows;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

public class FileValidation implements ConstraintValidator<MultipartFileValidator, MultipartFile> {

    private static final long FILE_SIZE = 1048576;
    @SneakyThrows
    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext constraintValidatorContext) {
         if (file.isEmpty()) {
            throw new MultipartException("File is empty");
        }else if(!Objects.requireNonNull(file.getContentType()).contains("xml")) {
            throw new InvalidFileException("Invalid File type");
        }
        return true;
    }
}
