package com.precisely.pem.dtos.shared;

import lombok.Data;

import java.io.Serializable;

@Data
public class PaginationDto implements Serializable {
    private int number;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
}
