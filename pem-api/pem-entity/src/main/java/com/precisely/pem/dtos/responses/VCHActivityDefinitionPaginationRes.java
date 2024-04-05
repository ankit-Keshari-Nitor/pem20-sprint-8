package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VCHActivityDefinitionPaginationRes {
    private List<VCHActivityDefnDto> content;
    private PaginationDto pageContent;
}
