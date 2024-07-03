package com.precisely.pem.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.converter.*;
import com.precisely.pem.dtos.*;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import lombok.extern.log4j.Log4j2;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.*;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static com.precisely.pem.dtos.Constants.*;

@Log4j2
@Service
public class BpmnConvertServiceImpl implements BpmnConvertService{


    ObjectMapper objectMapper = new ObjectMapper();

    public BpmnConvertServiceImpl(){
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    /*This will convert pem_bpmn_json into bpmn xml definition and return BLOB which will be saved in DB.*/
    @Override
    public Blob getBpmnConvertedBlob(InputStream is,BpmnConverterRequest bpmnConverterRequest) throws IOException, SQLException, BpmnConverterException  {
        PemBpmnModel pemBpmnModel;
        try(InputStream inputStream = is) {
            pemBpmnModel  = objectMapper.readValue(inputStream, PemBpmnModel.class);
        }
        if(Objects.isNull(pemBpmnModel))
            throw new BpmnConverterException("ConvertToBpmnDefinition", "Reading Json file failed.");

        BpmnModel bpmnModel = convertIntoBpmnDefinition(pemBpmnModel,bpmnConverterRequest);

        if(Objects.isNull(bpmnModel))
            throw new BpmnConverterException("ConvertToBpmnDefinition", "Convert To BPMN Definition Failed.");

        byte[] bytes = generateBpmnXml(bpmnModel);
        log.debug("======= Bpmn XML definition generated Successfully.");

        return new SerialBlob(bytes);
    }

    private byte[] generateBpmnXml(BpmnModel bpmnModel){
        // Create the BpmnXMLConverter
        BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();

        // Convert the BpmnModel to XML
        return bpmnXMLConverter.convertToXML(bpmnModel);
    }

    /*This method will accept bmn xml definition in Blob and convert into pem bpmn json and return InputStreamResource which will be return to UI.*/
    @Override
    public InputStreamResource getPemBpmnJsonData(Blob activityDefnData) throws SQLException, XMLStreamException, IOException {
        InputStream inputStream = activityDefnData.getBinaryStream();

        XMLInputFactory xmlInputFactory = XMLInputFactory.newInstance();
        XMLStreamReader xmlStreamReader = xmlInputFactory.createXMLStreamReader(inputStream);

        BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();
        BpmnModel bpmnModel = bpmnXMLConverter.convertToBpmnModel(xmlStreamReader);

        //This will convert BPMN Model into PemBpmnModel object.
        log.debug("Conversion of Bpmn Model into Pem Bpmn Model started.");
        PemBpmnModel pemBpmnModel = convertToPemProcess(bpmnModel, BpmnConverterRequest.builder().build());

        String jsonString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(pemBpmnModel);
        InputStream bpmnModelToJsonStream = new ByteArrayInputStream(jsonString.getBytes());

        return new InputStreamResource(bpmnModelToJsonStream);
    }

    public BpmnModel convertIntoBpmnDefinition(PemBpmnModel pemBpmnModel, BpmnConverterRequest bpmnConverterRequest) {
        List<Node> nodes = pemBpmnModel.getProcess().getNodes();

        if (!nodes.isEmpty()) {
            // Create the output JSON structure
            ObjectNode outputJson = objectMapper.createObjectNode();

            // Set bounds for Canvas, can be static
            ObjectNode bounds = outputJson.putObject("bounds");
            bounds.putObject("lowerRight").put("x", 2000).put("y", 2000);
            bounds.putObject("upperLeft").put("x", 0).put("y", 0);

            // Create and configure the chain of responsibility
            NodeHandler nodeHandlerChain = createNodeHandlerChain();

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
                                    NodeTypes.SPONSOR_SUB_PROCESS.getName().equalsIgnoreCase(node.getType())).forEach(node ->
                            addDefaultSystemUserTaskForAllSubProcess(node.getNodes(),connectors, bpmnConverterRequest,node.getUserKeys(),node.getRoleKeys()));
            log.debug("======= Default System User Task For All SubProcess is added Successfully in PemBpmnModel body. ");
            // Process each node through the chain
            for (Node node : nodes) {
                nodeHandlerChain.handleNode(node, outputJson, objectMapper,bpmnConverterRequest);
            }
            log.debug("======= Creation of BPMN Json format for Nodes completed.");
            //Convert Connectors into Sequence Flow; connectors is not Node that's why not in Node's Chain
            for (Connector connectorNode : connectors) {
                sequenceFlowHandler.handleSequenceFlow(connectorNode,outputJson,objectMapper,bpmnConverterRequest);
            }
            log.debug("======= Creation of BPMN Json format for Connectors completed.");
            // Set properties for canvas
            setPropertiesForCanvas(outputJson,pemBpmnModel,bpmnConverterRequest);

            BpmnModel bpmnModel = new BpmnJsonConverter().convertToBpmnModel(outputJson);
            log.debug("======= Conversion of BPMN Json format into BPMN XML definition completed.");

            //Add custom fields in BpmnModel, fields for which we don't have BPMN JSON variable we have to manually add that in bpmn model.
            addCustomFieldsInBpmnModel(bpmnModel, nodeMap);
            log.debug("======= Add custom fields in BpmnModel completed.");

            addContextData(bpmnModel,pemBpmnModel);
            log.debug("======= Add context Data information in BpmnModel completed.");
            return bpmnModel;
        }
        return null;
    }

