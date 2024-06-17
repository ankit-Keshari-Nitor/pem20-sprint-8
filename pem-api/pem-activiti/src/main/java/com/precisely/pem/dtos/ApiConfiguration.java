package com.precisely.pem.dtos;

public class ApiConfiguration {
    private String apiConfiguration;
    private String url;
    private String method;
    private String requestContentType;
    private String responseContentType;
    private String file;
    private String headers;
    private String requestBody;
    private String sampleResponse;
    private String responseBody;

    public String getApiConfiguration() {
        return apiConfiguration;
    }

    public void setApiConfiguration(String apiConfiguration) {
        this.apiConfiguration = apiConfiguration;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getRequestContentType() {
        return requestContentType;
    }

    public void setRequestContentType(String requestContentType) {
        this.requestContentType = requestContentType;
    }

    public String getResponseContentType() {
        return responseContentType;
    }

    public void setResponseContentType(String responseContentType) {
        this.responseContentType = responseContentType;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getHeaders() {
        return headers;
    }

    public void setHeaders(String headers) {
        this.headers = headers;
    }

    public String getRequestBody() {
        return requestBody;
    }

    public void setRequestBody(String requestBody) {
        this.requestBody = requestBody;
    }

    public String getSampleResponse() {
        return sampleResponse;
    }

    public void setSampleResponse(String sampleResponse) {
        this.sampleResponse = sampleResponse;
    }

    public String getResponseBody() {
        return responseBody;
    }

    public void setResponseBody(String responseBody) {
        this.responseBody = responseBody;
    }
}
