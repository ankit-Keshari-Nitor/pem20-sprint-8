package com.precisely.pem.service;

import lombok.extern.log4j.Log4j2;
import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@Service("XsltTransformationDelegate")
@Log4j2
public class XsltTransformationDelegate implements JavaDelegate {

    private Expression input;
    private Expression xslt;
    private Expression output;
    private Expression sampleOutput;
    private Expression type;


    @Override
    public void execute(DelegateExecution execution) throws Error {
        String serviceTaskId = (String) execution.getCurrentActivityId();

        String inputXml = (String) input.getValue(execution);
        String xsltTemplate = (String) xslt.getValue(execution);
        String xsltSampleOutput = (String) sampleOutput.getValue(execution);

        try {
            String transformedOutput = transformXmlWithXslt(inputXml, xsltTemplate);

            Map<String, Object> nodeResultsMap = new HashMap<>();
            nodeResultsMap.put("sampleOutput",xsltSampleOutput);
            nodeResultsMap.put("output",transformedOutput);
            Map<String, Object> fullContextData = execution.getVariables();
            Map<String, Object> contextData = (Map<String, Object>) fullContextData.getOrDefault("contextData", new HashMap<>());
            contextData.put(serviceTaskId, nodeResultsMap);
            fullContextData.put("contextData", contextData);
            execution.setVariables(fullContextData);
        } catch (TransformerException e) {
            handleException("Error during XSLT transformation", e);
        } catch (Exception e) {
            handleException("Unexpected error during XSLT transformation", e);
        }
    }

    private String transformXmlWithXslt(String inputXml, String xsltTemplate) throws TransformerException {
        Source xmlSource = new StreamSource(new StringReader(inputXml));
        Source xsltSource = new StreamSource(new StringReader(xsltTemplate));

        StringWriter writer = new StringWriter();
        Result result = new StreamResult(writer);

        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer(xsltSource);
        transformer.transform(xmlSource, result);

        return writer.toString();
    }

    private void handleException(String errorMessage, Exception e) throws Error {
        log.info("TRANSFORMATION_ERROR: " + errorMessage + e.getMessage());
        throw new BpmnError("TRANSFORMATION_ERROR", errorMessage);
    }

}
