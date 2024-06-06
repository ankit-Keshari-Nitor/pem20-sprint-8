package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.ApiConfiguration;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;

import static com.precisely.pem.dtos.Constants.*;

public class ApiNodeHandler extends AbstractNodeHandler{
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.API_NODE.getName())){
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();
            ApiConfiguration api = node.getApi();

            // Set EndNoneEvent
            ObjectNode apiNodeChildShape = objectMapper.createObjectNode();
            ObjectNode bounds = apiNodeChildShape.putObject("bounds");
            bounds.putObject("lowerRight").put("x", x+TASK_WIDTH).put("y", y+TASK_HEIGHT);
            bounds.putObject("upperLeft").put("x", x).put("y", y);

            apiNodeChildShape.putArray("childShapes");
            apiNodeChildShape.putArray("dockers");
            ArrayNode outgoing = apiNodeChildShape.putArray("outgoing");

            getOutGoingNode(request, id, outgoing);

            ObjectNode properties = apiNodeChildShape.putObject("properties");
            properties.put("asynchronousdefinition", "Yes");
            properties.put("exclusivedefinition", "No");
            properties.put("formkeydefinition", "");
            properties.put("formproperties", "");
            properties.put("isforcompensation", "false");
            properties.put("looptype", "None");
            properties.put("servicetaskclass", "org.test.TestClass");
            properties.put("usertaskassignment", "");

            apiNodeChildShape.put("resourceId", "servicetask");
            ObjectNode stencil = apiNodeChildShape.putObject("stencil");
            stencil.put("id", NodeTypes.API_NODE.getBpmnName());

            // Map input fields to output JSON
            properties.put("name", name);
            properties.put("documentation", description);
            apiNodeChildShape.put("resourceId", id);

            ObjectNode servicetaskfields = properties.putObject("servicetaskfields");
            ArrayNode fields = servicetaskfields.putArray("fields");

            servicetaskfields.put("totalCount", 1);

            //create field for each API Configuration
            ObjectNode apiConfigurationField = fields.addObject();
            apiConfigurationField.put("name", "apiConfiguration");
            apiConfigurationField.put("stringValue", api.getApiConfiguration());

            ObjectNode urlField = fields.addObject();
            urlField.put("name", "url");
            urlField.put("stringValue", api.getUrl());

            ObjectNode methodField = fields.addObject();
            methodField.put("name", "method");
            methodField.put("stringValue", api.getMethod());

            ObjectNode requestContentTypeField = fields.addObject();
            requestContentTypeField.put("name", "requestContentType");
            requestContentTypeField.put("stringValue", api.getRequestContentType());

            ObjectNode responseContentTypeField = fields.addObject();
            responseContentTypeField.put("name", "responseContentType");
            responseContentTypeField.put("stringValue", api.getResponseContentType());

            ObjectNode headersField = fields.addObject();
            headersField.put("name", "headers");
            headersField.put("stringValue", api.getHeaders());

            ObjectNode requestBodyField = fields.addObject();
            requestBodyField.put("name", "requestBody");
            requestBodyField.put("stringValue", api.getRequestBody());

            ObjectNode sampleResponseField = fields.addObject();
            sampleResponseField.put("name", "sampleResponse");
            sampleResponseField.put("stringValue", api.getSampleResponse());

            ObjectNode responseBodyField = fields.addObject();
            responseBodyField.put("name", "responseBody");
            responseBodyField.put("stringValue", api.getResponseBody());

            ObjectNode typeField = fields.addObject();
            typeField.put("name", "type");
            typeField.put("stringValue", type);

            addChildShapes(outputJson,apiNodeChildShape);
        }else {
            passToNext(node, outputJson, objectMapper,request);
        }
    }

}
