package com.precisely.pem.dtos.responses;

import lombok.Builder;
import lombok.Data;
import org.springframework.core.io.ByteArrayResource;

import java.io.File;

@Data
@Builder
public class ActivityDataResponse {
    private ByteArrayResource file;
    private String fileName;
}
