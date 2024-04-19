package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SpecialCharacterValidation implements ConstraintValidator<SpecialCharValidator, String> {

    @Override
    public boolean isValid(String str, ConstraintValidatorContext constraintValidatorContext) {
        Pattern pattern = Pattern.compile("[A-Za-z0-9!@#$%()+=___:;?/,`~-]");
        Matcher matcher = pattern.matcher(str);
        if (!matcher.find()) {
            throw new IllegalArgumentException("Illegal Character in String");
        }
        return true;
    }
}
