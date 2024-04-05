package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VCHActivityDefnVersionDto {
    public String activityDefnKeyVersion;
    public String activityDefnKey;
    public String activityDefnDataKey;
    public String version;
    public String status;
    public boolean isDefault;
    public boolean isEncrypted;
    public String encryptionKey;
    public LocalDateTime createTs;
    public String createdBy;
    public LocalDateTime modifyTs;
    public String modifiedBy;
}
