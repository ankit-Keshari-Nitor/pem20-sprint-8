package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.NodeTypes;

import static com.precisely.pem.dtos.Constants.HEIGHT;
import static com.precisely.pem.dtos.Constants.WIDTH;

public class CallActivityNodeHandler extends AbstractNodeHandler{
    @Override
    public void handleNode(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        String type = node.getType();
        if(type.equalsIgnoreCase(NodeTypes.CALL_ACTIVITY.getName())) {
            String id = node.getId();
            String name = node.getName();
            String description = node.getDescription();

            double x = node.getDiagram().getX();
            double y = node.getDiagram().getY();

            // Set Call Activity Node
            ObjectNode callActivityChildShape = objectMapper.createObjectNode();
            ObjectNode startChildShapeBounds = callActivityChildShape.putObject("bounds");
            startChildShapeBounds.putObject("lowerRight").put("x", x + WIDTH).put("y", y + HEIGHT);
            startChildShapeBounds.putObject("upperLeft").put("x", x).put("y", y);

            callActivityChildShape.putArray("childShapes");
            callActivityChildShape.putArray("dockers");

            ArrayNode outgoing = callActivityChildShape.putArray("outgoing");

            getOutGoingNode(request, id, outgoing);

            ObjectNode callActivityProperties = callActivityChildShape.putObject("properties");


            // Setting "callactivitycalledelement"
            callActivityProperties.put("callactivitycalledelement", "processId");

            // Setting "callactivityinparameters"
            ObjectNode callactivityinparameters = callActivityProperties.putObject("callactivityinparameters");
            ArrayNode inParameters = callactivityinparameters.putArray("inParameters");

            // Adding inParameters objects
            ObjectNode inParam1 = inParameters.addObject();
            inParam1.put("source", "test");
            inParam1.put("sourceExpression", "");
            inParam1.put("target", "test");

            ObjectNode inParam2 = inParameters.addObject();
            inParam2.put("source", "");
            inParam2.put("sourceExpression", "${test}");
            inParam2.put("target", "test");

            // Setting totalCount for inParameters
            callactivityinparameters.put("totalCount", 2);

            // Creating "callactivityoutparameters"
            ObjectNode callactivityoutparameters = callActivityProperties.putObject("callactivityoutparameters");
            ArrayNode outParameters = callactivityoutparameters.putArray("outParameters");

            // Adding outParameters objects
            ObjectNode outParam1 = outParameters.addObject();
            outParam1.put("source", "test");
            outParam1.put("sourceExpression", "");
            outParam1.put("target", "test");

            // Setting totalCount for outParameters
            callactivityoutparameters.put("totalCount", 1);

            callActivityProperties.put("callactivitycalledelement","");//target processId
            callActivityProperties.put("documentation",description);
            callActivityProperties.put("isforcompensation","false");
            callActivityProperties.put("looptype","None");
            callActivityProperties.put("name",name);

            callActivityChildShape.put("resourceId", id);// Identifier
            callActivityChildShape.putObject("stencil").put("id", "CallActivity");// Static identifier for Start Event

            addChildShapes(outputJson, callActivityChildShape);
        }else {
            passToNext(node, outputJson, objectMapper, request);
        }
        }
}
