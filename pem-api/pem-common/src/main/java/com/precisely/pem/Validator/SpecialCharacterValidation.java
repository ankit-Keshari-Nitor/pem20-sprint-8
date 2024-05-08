package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SpecialCharacterValidation implements ConstraintValidator<SpecialCharValidator, String> {

    @Override
    public boolean isValid(String str, ConstraintValidatorContext constraintValidatorContext) {
        Pattern pattern = Pattern.compile("[A-Za-z0-9&@!#$%()/+=_.,:;-]+");
        Matcher matcher = pattern.matcher(str);
        return matcher.find();
    }
}
