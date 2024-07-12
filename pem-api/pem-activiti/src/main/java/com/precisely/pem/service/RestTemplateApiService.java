package com.precisely.pem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.models.ApiConfig;
import com.precisely.pem.repositories.ApiConfigRepo;
import lombok.extern.log4j.Log4j2;
import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

@Service("RestTemplateApiService")
@Log4j2
public class RestTemplateApiService implements JavaDelegate {

    private Expression apiConfiguration;
    private Expression url;
    private Expression method;
    private Expression requestContentType;
    private Expression responseContentType;
    private Expression headers;
    private Expression requestBody;
    private Expression sampleResponse;
    private Expression responseBody;
    private Expression type;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public void execute(DelegateExecution execution) throws Error {
        String serviceTaskId = (String) execution.getCurrentActivityId();
        ApiConfigRepo apiConfigRepo = (ApiConfigRepo) SpringContext.getApiConfigBean();

        try {
            String apiURL = (String) url.getValue(execution);
            String apiMethod = (String) method.getValue(execution);
            String apiReqBody = (String) requestBody.getValue(execution);
            String header = (String) headers.getValue(execution);
            String requestContent = (String) requestContentType.getValue(execution);
            String responseContent = (String) responseContentType.getValue(execution);
            String sampleApiResponse = (String) sampleResponse.getValue(execution);
            String apiConfKey = (String) apiConfiguration.getValue(execution);
            String apiUrl = "";
            HttpHeaders apiHeaders = new HttpHeaders();

            ApiConfig apiConfig = null;
            if (!isValidUrl(apiURL)) {
                if (!apiConfKey.isEmpty()) {
                    apiConfig = apiConfigRepo.findByApiConfigKey(apiConfKey);
                    String protocol = apiConfig.getProtocol();
                    String host = apiConfig.getHost();
                    String port = apiConfig.getPort();

                    StringBuilder aPiURL = new StringBuilder();
                    if(!port.isEmpty()){
                        aPiURL.append(protocol).append("://").append(host).append(":").append(port).append(apiURL);
                    }else{
                        aPiURL.append(protocol).append("://").append(host).append(apiURL);
                    }
                    apiUrl = aPiURL.toString();
                    String userName = apiConfig.getUserName();
                    if(userName != null && !userName.isEmpty()){
                        byte[] base64AuthBytes = Base64.getEncoder().encode(apiConfig.getUserName().getBytes());
                        String base64Auth = new String(base64AuthBytes);
                        apiHeaders.setBasicAuth(base64Auth);
                    }
                }
            } else {
                apiUrl = apiURL;
            }
            apiHeaders = constructHttpHeaders(apiHeaders, header, requestContent, responseContent);

            HttpEntity<String> httpEntity = new HttpEntity<>(apiReqBody, apiHeaders);

            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.valueOf(apiMethod.toUpperCase()), httpEntity, String.class);

            if (response != null && response.getBody() != null) {
                Map<String, Object> processVariables = execution.getVariables();
                if (processVariables.isEmpty()) {
                    processVariables = new HashMap<>();
                }
                Map<String, Object> nodeResultData = new HashMap<>();
                nodeResultData.put("sampleResponse", sampleApiResponse);
                nodeResultData.put("responseBody", response.getBody());

                processVariables.put(serviceTaskId, nodeResultData);
                execution.setVariables(processVariables);
                log.info(processVariables);
            }
        } catch (IllegalArgumentException | HttpClientErrorException | HttpServerErrorException e) {
            handleHttpException(e);
        } catch (RestClientException | JsonProcessingException e) {
            handleGeneralException(e);
        } catch (Exception e) {
            handleUnexpectedException(e);
        }
    }

    private HttpHeaders constructHttpHeaders(HttpHeaders headers,String header, String requestContent, String responseContent) throws JsonProcessingException {
        List<Map<String, String>> headerList = objectMapper.readValue(header, new TypeReference<List<Map<String, String>>>() {});

        for (Map<String, String> headerMap : headerList) {
            for (Map.Entry<String, String> entry : headerMap.entrySet()) {
                headers.add(entry.getKey(), entry.getValue());
            }
        }

        headers.setContentType(MediaType.valueOf(requestContent));
        headers.setAccept(List.of(MediaType.valueOf(responseContent)));

        return headers;
    }

    private boolean isValidUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            return url.getProtocol() != null &&
                    (url.getHost() != null || url.getAuthority() != null) &&
                    url.getPath() != null && !url.getPath().isEmpty();
        } catch (MalformedURLException e) {
            return false;
        }
    }

    private void handleHttpException(RuntimeException e) {
        log.info("HTTP_ERROR: " + e.getMessage());
        throw new BpmnError("HTTP_ERROR", "HTTP Error occurred: " + e.getMessage());
    }

    private void handleGeneralException(Exception e) throws Error {
        log.info("GENERAL_ERROR: " + e.getMessage());
        throw new BpmnError("GENERAL_ERROR", "Error occurred: " + e.getMessage());
    }

    private void handleUnexpectedException(Exception e) throws Error {
        log.info("UNEXPECTED_ERROR: " + e.getMessage());
        throw new BpmnError("UNEXPECTED_ERROR", "Unexpected Error occurred: " + e.getMessage());
    }

}
