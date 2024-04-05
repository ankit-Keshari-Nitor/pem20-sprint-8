package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VCHActivityDefnDataDto {
    public String activityDefnDataKey;
    public Blob defData;
    public LocalDateTime createTs;
    public String createdBy;
    public LocalDateTime modifyTs;
    public String modifiedBy;
}
