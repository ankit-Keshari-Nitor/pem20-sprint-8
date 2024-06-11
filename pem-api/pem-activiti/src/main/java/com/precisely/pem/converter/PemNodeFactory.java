package com.precisely.pem.converter;

import com.precisely.pem.dtos.*;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.*;

import java.util.*;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

public class PemNodeFactory {
    private static final Map<Class<? extends FlowElement>, BiFunction<FlowElement,BpmnConverterRequest, Node>> nodeCreators = new HashMap<>();

    static {
        nodeCreators.put(StartEvent.class, PemNodeFactory::createStartNode);
        nodeCreators.put(EndEvent.class, PemNodeFactory::createEndNode);
        nodeCreators.put(UserTask.class, PemNodeFactory::createUserTaskNode);
        nodeCreators.put(ServiceTask.class, PemNodeFactory::createServiceTaskNode);
        nodeCreators.put(ExclusiveGateway.class, PemNodeFactory::createGatewayNode);
        nodeCreators.put(InclusiveGateway.class, PemNodeFactory::createGatewayNode);
        nodeCreators.put(SubProcess.class, PemNodeFactory::createSubProcessNode);
    }

    public static Node createNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        return nodeCreators.getOrDefault(flowElement.getClass(),(fe, req) -> null).apply(flowElement,bpmnConverterRequest);
    }

    private static Node createStartNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        StartEvent startEvent = (StartEvent) flowElement;
        return Node.builder()
                .id(startEvent.getId())
                .name(startEvent.getName())
                .type(NodeTypes.START.getName())
                .build();
    }

    private static Node createEndNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
        EndEvent endEvent = (EndEvent) flowElement;
        return Node.builder()
                .id(endEvent.getId())
                .name(endEvent.getName())
                .type(NodeTypes.END.getName())
                .build();
    }

    private static Node createUserTaskNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
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

    private static Node createServiceTaskNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
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

    private static Node createGatewayNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest) {
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

    private static Node createSubProcessNode(FlowElement flowElement,BpmnConverterRequest bpmnConverterRequest){
        Node node = new Node();
        List<Node> nodes = new ArrayList<>();
        SubProcess subProcess = (SubProcess) flowElement;
        node.setId(subProcess.getId());
        node.setName(subProcess.getName());

        //get Type of Sub Process from documentation field, which was appended during generate SubProcess BPMN definition
        setTypeAndDocumentation(subProcess, node);

        for (FlowElement sub : subProcess.getFlowElements()) {
            //Recursive Call which creates SubNode again.
            Node subNode = PemNodeFactory.createNode(sub,bpmnConverterRequest);
            BpmnModel bpmnModel = bpmnConverterRequest.getBpmnModel();
            if (subNode != null && bpmnModel != null) {
                GraphicInfo location = bpmnModel.getLocationMap().get(flowElement.getId());
                if (location != null) {
                    subNode.setDiagram(Diagram.builder().x(location.getX()).y(location.getY()).build());
                }
                nodes.add(subNode);
            }
        }
        node.setNodes(nodes);
        return node;
    }
    //description=type-description
    private static void setTypeAndDocumentation(SubProcess subProcess, Node node) {
        if (Objects.nonNull(subProcess.getDocumentation())) {
            String documentation = subProcess.getDocumentation();
            if (!documentation.isEmpty()) {
                String[] parts = documentation.split("-", 2);
                if (parts.length == 2) {
                    node.setType(parts[0].trim());
                    node.setDescription(parts[1].trim());
                } else {
                    node.setType(parts[0].trim());
                    node.setDescription("");
                }
            } else {
                node.setType("");
                node.setDescription("");
            }
        } else {
            node.setType("");
            node.setDescription("");
        }

    }
}

