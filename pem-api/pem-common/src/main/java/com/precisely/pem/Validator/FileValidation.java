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

    @Override
    public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext constraintValidatorContext) {
        if (multipartFile != null) {
            if (multipartFile.isEmpty() || multipartFile.getSize() == 0L) {
                constraintValidatorContext.disableDefaultConstraintViolation();
                constraintValidatorContext
                        .buildConstraintViolationWithTemplate("The file appears to be empty. Please review its contents.")
                        .addConstraintViolation();
                return false;
            }
            if (!Objects.requireNonNull(multipartFile.getContentType()).endsWith("xml") &&
                    !Objects.requireNonNull(multipartFile.getOriginalFilename()).endsWith(".xml")) {
                constraintValidatorContext.disableDefaultConstraintViolation();
                constraintValidatorContext
                        .buildConstraintViolationWithTemplate("The uploaded file does not appear to be in XML format. Please verify the file type.")
                        .addConstraintViolation();
                return false;
            }
        }
        return true;
    }
}

