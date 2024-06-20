package com.precisely.pem.dtos;

import lombok.Builder;
import lombok.Data;
import org.activiti.bpmn.model.BpmnModel;

import java.util.List;
import java.util.Map;


@Data
@Builder
public class BpmnConverterRequest {
    Map<String, List<String>> sourceMap;
    Map<String, Connector> connectorsMap;
    BpmnModel bpmnModel;
    String processId;

}