    private void addContextData(BpmnModel bpmnModel, PemBpmnModel pemBpmnModel) {
        Process process = bpmnModel.getProcesses().get(0);
        process.addExtensionElement(getStringExtensionElement(PROCESS_FIELD_CONTEXT_DATA,pemBpmnModel.getProcess().getProcessData().getContextData()));

        pemBpmnModel.getProcess().getNodes().forEach(node -> {
            try {
                if(NodeTypes.API_NODE.getName().equalsIgnoreCase(node.getType())){
                    // Convert the sampleResponse JSON string to a JsonNode
                    JsonNode sampleResponseNode = objectMapper.readTree(node.getApi().getSampleResponse());

                    // Create a new ObjectNode to represent the final JSON
                    ObjectNode resultNode = objectMapper.createObjectNode();
                    resultNode.set(API_FIELD_SAMPLE_RESPONSE, sampleResponseNode);

                    // Convert the resultNode to a JSON string
                    String resultJsonString = objectMapper.writeValueAsString(resultNode);

                    process.addExtensionElement(getStringExtensionElement(node.getId(),resultJsonString));

                }else if(NodeTypes.XSLT_NODE.getName().equalsIgnoreCase(node.getType())){
                    // Convert the sampleResponse JSON string to a JsonNode, getSampleOutput should be parsable input always.
                    JsonNode sampleResponseNode = objectMapper.readTree(node.getXslt().getSampleOutput());

                    // Create a new ObjectNode to represent the final JSON
                    ObjectNode resultNode = objectMapper.createObjectNode();
                    resultNode.set(XSLT_FIELD_SAMPLE_OUTPUT, sampleResponseNode);

                    // Convert the resultNode to a JSON string
                    String resultJsonString = objectMapper.writeValueAsString(resultNode);
                    process.addExtensionElement(getStringExtensionElement(node.getId(),resultJsonString));
                }
            } catch (JsonProcessingException e) {
                log.error("Context Data creation Failed. {}", e.getMessage());
            }
        });
    }

