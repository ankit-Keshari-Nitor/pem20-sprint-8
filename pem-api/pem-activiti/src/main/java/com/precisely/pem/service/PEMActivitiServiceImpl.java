package com.precisely.pem.service;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class PEMActivitiServiceImpl implements PEMActivitiService {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private HistoryService historyService;

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey);
    }

    @Override
    public ProcessInstance startProcessInstanceById(String processDefinitionId) {
        return runtimeService.startProcessInstanceById(processDefinitionId);
    }

    @Override
    public void completeTask(String taskId) {
        taskService.complete(taskId);
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
    public List<Task> getTasksForUser(String assignee) {
        return taskService.createTaskQuery().taskAssignee(assignee).list();
    }

    @Override
    public List<Task> getTasksForGroup(String candidateGroup) {
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
    public void deployProcessDefinition(String pathToBpmnFile) {
        try (InputStream inputStream = new FileInputStream(pathToBpmnFile)) {
            repositoryService.createDeployment()
                    .addInputStream(pathToBpmnFile, inputStream)
                    .deploy();
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
    public Map<String, Object> getTaskVariables(String taskId) {
        return taskService.getVariables(taskId);
    }

    @Override
    public void setTaskVariables(String taskId, Map<String, Object> variables) {
        taskService.setVariables(taskId, variables);
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
}
