package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Node {
    //common
    private String id;
    private String type;
    private String name;
    private Diagram diagram;
    //form
    private String description;
    private String userKeys;
    private String roleKeys;
    private String form;
    //xslt
    private XsltConfiguration xslt;
    //api node
    private ApiConfiguration api;
    //gateway
    private String gatewayType;
    //Sub Process
    private List<Node> nodes;
    //Call Activiti
    private String targetActivity;
    private List<Variable> inVariables;
    private List<Variable> outVariables;

}
