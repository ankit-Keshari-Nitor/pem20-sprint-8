package com.precisely.pem.dtos.shared;

import lombok.Data;

import java.io.Serializable;

@Data
public class VCHActivityDefinitionPaginationDto implements Serializable {
    private VCHActivityDefnDto vchActivityDefinitionDto;
    private  PaginationDto paginationDto;
}
