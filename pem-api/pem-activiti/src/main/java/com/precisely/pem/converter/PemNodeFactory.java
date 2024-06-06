package com.precisely.pem.converter;

import com.precisely.pem.dtos.*;
import org.activiti.bpmn.model.*;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PemNodeFactory {
    private static final Map<Class<? extends FlowElement>, Function<FlowElement, Node>> nodeCreators = new HashMap<>();

    static {
        nodeCreators.put(StartEvent.class, PemNodeFactory::createStartNode);
        nodeCreators.put(EndEvent.class, PemNodeFactory::createEndNode);
        nodeCreators.put(UserTask.class, PemNodeFactory::createUserTaskNode);
        nodeCreators.put(ServiceTask.class, PemNodeFactory::createServiceTaskNode);
        nodeCreators.put(ExclusiveGateway.class, PemNodeFactory::createGatewayNode);
        nodeCreators.put(InclusiveGateway.class, PemNodeFactory::createGatewayNode);
    }

    public static Node createNode(FlowElement flowElement) {
        return nodeCreators.getOrDefault(flowElement.getClass(), fe -> null).apply(flowElement);
    }

    private static Node createStartNode(FlowElement flowElement) {
        StartEvent startEvent = (StartEvent) flowElement;
        return Node.builder()
                .id(startEvent.getId())
                .name(startEvent.getName())
                .type(NodeTypes.START.getName())
                .build();
    }

    private static Node createEndNode(FlowElement flowElement) {
        EndEvent endEvent = (EndEvent) flowElement;
        return Node.builder()
                .id(endEvent.getId())
                .name(endEvent.getName())
                .type(NodeTypes.END.getName())
                .build();
    }

    private static Node createUserTaskNode(FlowElement flowElement) {
        UserTask userTask = (UserTask) flowElement;
        Node node = new Node();
        node.setId(userTask.getId());
        node.setName(userTask.getName());
        node.setType(NodeTypes.FORM.getName());
        node.setForm("");//TODO
        node.setDescription(userTask.getDocumentation());
        node.setUserKeys(String.join(",", userTask.getCandidateUsers()));
        node.setRoleKeys(String.join(",", userTask.getCandidateGroups()));
        return node;
    }

    private static Node createServiceTaskNode(FlowElement flowElement) {
        ServiceTask serviceTask = (ServiceTask) flowElement;

        /**
         * create map with all the fields based on FieldName and its value
         * */
        Map<String, String> fieldValueMap = serviceTask.getFieldExtensions().stream()
                .collect(Collectors.toMap(FieldExtension::getFieldName, FieldExtension::getStringValue));
        String nodeType = fieldValueMap.get("type");

        if (nodeType.equalsIgnoreCase(NodeTypes.API_NODE.getName())) {
            Node node = new Node();
            node.setId(serviceTask.getId());
            node.setName(serviceTask.getName());
            node.setDescription(serviceTask.getDocumentation());
            node.setType(nodeType);

            ApiConfiguration apiConfiguration = new ApiConfiguration();
            apiConfiguration.setUrl(fieldValueMap.get("url"));
            apiConfiguration.setApiConfiguration(fieldValueMap.get("apiConfiguration"));
            apiConfiguration.setMethod(fieldValueMap.get("method"));
            apiConfiguration.setRequestContentType(fieldValueMap.get("requestContentType"));
            apiConfiguration.setResponseContentType(fieldValueMap.get("responseContentType"));
            apiConfiguration.setFile(fieldValueMap.get("file"));
            apiConfiguration.setHeaders(fieldValueMap.get("headers"));
            apiConfiguration.setRequestBody(fieldValueMap.get("requestBody"));
            apiConfiguration.setSampleResponse(fieldValueMap.get("sampleResponse"));
            apiConfiguration.setResponseBody(fieldValueMap.get("responseBody"));

            node.setApi(apiConfiguration);
            return node;
        } else if (nodeType.equalsIgnoreCase(NodeTypes.XSLT_NODE.getName())) {
            Node node = new Node();
            node.setId(serviceTask.getId());
            node.setName(serviceTask.getName());
            node.setDescription(serviceTask.getDocumentation());
            node.setType(nodeType);

            XsltConfiguration xsltConfiguration = new XsltConfiguration();
            xsltConfiguration.setXslt(fieldValueMap.get("xslt"));
            xsltConfiguration.setOutput(fieldValueMap.get("output"));
            xsltConfiguration.setSampleOutput(fieldValueMap.get("sampleOutput"));
            xsltConfiguration.setInput(fieldValueMap.get("input"));

            node.setXslt(xsltConfiguration);
            return node;
        }
        return null;
    }

    private static Node createGatewayNode(FlowElement flowElement) {
        Gateway gateway = (Gateway) flowElement;

        Node node = new Node();
        node.setId(gateway.getId());
        node.setName(gateway.getName());
        node.setDescription(gateway.getDocumentation());
        String gatewayType = gateway.getExtensionElements().get("activiti:field").get(0).getChildElements().get("activiti:string").get(0).getElementText();
        node.setGatewayType(gatewayType);
        node.setType(NodeTypes.EXCLUSIVE_GATEWAY.getName());
        return node;
    }
}

