package com.precisely.pem.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.models.ApiConfig;
import com.precisely.pem.repositories.ApiConfigRepo;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.*;

@Service("RestTemplateApiService")
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

    /*@Autowired
    private ApiConfigRepo apiConfigRepo;*/

    @Override
    public void execute(DelegateExecution execution) {
        // Get the activity ID
        String serviceTaskId = (String) execution.getCurrentActivityId();

        String url1 = (String) url.getValue(execution);
        String method1 = (String) method.getValue(execution);
        String requestBody1 = (String) requestBody.getValue(execution);
        String header = (String) headers.getValue(execution);
        String requestContent = (String) requestContentType.getValue(execution);
        String responseContent = (String) requestContentType.getValue(execution);
        String apiConfig = (String) apiConfiguration.getValue(execution);
        String apiUrl = "";
        HttpHeaders headers1 = new HttpHeaders();

        ApiConfig apiConfig1 = null;
        if (!isValidUrl(url1)) {
            if (!apiConfig.isEmpty()) {
                //apiUrl = constructValidUrl(apiConfig,url1);
                //ApiConfig apiConfig1 = apiConfigRepo.findByApiConfigKey(apiConfig);
                apiConfig1 = createDummyApiConfig();
                String protocol = apiConfig1.getProtocol();
                String host = apiConfig1.getHost();
                String port = apiConfig1.getPort();

                StringBuilder apiUrl1 = new StringBuilder();
                apiUrl1.append(protocol).append("://").append(host).append(":").append(port).append(url1);
                apiUrl = apiUrl1.toString();
                byte[] base64AuthBytes = Base64.getEncoder().encode(apiConfig1.getUserName().getBytes());
                String base64Auth = new String(base64AuthBytes);
                headers1.setBasicAuth(base64Auth);
            }
        } else {
            apiUrl = url1;
        }

        headers1.setContentType(MediaType.valueOf(requestContent));
        headers1.setAccept(List.of(MediaType.valueOf(responseContent)));


        // Convert JSON string to List<Map<String, String>> using ObjectMapper
        List<Map<String, String>> headerList = null;
        try {
            headerList = objectMapper.readValue(header, new TypeReference<List<Map<String, String>>>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // Adding each key-value pair from headerList to HttpHeaders object
        for (Map<String, String> header2 : headerList) {
            for (Map.Entry<String, String> entry : header2.entrySet()) {
                headers1.add(entry.getKey(), entry.getValue());
            }
        }

        HttpEntity<String> httpEntity = new HttpEntity<>(requestBody1, headers1);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.valueOf(method1.toUpperCase()), httpEntity, String.class);

        if (response != null && response.getBody() != null) {
            Map<String, Object> fullContextData = execution.getVariables();
            //System.out.println(fullContextData);
            Map<String, Object> contextData = (Map<String, Object>) fullContextData.getOrDefault("contextData", new HashMap<>());
            // from execution get the id of the Node and pass that as the key here instead of apiDialog123
            fullContextData.put("contextData", contextData);
            contextData.put(serviceTaskId, response.getBody());
            execution.setVariables(fullContextData);
            Map<String, Object> fullContextData1 = execution.getVariables();
            System.out.println(fullContextData1);
        }
    }

    public boolean isValidUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            // Check if URL is well-formed and has a protocol, host, and path
            return url.getProtocol() != null &&
                    (url.getHost() != null || url.getAuthority() != null) &&
                    url.getPath() != null && !url.getPath().isEmpty();
        } catch (MalformedURLException e) {
            return false;
        }
    }

    public ApiConfig createDummyApiConfig() {
        ApiConfig apiConfig = new ApiConfig();
        apiConfig.setApiConfigKey("apiConfigKey");
        apiConfig.setHost("10.15.106.209");
        apiConfig.setApiName("API01");
        apiConfig.setApiKey(UUID.randomUUID().toString());
        apiConfig.setPort("9080");
        apiConfig.setProtocol("http");
        apiConfig.setCreateTs(LocalDateTime.of(2016, 8, 9, 12, 30, 0));
        apiConfig.setCreatedBy(UUID.randomUUID().toString());
        apiConfig.setModifyTs(LocalDateTime.of(2016, 8, 9, 12, 30, 0));
        apiConfig.setModifiedBy(UUID.randomUUID().toString());
        apiConfig.setUserName("test_user:test_password");
        apiConfig.setPreemptiveAuth("false");
        apiConfig.setVerifyHost("true");

        return apiConfig;
    }

}
