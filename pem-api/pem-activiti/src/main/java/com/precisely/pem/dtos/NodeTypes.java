package com.precisely.pem.dtos;

public enum NodeTypes {
    START("startEvent","StartNoneEvent"),
    END("endEvent","EndNoneEvent"),
    FORM("form","UserTask"),
    SEQUENCE("connectors","SequenceFlow"),
    API_NODE("api","ServiceTask"),
    XSLT_NODE("xslt","ServiceTask"),
    EXCLUSIVE_GATEWAY("gateway","ExclusiveGateway"),
    INCLUSIVE_GATEWAY("gateway","InclusiveGateway"),
    PARTNER_SUB_PROCESS("PartnerTask","SubProcess"),
    SYSTEM_SUB_PROCESS("SystemTask","SubProcess"),
    SPONSOR_SUB_PROCESS("SponsorTask","SubProcess"),
    CALL_ACTIVITY("linkActivity","CallActivity");

    private String name;
    private String bpmnName;
    NodeTypes(String name,String bpmnName) {
        this.name = name;
        this.bpmnName = bpmnName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBpmnName() {
        return bpmnName;
    }

    public void setBpmnName(String bpmnName) {
        this.bpmnName = bpmnName;
    }
}
