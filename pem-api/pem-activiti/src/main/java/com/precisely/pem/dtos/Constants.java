package com.precisely.pem.dtos;

public class Constants {
    public static final int HEIGHT = 200;
    public static final int WIDTH = 200;

    public static final String PEM_PROCESS_ID = "ID-PEM_TEST_PROCESS";

    public static final int SYSTEM_USER_TASK_POS = 300;
    public static final String SYSTEM_USER_TASK = "SystemUserTaskId";
    public static final String SYSTEM_USER_TASK_NAME = "User Task created by System for Sub Process";

    public static final String SYSTEM_CONNECTOR = "ConnectorTaskId";
    //field name used at Process Level.
    public static final String PROCESS_FIELD_CONTEXT_DATA = "contextData";
    public static final String PROCESS_ID_PREFIX = "ID-";

    //field name used in API Node Handler
    public static final String API_FIELD_URL = "url";
    public static final String API_FIELD_METHOD = "method";
    public static final String API_FIELD_REQUEST_CONTENT_TYPE = "requestContentType";
    public static final String API_FIELD_RESPONSE_CONTENT_TYPE = "responseContentType";
    public static final String API_FIELD_HEADERS = "headers";
    public static final String API_FIELD_REQUEST_BODY = "requestBody";
    public static final String API_FIELD_SAMPLE_RESPONSE = "sampleResponse";
    public static final String API_FIELD_RESPONSE_BODY = "responseBody";
    public static final String API_FIELD_TYPE = "type";
    public static final String API_FIELD_API_CONFIGURATION = "apiConfiguration";
    //field name used in XSLT Node Handler
    public static final String XSLT_FIELD_INPUT = "input";
    public static final String XSLT_FIELD_XSLT = "xslt";
    public static final String XSLT_FIELD_OUTPUT = "output";
    public static final String XSLT_FIELD_SAMPLE_OUTPUT = "sampleOutput";
    public static final String XSLT_FIELD_TYPE = "type";
}