    /* This will add UserTask from System Side into each subprocess. There should be Start Node in subprocess.*/
    private void addDefaultSystemUserTaskForAllSubProcess(List<Node> subProcessNodes,List<Connector> connectors,BpmnConverterRequest request,String userKeys,String roleKeys) {

        //No SubProcess is present for this Node execution
        if(Objects.isNull(subProcessNodes) || Objects.isNull(userKeys) || Objects.isNull(roleKeys)){
            return;
        }
        List<Node> newNodes = new ArrayList<>();
       for(Node node : subProcessNodes) {
            if(NodeTypes.START.getName().equalsIgnoreCase(node.getType())){
                Node formNode = new FormNode();
                formNode.setId(SYSTEM_USER_TASK +Math.random());
                formNode.setName(SYSTEM_USER_TASK_NAME);
                formNode.setType(NodeTypes.FORM.getName());
                formNode.setDiagram(Diagram.builder()
                        .x(node.getDiagram().getX()+SYSTEM_USER_TASK_POS)
                        .y(node.getDiagram().getY()+SYSTEM_USER_TASK_POS).build());
                formNode.setUserKeys(userKeys);
                formNode.setRoleKeys(roleKeys);
                newNodes.add(formNode);

                Connector newConnector = new Connector();
                newConnector.setId(SYSTEM_CONNECTOR+Math.random());
                newConnector.setSource(formNode.getId());

                List<String> connectorIds = request.getSourceMap().get(node.getId());//get Connectors associated with StartNode
                Connector connector = request.getConnectorsMap().get(connectorIds.get(0));//Use first found Connector of StartNode.
                newConnector.setTarget(connector.getTarget());//Set Existing Connector's Target to new Connector's Target
                connector.setTarget(formNode.getId());//set tart of Existing Connector's with new FormNode

                List<String> newConnectors = new ArrayList<>();
                newConnectors.add(newConnector.getId());
                request.getSourceMap().put(formNode.getId(),newConnectors);//Added newly created FormNode into Source-ConnectorIds map.

                request.getConnectorsMap().put(newConnector.getId(), newConnector);//Update ConnectorMap

                newConnector.setDiagram(connector.getDiagram());

                //add new connector in Connectors List
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

    /* activiti:field & activiti:string is name of field added as Extension Elements as per BPMN format. */
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
        NodeHandler callActivity = new CallActivityNodeHandler();

        startEventNodeHandler.setNextHandler(endEventNodeHandler);
        endEventNodeHandler.setNextHandler(formNodeHandler);
        formNodeHandler.setNextHandler(apiNodeHandler);
        apiNodeHandler.setNextHandler(xsltNodeHandler);
        xsltNodeHandler.setNextHandler(gatewayHandler);
        gatewayHandler.setNextHandler(subProcessHandler);
        subProcessHandler.setNextHandler(callActivity);
        return startEventNodeHandler;
    }

    private void setPropertiesForCanvas(ObjectNode outputJson,PemBpmnModel pemBpmnModel,BpmnConverterRequest request) {
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
        propertiesNode.put("process_id", request.getProcessId());
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
                    log.debug("======= Pem Bpmn Node creation completed for {}",flowElement.getClass());
                    if (node != null) {
                        GraphicInfo location = bpmnModel.getLocationMap().get(flowElement.getId());
                        if (location != null) {
                            node.setDiagram(Diagram.builder().x(location.getX()).y(location.getY()).build());
                        }
                        nodes.add(node);
                    }
                }
            }
            log.debug("======= Pem Bpmn Nodes created from Bpmn Model successfully.");

            /*reverse conversion started for Connectors*/
            //Fetch all sequence flow from first layer of Nodes.
            List<FlowElement> sequenceFlowElements = new ArrayList<>(process.getFlowElements().stream().filter(flowElement -> flowElement instanceof SequenceFlow).toList());

            //Fetch all sequence flow and append in sequenceFlowElements List for all layers of subProcesses using recursive method appendSubProcessesSequenceFlow
            //Recursive Call
            process.getFlowElements().stream()
                    .filter(flowElement -> flowElement instanceof SubProcess)
                    .forEach(subprocess -> appendSubProcessesSequenceFlow((SubProcess) subprocess, sequenceFlowElements));
            log.debug("======= Generated list of all SubProcessesSequenceFlows and First layer of Sequence Flows successfully.");
            /*reverse conversion ended for Connectors*/
            for (FlowElement sequeunceFlowElement : sequenceFlowElements){
                connectors.add(createConnector((SequenceFlow) sequeunceFlowElement, bpmnModel));
            }
            log.debug("======= Generated Pem Bpmn Model Connectors successfully.");
            addContextData(process, pemProcess);
            log.debug("======= Add ContextData successfully.");
            pemProcess.setNodes(nodes);
            pemProcess.setConnectors(connectors);
            response.setProcess(pemProcess);
        }
        return response;
    }

    private void addContextData(Process process, PemProcess pemProcess) {
        String prefix = "";
        if(Objects.nonNull(process.getExtensionElements().get("activiti:field")) && !process.getExtensionElements().get("activiti:field").isEmpty()){
            prefix = "activiti:";
        }

        for (ExtensionElement element : process.getExtensionElements().get(prefix+"field")) {
            String name = element.getAttributes().get("name").get(0).getValue();
            if("contextData".equalsIgnoreCase(name)){
                String contextData = element.getChildElements().get(prefix+"string").get(0).getElementText();
                pemProcess.setProcessData(ProcessData.builder().contextData(contextData).build());
            }
        }
    }

    private static void appendSubProcessesSequenceFlow(SubProcess subprocess, List<FlowElement> sequenceFlowElements) {

        /* System Connectors Change
         * Fetching System Connectors and Update existing Connectors Target.*/
        AtomicReference<FlowElement> connector = new AtomicReference<>();
        AtomicReference<FlowElement> systemConnector = new AtomicReference<>();
        subprocess.getFlowElements().stream().filter(flowElement -> flowElement instanceof SequenceFlow).forEach(flowElement -> {
            if(flowElement.getId().contains(SYSTEM_CONNECTOR)){
                String targetRef = ((SequenceFlow) flowElement).getTargetRef();
                ((SequenceFlow)connector.get()).setTargetRef(targetRef);
                systemConnector.set(flowElement);
            }else if (((SequenceFlow) flowElement).getTargetRef().contains(SYSTEM_USER_TASK)){
                connector.set(flowElement);
            }
        });

        /*Removing System Connector from subProcess's FlowElements*/
        subprocess.getFlowElements().remove(systemConnector.get());

        /*Add all SequenceFlow present in SubProcesses into Main sequenceFlowElements List.*/
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
                    .map(location -> Diagram.builder().x((double) Constants.WIDTH /2).y(((double) Constants.HEIGHT /2)).build())
                    .collect(Collectors.toList());
            connector.setDiagram(diagrams);
        }
        return connector;
    }

}
