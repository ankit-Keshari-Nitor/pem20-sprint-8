package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

public class FileValidation implements ConstraintValidator<MultipartFileValidator, MultipartFile> {

    private static final long FILE_SIZE = 1048576;

    @Override
    public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext constraintValidatorContext) {
        return multipartFile != null
                && !multipartFile.isEmpty()
                && Objects.requireNonNull(multipartFile.getContentType()).endsWith("xml")
                && Objects.requireNonNull(multipartFile.getOriginalFilename()).endsWith(".xml")
                && multipartFile.getSize() != 0L;
    }
}
