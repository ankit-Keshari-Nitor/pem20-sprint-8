package com.precisely.pem.service;

import com.precisely.pem.converter.NodeHandler;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import org.springframework.core.io.InputStreamResource;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

public interface BpmnConvertService {
    Blob getBpmnConvertedBlob(InputStream is,BpmnConverterRequest bpmnConverterRequest) throws IOException, SQLException, BpmnConverterException;
    NodeHandler createNodeHandlerChain();
    InputStreamResource getPemBpmnJsonData(Blob activityDefnData) throws SQLException, XMLStreamException, IOException;
}
