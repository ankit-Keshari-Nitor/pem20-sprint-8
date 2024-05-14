package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;

import java.util.prefs.InvalidPreferencesFormatException;

public class LowerCaseValidation  implements ConstraintValidator<LowerCaseValidator, String> {
    @Override
    @SneakyThrows
    public boolean isValid(String str, ConstraintValidatorContext constraintValidatorContext) {
        boolean isAllUpperCase = StringUtils.isAllUpperCase(str);
        if(!isAllUpperCase){
            throw new InvalidPreferencesFormatException("CaseSensitiveIssue:Invalid format for application");
        }
        return true;
    }
}
