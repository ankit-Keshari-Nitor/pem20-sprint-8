package com.precisely.pem.service;

import com.precisely.pem.converter.NodeHandler;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.PemBpmnModel;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import org.activiti.bpmn.model.BpmnModel;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

public interface BpmnConvertService {
    BpmnModel convertIntoBpmnDefinition(PemBpmnModel pemBpmnModel) ;
    Blob getBpmnConvertedBlob(InputStream is) throws IOException, SQLException, BpmnConverterException;
    PemBpmnModel convertToPemProcess(BpmnModel bpmnModel, BpmnConverterRequest request);
    NodeHandler createNodeHandlerChain();
}
