package com.precisely.pem.dtos.responses;

import lombok.Data;

@Data
public class GetActivitiyDefnByIdResp {
    private String defnKey;
    private String name;
    private String description;

}
