package com.precisely.pem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.converter.*;
import com.precisely.pem.dtos.SubProcess;
import com.precisely.pem.dtos.*;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.*;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class BpmnConvertServiceImpl implements BpmnConvertService{

    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public BpmnModel convertIntoBpmnDefinition(PemBpmnModel pemBpmnModel) throws JsonProcessingException {
        PemProcess process = pemBpmnModel.getProcess();

        List<Node> nodes = pemBpmnModel.getProcess().getNodes();

        if (!nodes.isEmpty()) {
            // Create the output JSON structure
            ObjectNode outputJson = objectMapper.createObjectNode();

            // Set bounds for Canvas, can be static
            ObjectNode bounds = outputJson.putObject("bounds");
            bounds.putObject("lowerRight").put("x", 2000).put("y", 2000);
            bounds.putObject("upperLeft").put("x", 0).put("y", 0);

            // Create and configure the chain of responsibility
            NodeHandler startEventNodeHandler = createNodeHandlerChain();

            //Maintain all the SequenceFlow resourceIds which are source to each resource like Start, End , UI Dialog
            List<Connector> connectors = pemBpmnModel.getProcess().getConnectors();
            Map<String,List<String>> sourceMap = new HashMap<>();
            for (Connector connector : connectors) {
                String source = connector.getSource();
                List<String> sources = sourceMap.getOrDefault(source,new ArrayList<>());
                sources.add(connector.getId());
                sourceMap.put(source,sources);
            }

            SequenceFlowHandler sequenceFlowHandler = new SequenceFlowHandler();
            BpmnConverterRequest bpmnConverterRequest = new BpmnConverterRequest();
            bpmnConverterRequest.setSourceMap(sourceMap);

            // Process each node through the chain
            for (Node node : nodes) {
                startEventNodeHandler.handleNode(node, outputJson, objectMapper,bpmnConverterRequest);
            }
            //Convert Connectors into Sequence Flow; connectors is not Node that's why not in Node's Chain
            for (Connector connectorNode : connectors) {
                sequenceFlowHandler.handleSequenceFlow(connectorNode,outputJson,objectMapper,bpmnConverterRequest);
            }
            // Set properties for canvas
            setPropertiesForCanvas(outputJson);
            BpmnModel bpmnModel = new BpmnJsonConverter().convertToBpmnModel(outputJson);

            //Map nodeId with each node.
            Map<String,Node> nodeMap = new HashMap<>();
            for (Node node : nodes) {
                nodeMap.put(node.getId(),node);
            }
            //Add custom fields in BpmnModel, fields for which we don't have BPMN JSON variable we have to manually add that in bpmn model.
            addCustomFieldsInBpmnModel(bpmnModel, nodeMap);

            return bpmnModel;
        }
        return null;
    }

    private void addCustomFieldsInBpmnModel(BpmnModel bpmnModel, Map<String, Node> nodeMap) {
        List<Process> processes = bpmnModel.getProcesses();
        for (Process process : processes) {
            for (FlowElement flowElement : process.getFlowElements()) {
                if ((flowElement instanceof ExclusiveGateway) || (flowElement instanceof InclusiveGateway)) {
                    Gateway gateway = (Gateway) flowElement;
                    String gatewayType = nodeMap.get(gateway.getId()).getGatewayType();
                    ExtensionElement fieldElement = getStringExtensionElement("gatewayType",gatewayType);
                    gateway.addExtensionElement(fieldElement);
                }
            }
        }
    }

    private ExtensionElement getStringExtensionElement(String name,String value) {
        ExtensionElement fieldElement = new ExtensionElement();
        fieldElement.setName("activiti:field");
        fieldElement.setNamespacePrefix("activiti");
        ExtensionAttribute attribute = new ExtensionAttribute();
        attribute.setValue(name);
        attribute.setName("name");
        fieldElement.addAttribute(attribute);

        ExtensionElement stringElement = new ExtensionElement();
        stringElement.setName("activiti:string");
        stringElement.setNamespacePrefix("activiti");
        stringElement.setElementText(value);

        fieldElement.addChildElement(stringElement);
        return fieldElement;
    }

    //Whenever new Node comes, add into the last handler to include that New Node in the chain of execution
    //Chain of Responsibility
    private NodeHandler createNodeHandlerChain() {
        NodeHandler startEventNodeHandler = new StartNodeHandler();
        NodeHandler endEventNodeHandler = new EndNodeHandler();
        NodeHandler formNodeHandler = new FormNodeHandler();
        NodeHandler apiNodeHandler = new ApiNodeHandler();
        NodeHandler xsltNodeHandler = new XsltNodeHandler();
        NodeHandler gatewayHandler = new GatewayNodeHandler();

        startEventNodeHandler.setNextHandler(endEventNodeHandler);
        endEventNodeHandler.setNextHandler(formNodeHandler);
        formNodeHandler.setNextHandler(apiNodeHandler);
        apiNodeHandler.setNextHandler(xsltNodeHandler);
        xsltNodeHandler.setNextHandler(gatewayHandler);
        return startEventNodeHandler;
    }

    private void setPropertiesForCanvas(ObjectNode outputJson) {
        ObjectNode propertiesNode = outputJson.putObject("properties");
        propertiesNode.put("author", "");
        propertiesNode.put("creationdate", "");
        propertiesNode.put("documentation", "");
        propertiesNode.put("executionlisteners", "");
        propertiesNode.put("expressionlanguage", "http://www.w3.org/1999/XPath");
        propertiesNode.put("modificationdate", "");
        propertiesNode.put("name", "Simple process");
        propertiesNode.put("orientation", "horizontal");
        propertiesNode.put("process_author", "");
        propertiesNode.put("process_id", "simpleProcess");
        propertiesNode.put("process_namespace", "http://www.activiti.org/processdef");
        propertiesNode.put("process_version", "");
        propertiesNode.put("targetnamespace", "http://www.activiti.org/processdef");
        propertiesNode.put("typelanguage", "http://www.w3.org/2001/XMLSchema");
        propertiesNode.put("version", "");

        outputJson.put("resourceId", "canvas");
        outputJson.putArray("ssextensions");
        outputJson.putObject("stencil").put("id", "BPMNDiagram");
        ObjectNode stencilset = outputJson.putObject("stencilset");
        stencilset.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
        stencilset.put("url", "../stencilsets/bpmn2.0/bpmn2.0.json");
    }

    @Override
    public PemBpmnModel convertToPemProcess(BpmnModel bpmnModel, BpmnConverterRequest request) {
        PemBpmnModel response = PemBpmnModel.builder()
                .name("PEM Activity")
                .description("This is definitions 1")
                .schemaVersion(5)
                .build();

        List<Process> processes = bpmnModel.getProcesses();
        for (Process process : processes) {
            PemProcess pemProcess = PemProcess.builder().build();
            List<Node> nodes = new ArrayList<>();
            List<Connector> connectors = new ArrayList<>();
            List<SubProcess> subProcesses = new ArrayList<>();

            for (FlowElement flowElement : process.getFlowElements()) {
                if (flowElement instanceof SequenceFlow) {
                    connectors.add(createConnector((SequenceFlow) flowElement, bpmnModel));
                } else {
                    Node node = PemNodeFactory.createNode(flowElement);
                    if (node != null) {
                        GraphicInfo location = bpmnModel.getLocationMap().get(flowElement.getId());
                        if (location != null) {
                            node.setDiagram(Diagram.builder().x(location.getX()).y(location.getY()).build());
                        }
                        nodes.add(node);
                    }
                }
            }

            pemProcess.setNodes(nodes);
            pemProcess.setConnectors(connectors);
            pemProcess.setSubProcess(subProcesses);
            response.setProcess(pemProcess);
        }

        return response;
    }

    private Connector createConnector(SequenceFlow sequenceFlow, BpmnModel bpmnModel) {
        Connector connector = Connector.builder()
                .id(sequenceFlow.getId())
                .source(sequenceFlow.getSourceRef())
                .target(sequenceFlow.getTargetRef())
                .condition(sequenceFlow.getConditionExpression())
                .build();

        List<GraphicInfo> locations = bpmnModel.getFlowLocationMap().get(sequenceFlow.getId());
        if (locations != null) {
            List<Diagram> diagrams = locations.stream()
                    .map(location -> Diagram.builder().x(location.getX()).y(location.getY()).build())
                    .collect(Collectors.toList());
            connector.setDiagram(diagrams);
        }
        return connector;
    }

}
