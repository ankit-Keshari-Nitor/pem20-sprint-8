package com.precisely.pem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.precisely.pem.converter.NodeHandler;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.PemBpmnModel;
import org.activiti.bpmn.model.BpmnModel;

public interface BpmnConvertService {
    BpmnModel convertIntoBpmnDefinition(PemBpmnModel pemBpmnModel) throws JsonProcessingException;
    PemBpmnModel convertToPemProcess(BpmnModel bpmnModel, BpmnConverterRequest request);
    NodeHandler createNodeHandlerChain();
}
