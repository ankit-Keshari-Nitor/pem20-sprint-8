package com.precisely.pem.dtos;

public enum RequestType {
    INCOMING("incoming"),
    OUTGOING("outgoing");

    private String direction;
    RequestType(String direction){
        this.direction = direction;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
