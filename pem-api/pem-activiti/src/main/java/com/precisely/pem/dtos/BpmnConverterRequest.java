package com.precisely.pem.dtos;

import lombok.Data;
import org.activiti.bpmn.model.BpmnModel;

import java.util.List;
import java.util.Map;


@Data
public class BpmnConverterRequest {
    Map<String, List<String>> sourceMap;
    BpmnModel bpmnModel;

}
