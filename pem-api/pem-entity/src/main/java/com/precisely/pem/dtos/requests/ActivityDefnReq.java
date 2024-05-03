package com.precisely.pem.dtos.requests;

import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import com.precisely.pem.commonUtil.Application;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ActivityDefnReq {
    @NotBlank
    @SpecialCharValidator
    @Size(max = 80)
    private String name;

    @SpecialCharValidator
    @Size(max = 255)
    private String description;

    @NotNull
    @MultipartFileValidator
    private MultipartFile file;

    @NotNull
    private Application application;

}
