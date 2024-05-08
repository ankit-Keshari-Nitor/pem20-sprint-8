package com.precisely.pem.dtos.requests;

import lombok.Data;

@Data
public class Participants {
    private String participantKey;
    private ContextDataNodes[] contextDataNodes;
}
