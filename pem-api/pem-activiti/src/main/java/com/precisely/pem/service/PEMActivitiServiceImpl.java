package com.precisely.pem.service;

import com.precisely.pem.config.PEMUserDetailsService;
import com.precisely.pem.dtos.task.TaskDTO;
import lombok.extern.log4j.Log4j2;
import org.activiti.api.task.model.Task;
import org.activiti.api.task.runtime.TaskRuntime;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.*;
import org.activiti.bpmn.model.Process;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.util.io.InputStreamSource;
import org.activiti.engine.impl.util.json.JSONObject;
import org.activiti.engine.runtime.ProcessInstance;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;

@Service
@DependsOn("processEngineConfiguration")
@Log4j2
public class PEMActivitiServiceImpl implements PEMActivitiService {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRuntime taskRuntime;

    @Autowired
    private RepositoryService repositoryService;


    @Autowired
    private HistoryService historyService;

    @Autowired
    private ProcessEngine processEngine;


    @Autowired
    PEMUserDetailsService pemUserDetailsService;

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey);
    }


    @Override
    public String startProcessInstanceByKey(String processDefinitionKey, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, variables).getProcessInstanceId();
    }

    @Override
    public String startProcessInstanceById(String processDefinitionId) {
        log.debug("starting Process Instance By Definition Id : " + processDefinitionId);
        String id = runtimeService.startProcessInstanceById(processDefinitionId).getProcessInstanceId();
        log.debug("started Process Instance Id : " + id);
        return id;
    }

    @Override
    public String startProcessInstanceById(String processDefinitionId, String businessKey, Map<String, Object> variables) {
        log.debug("starting Process Instance By Definition Id : " + processDefinitionId);
        String id = runtimeService.startProcessInstanceById(processDefinitionId, businessKey, variables).getProcessInstanceId();
        log.debug("started Process Instance Id : " + id);
        return id;
    }

    @Override
    public void completeUserNode(String taskId, String input) throws Exception {
        try {
            // TODO: We have not integrated authentication in application,
            //  Problem : We can not read task details without Auth
            //  Error: Unauthorized.
            //  Response if task not found for given user : Unable to find task for the given id: TaskId for user: user1 (with groups: [] & with roles: [USER]),

            // TODO : Temp code to fix above problem
            UserDetails userDetails = pemUserDetailsService.loadUserByUsername("user1");
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Read task details
            Task task = (Task) taskRuntime.task(taskId);

            ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                    .processInstanceId(task.getProcessInstanceId())
                    .singleResult();

            Map<String,Object> formData = new HashMap<>();

            formData.put("formData",input);

            runtimeService.setVariable(task.getProcessInstanceId(), task.getTaskDefinitionKey(),formData);

            Map<String, Object> variables = runtimeService.getVariables(processInstance.getProcessInstanceId());
            System.out.println(new JSONObject(variables).toString());
            Map<String, Object> localTaskVariable =  this.getTaskVariables(taskId);
            if(localTaskVariable.containsKey("draft")) {
                localTaskVariable.remove("draft");
                this.setTaskVariables(taskId, localTaskVariable);
            }

            // TODO : debug purpose we have added this log.
            Map<String, Object> updatedvariables = runtimeService.getVariables(processInstance.getProcessInstanceId());
            for (Map.Entry<String,Object> entry : updatedvariables.entrySet()){
                log.debug("Key = " + entry.getKey() + ", Value = " + entry.getValue());
            }

            taskService.complete(taskId);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public void claimTask(String taskId, String userId) {
        taskService.claim(taskId, userId);
    }

    @Override
    public void delegateTask(String taskId, String userId) {
        taskService.delegateTask(taskId, userId);
    }

    @Override
    public List<org.activiti.engine.task.Task> getTasksForUser(String assignee) {
        return taskService.createTaskQuery().taskAssignee(assignee).list();
    }

    @Override
    public List<org.activiti.engine.task.Task> getTasksForGroup(String candidateGroup) {
        return taskService.createTaskQuery().taskCandidateGroup(candidateGroup).list();
    }

    @Override
    public List<ProcessInstance> getAllProcessInstances() {
        return runtimeService.createProcessInstanceQuery().list();
    }

    @Override
    public ProcessInstance getProcessInstanceById(String processInstanceId) {
        return runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
    }

    @Override
    public void deleteProcessInstance(String processInstanceId) {
        runtimeService.deleteProcessInstance(processInstanceId, "Deleted by user");
    }

    @Override
    public String deployProcessDefinition(String name, byte[] bpmnData) {
        String id = repositoryService.createDeployment().addBytes(name + ".bpmn", bpmnData).deploy().getId();
        return repositoryService.createProcessDefinitionQuery().deploymentId(id).singleResult().getKey();
    }

    @Override
    public String deployProcessDefinition(String pathToBpmnFile) {
        try (InputStream inputStream = new FileInputStream(pathToBpmnFile)) {
            return repositoryService.createDeployment()
                    .addInputStream(pathToBpmnFile, inputStream)
                    .deploy().getId();
        } catch (IOException e) {
            throw new RuntimeException("Failed to deploy process definition", e);
        }
    }

    @Override
    public void suspendProcessDefinition(String processDefinitionId) {
        repositoryService.suspendProcessDefinitionById(processDefinitionId);
    }

    @Override
    public void activateProcessDefinition(String processDefinitionId) {
        repositoryService.activateProcessDefinitionById(processDefinitionId);
    }

    @Override
    public void deleteProcessDefinition(String processDefinitionId) {
        repositoryService.deleteDeployment(processDefinitionId, true);
    }

    @Override
    public TaskDTO getUserNodeDetails(String taskId) throws Exception {
        TaskDTO task = null;
        try {
            // TODO: We have not integrated authentication in application,
            //  Problem : We can not read task details without Auth
            //  Error: Unauthorized.
            //  Response if task not found for given user : Unable to find task for the given id: TaskId for user: user1 (with groups: [] & with roles: [USER]),

            // TODO : Temp code to fix above problem
            UserDetails userDetails = pemUserDetailsService.loadUserByUsername("user1");
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            task = mapper.map(taskRuntime.task(taskId), TaskDTO.class);

            ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                    .processInstanceId(task.getProcessInstanceId())
                    .singleResult();

            if (processInstance != null) {
                String processDefinitionId = processInstance.getProcessDefinitionId();
                // Get the BPMN model using the process definition ID
                InputStream processStream = repositoryService.getProcessModel(processDefinitionId);
                BpmnModel bpmnModel = null;

                String text = new String(processStream.readAllBytes(), StandardCharsets.UTF_8);
                //TODO need to change
                String base64String = new String(Base64.getDecoder().decode(text));
                processStream = new ByteArrayInputStream(base64String.getBytes());
                bpmnModel = new BpmnXMLConverter().convertToBpmnModel(new InputStreamSource(processStream), false, false);

                for (org.activiti.bpmn.model.Process process : bpmnModel.getProcesses()) {
                    // Iterate over the flow elements in the process
                    for (FlowElement flowElement : process.getFlowElements()) {
                        if (flowElement instanceof UserTask) {
                            UserTask userTask = (UserTask) flowElement;
                            if (flowElement.getId().equalsIgnoreCase(task.getTaskDefinitionKey())) {
                                List<FormProperty> formProperty = userTask.getFormProperties();
                                for (FormProperty item : formProperty) {
                                    if (item.getName().equalsIgnoreCase("form")) {
                                        task.setForm(item.getVariable());
                                    }
                                }
                            }
                        }
                    }
                }
            }

            task.setFormData((String) this.getTaskVariables(taskId).get("draft"));

            if(task.getFormData()!=null && task.getFormData().length()>0){
                task.setStatus("IN_PROGRESS");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
        return task;
    }

    @Override
    public Map<String, Object> getTaskVariables(String taskId) {
        return taskService.getVariablesLocal(taskId);
    }

    @Override
    public Map<String, Object> getProcessVariables(String processId) {
        return runtimeService.getVariables(processId);
    }

    @Override
    public void setTaskVariables(String taskId, Map<String, Object> variables) {
        taskService.setVariablesLocal(taskId,variables);
    }

    @Override
    public List<HistoricProcessInstance> queryHistoricProcessInstances() {
        return historyService.createHistoricProcessInstanceQuery().list();
    }

    @Override
    public List<HistoricTaskInstance> queryHistoricTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().list();
    }

    @Override
    public HistoricProcessInstance getHistoricProcessInstanceById(String processInstanceId) {
        return historyService.createHistoricProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();
    }

    @Override
    public void createUser(User user) {
    }

    @Override
    public void updateUser(User user) {
    }

    @Override
    public void deleteUser(String userId) {
    }

    @Override
    public void deleteGroup(String groupId) {
    }

    @Override
    public void deployProcess(String pathToBpmnFile) {
        deployProcessDefinition(pathToBpmnFile);
    }

    @Override
    public void undeployProcess(String deploymentId) {
        repositoryService.deleteDeployment(deploymentId, true);
    }

    @Override
    public void handleProcessEvents() {
        // Implement event handling logic here
    }

    @Override
    public boolean checkUserPermissions(String userId, String permission) {
        // Implement permission check logic here
        return true;
    }

    @Override
    public void defineAccessControlList(String processDefinitionId, List<String> userIds, List<String> groupIds) {
        // Implement ACL definition logic here
    }

    @Override
    public int countSubprocesses(Blob activityDefnData) throws SQLException, XMLStreamException {
        InputStream inputStream = activityDefnData.getBinaryStream();

        XMLInputFactory xmlInputFactory = XMLInputFactory.newInstance();
        XMLStreamReader xmlStreamReader = xmlInputFactory.createXMLStreamReader(inputStream);

        BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();
        BpmnModel bpmnModel = bpmnXMLConverter.convertToBpmnModel(xmlStreamReader);

        int subprocessCount = 0;

        for (Process process : bpmnModel.getProcesses()) {
            for (FlowElement flowElement : process.getFlowElements()) {
                if (flowElement instanceof SubProcess) {
                    subprocessCount += countSubprocessesRecursive(flowElement);
                }
            }
        }

        return subprocessCount;
    }

    private static int countSubprocessesRecursive(FlowElement flowElement) {
        int count = 0;
        if (flowElement instanceof SubProcess) {
            SubProcess subProcess = (SubProcess) flowElement;
            count++;

            // Recursive call to count subprocesses within this subprocess
            for (FlowElement subElement : subProcess.getFlowElements()) {
                count += countSubprocessesRecursive(subElement);
            }
        }

        return count;
    }

}
