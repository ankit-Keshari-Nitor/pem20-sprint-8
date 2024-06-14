package com.precisely.pem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.converter.*;
import com.precisely.pem.dtos.*;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.*;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;

import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;

import static com.precisely.pem.dtos.Constants.PEM_PROCESS_ID;


public class BpmnConvertServiceImpl implements BpmnConvertService{

    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public BpmnModel convertIntoBpmnDefinition(PemBpmnModel pemBpmnModel) {
        List<Node> nodes = pemBpmnModel.getProcess().getNodes();

        if (!nodes.isEmpty()) {
            // Create the output JSON structure
            ObjectNode outputJson = objectMapper.createObjectNode();
            BpmnConverterRequest bpmnConverterRequest = new BpmnConverterRequest();

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
                List<String> connectorIds = sourceMap.getOrDefault(source,new ArrayList<>());
                connectorIds.add(connector.getId());
                sourceMap.put(source,connectorIds);
            }

            //Map nodeId with each node.
            Map<String, Node> nodeMap = nodes.stream()
                    .collect(Collectors.toMap(Node::getId, node -> node));

            //Map nodeId with each node.
            Map<String, Connector> connectorsMap = connectors.stream()
                    .collect(Collectors.toMap(Connector::getId, connector -> connector));
            bpmnConverterRequest.setConnectorsMap(connectorsMap);

            SequenceFlowHandler sequenceFlowHandler = new SequenceFlowHandler();
            bpmnConverterRequest.setSourceMap(sourceMap);

            //Mandatory userKeys and roleKeys, each subprocess has startNode present always
            nodes.stream()
                    .filter(node ->
                            NodeTypes.PARTNER_SUB_PROCESS.getName().equalsIgnoreCase(node.getType()) ||
                                    NodeTypes.SPONSOR_SUB_PROCESS.getName().equalsIgnoreCase(node.getType())).forEach(node -> {
                        addDefaultSystemUserTaskForAllSubProcess(node.getNodes(),connectors, bpmnConverterRequest,node.getUserKeys(),node.getUserKeys());
            });

            // Process each node through the chain
            for (Node node : nodes) {
                startEventNodeHandler.handleNode(node, outputJson, objectMapper,bpmnConverterRequest);
            }
            //Convert Connectors into Sequence Flow; connectors is not Node that's why not in Node's Chain
            for (Connector connectorNode : connectors) {
                sequenceFlowHandler.handleSequenceFlow(connectorNode,outputJson,objectMapper,bpmnConverterRequest);
            }
            // Set properties for canvas
            setPropertiesForCanvas(outputJson,pemBpmnModel);

            BpmnModel bpmnModel = new BpmnJsonConverter().convertToBpmnModel(outputJson);

            //Add custom fields in BpmnModel, fields for which we don't have BPMN JSON variable we have to manually add that in bpmn model.
            addCustomFieldsInBpmnModel(bpmnModel, nodeMap);

            return bpmnModel;
        }
        return null;
    }

    private void addDefaultSystemUserTaskForAllSubProcess(List<Node> subProcessNodes,List<Connector> connectors,BpmnConverterRequest request,String userKeys,String roleKeys) {

        if(Objects.isNull(subProcessNodes) || Objects.isNull(userKeys) || Objects.isNull(roleKeys)){
            //No SubProcess is present for this Node execution
            return;
        }
        List<Node> newNodes = new ArrayList<>();
       for(Node node : subProcessNodes) {
            if(NodeTypes.START.getName().equalsIgnoreCase(node.getType())){
                Node formNode = new FormNode();
                formNode.setId("SystemUserTask-"+Math.random());
                formNode.setName("User Task created by System for Sub Process");
                formNode.setType(NodeTypes.FORM.getName());
                formNode.setDiagram(Diagram.builder()
                        .x(node.getDiagram().getX()+200)
                        .y(node.getDiagram().getY()+200).build());
                formNode.setUserKeys(userKeys);
                formNode.setRoleKeys(roleKeys);
                newNodes.add(formNode);

                Connector newConnector = new Connector();
                newConnector.setId("Connector"+formNode.getId());
                newConnector.setSource(formNode.getId());

                List<String> connectorIds = request.getSourceMap().get(node.getId());
                Connector connector = request.getConnectorsMap().get(connectorIds.get(0));//Append FormNode into our Start Node's first Connector.
                newConnector.setTarget(connector.getTarget());
                connector.setTarget(formNode.getId());

                //Update SourceMap
                connectorIds.remove(0);
                connectorIds.add(newConnector.getId());

                List<String> newConnectors = new ArrayList<>();
                newConnectors.add(newConnector.getId());
                request.getSourceMap().put(formNode.getId(),newConnectors);

                //Update ConnectorMap
                request.getConnectorsMap().put(newConnector.getId(), newConnector);

                newConnector.setDiagram(connector.getDiagram());

                connectors.add(newConnector);
            }else if(NodeTypes.PARTNER_SUB_PROCESS.getName().equalsIgnoreCase(node.getType()) ||
                    NodeTypes.SPONSOR_SUB_PROCESS.getName().equalsIgnoreCase(node.getType())){
                addDefaultSystemUserTaskForAllSubProcess(node.getNodes(),connectors,request, node.getUserKeys(), node.getRoleKeys());
            }
        }
       subProcessNodes.addAll(newNodes);
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
    @Override
    public NodeHandler createNodeHandlerChain() {
        NodeHandler startEventNodeHandler = new StartNodeHandler();
        NodeHandler endEventNodeHandler = new EndNodeHandler();
        NodeHandler formNodeHandler = new FormNodeHandler();
        NodeHandler apiNodeHandler = new ApiNodeHandler();
        NodeHandler xsltNodeHandler = new XsltNodeHandler();
        NodeHandler gatewayHandler = new GatewayNodeHandler();
        NodeHandler subProcessHandler = new SubProcessHandler();

        startEventNodeHandler.setNextHandler(endEventNodeHandler);
        endEventNodeHandler.setNextHandler(formNodeHandler);
        formNodeHandler.setNextHandler(apiNodeHandler);
        apiNodeHandler.setNextHandler(xsltNodeHandler);
        xsltNodeHandler.setNextHandler(gatewayHandler);
        gatewayHandler.setNextHandler(subProcessHandler);
        return startEventNodeHandler;
    }

    private void setPropertiesForCanvas(ObjectNode outputJson,PemBpmnModel pemBpmnModel) {
        ObjectNode propertiesNode = outputJson.putObject("properties");
        propertiesNode.put("author", "");
        propertiesNode.put("creationdate", "");
        propertiesNode.put("documentation", pemBpmnModel.getDescription());
        propertiesNode.put("executionlisteners", "");
        propertiesNode.put("expressionlanguage", "http://www.w3.org/1999/XPath");
        propertiesNode.put("modificationdate", "");
        propertiesNode.put("name", pemBpmnModel.getName());
        propertiesNode.put("orientation", "horizontal");
        propertiesNode.put("process_author", "");
        propertiesNode.put("process_id", PEM_PROCESS_ID);
        propertiesNode.put("process_namespace", "http://www.activiti.org/processdef");
        propertiesNode.put("process_version", "");
        propertiesNode.put("targetnamespace", "http://www.activiti.org/processdef");
        propertiesNode.put("typelanguage", "http://www.w3.org/2001/XMLSchema");
        propertiesNode.put("version", pemBpmnModel.getSchemaVersion());

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
                .schemaVersion(5)
                .build();

        request.setBpmnModel(bpmnModel);

        List<Process> processes = bpmnModel.getProcesses();
        for (Process process : processes) {
            response.setName(process.getName());
            response.setDescription(process.getDocumentation());

            PemProcess pemProcess = PemProcess.builder().build();
            List<Node> nodes = new ArrayList<>();
            List<Connector> connectors = new ArrayList<>();

            /*reverse conversion started for Nodes*/
            for (FlowElement flowElement : process.getFlowElements()) {
                if(!(flowElement instanceof SequenceFlow)){
                    Node node = PemNodeFactory.createNode(flowElement,request);
                    if (node != null) {
                        GraphicInfo location = bpmnModel.getLocationMap().get(flowElement.getId());
                        if (location != null) {
                            node.setDiagram(Diagram.builder().x(location.getX()).y(location.getY()).build());
                        }
                        nodes.add(node);
                    }
                }
            }

            /*reverse conversion started for Connectors*/
            //Fetch all sequence flow from first layer of Nodes.
            List<FlowElement> sequenceFlowElements = new ArrayList<>(process.getFlowElements().stream().filter(flowElement -> flowElement instanceof SequenceFlow).toList());

            //Fetch all sequence flow and append in sequenceFlowElements List for all layers of subProcesses using recursive method appendSubProcessesSequenceFlow
            //TODO This can throw StackOverFlowException, need to find solution
            process.getFlowElements().stream()
                    .filter(flowElement -> flowElement instanceof SubProcess)
                    .forEach(subprocess -> appendSubProcessesSequenceFlow((SubProcess) subprocess, sequenceFlowElements));

            for (FlowElement sequeunceFlowElement : sequenceFlowElements){
                connectors.add(createConnector((SequenceFlow) sequeunceFlowElement, bpmnModel));
            }
            pemProcess.setNodes(nodes);
            pemProcess.setConnectors(connectors);
            response.setProcess(pemProcess);
        }
        return response;
    }

    private static void appendSubProcessesSequenceFlow(SubProcess subprocess, List<FlowElement> sequenceFlowElements) {
        for (FlowElement flowElement : subprocess.getFlowElements()){
            if(flowElement instanceof SequenceFlow){
                sequenceFlowElements.add(flowElement);
            }else if ( flowElement instanceof SubProcess ){
                appendSubProcessesSequenceFlow((SubProcess) flowElement,sequenceFlowElements);
            }
        }
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
