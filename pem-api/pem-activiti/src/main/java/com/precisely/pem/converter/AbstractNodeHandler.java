package com.precisely.pem.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.Node;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Objects;

@Log4j2
public abstract class AbstractNodeHandler implements NodeHandler{
    protected NodeHandler nextHandler;

    @Override
    public void setNextHandler(NodeHandler nextHandler) {
        this.nextHandler = nextHandler;
    }

    protected void passToNext(Node node, ObjectNode outputJson, ObjectMapper objectMapper, BpmnConverterRequest request) {
        log.debug("Started {}",node.getType());
        if (nextHandler != null) {
            nextHandler.handleNode(node, outputJson, objectMapper,request);
        }
    }

    void addChildShapes(ObjectNode outputJson, ObjectNode taskChildShape) {
        if(outputJson.has("childShapes")){
            ArrayNode childShapes = (ArrayNode) outputJson.get("childShapes");
            childShapes.add(taskChildShape);
        }else
            outputJson.putArray("childShapes").add(taskChildShape);
    }

    /* SourceMap contains list of SequenceFlow Ids for each Resource, outgoing node should contain all the Flow Ids starting from source.*/
    protected static void getOutGoingNode(BpmnConverterRequest request, String resourceId, ArrayNode outgoing) {
        if(Objects.nonNull(request.getSourceMap()) && request.getSourceMap().containsKey(resourceId)){
            List<String> flows = request.getSourceMap().get(resourceId);
            for (String flowId : flows){
                outgoing.addObject().put("resourceId", flowId);
            }
        }
    }

}
