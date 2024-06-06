package com.precisely.pem.dtos;

import java.util.List;
import java.util.Map;

public class BpmnConverterRequest {
    Map<String, List<String>> sourceMap;

    public Map<String, List<String>> getSourceMap() {
        return sourceMap;
    }

    public void setSourceMap(Map<String, List<String>> sourceMap) {
        this.sourceMap = sourceMap;
    }
}
