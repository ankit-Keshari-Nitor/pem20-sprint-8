import com.precisely.pem.config.PEMUserDetailsService;
import com.precisely.pem.dtos.task.TaskDTO;
import com.precisely.pem.service.PEMActivitiServiceImpl;
import org.activiti.api.task.runtime.TaskRuntime;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PEMActivitiServiceImplTest {
    @Mock
    private RepositoryService repositoryService;
    @Mock
    private TaskService taskService;
    @Mock
    private RuntimeService runtimeService;
    @Mock
    private DeploymentBuilder deploymentBuilder;
    @Mock
    private Deployment deployment;
    @Mock
    private PEMUserDetailsService pemUserDetailsService;
    @Mock
    private TaskRuntime taskRuntime;
    @Mock
    private ModelMapper mapper;
    @Mock
    private ProcessDefinitionQuery processDefinitionQuery;
    @Mock
    private ProcessDefinition processDefinition;
    @Mock
    private Task mockTask;
    @Mock
    private ProcessInstance mockProcessInstance;
    @Mock
    private TaskQuery taskQuery;
    @Mock
    private ProcessInstanceQuery processInstanceQuery;
    @InjectMocks
    private PEMActivitiServiceImpl pemActivitiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(repositoryService.createDeployment()).thenReturn(deploymentBuilder);
        when(deploymentBuilder.addBytes(anyString(), any())).thenReturn(deploymentBuilder);
        when(deploymentBuilder.addInputStream(anyString(), any(InputStream.class))).thenReturn(deploymentBuilder);
        when(deploymentBuilder.deploy()).thenReturn(deployment);
        when(repositoryService.createProcessDefinitionQuery()).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.deploymentId(anyString())).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.singleResult()).thenReturn(processDefinition);
        when(taskService.createTaskQuery()).thenReturn(taskQuery);
        when(taskQuery.taskAssignee(anyString())).thenReturn(taskQuery);
        when(taskQuery.taskCandidateGroup(anyString())).thenReturn(taskQuery);
        when(taskQuery.list()).thenReturn(Collections.singletonList(mockTask));
        when(runtimeService.createProcessInstanceQuery()).thenReturn(processInstanceQuery);
        when(processInstanceQuery.list()).thenReturn(Collections.singletonList(mockProcessInstance));

        when(processDefinition.getKey()).thenReturn("testProcessKey");
    }

    @Test
    void StartProcessInstanceByKey_Positive() {
        when(runtimeService.startProcessInstanceByKey("testKey")).thenReturn(mockProcessInstance);
        ProcessInstance result = pemActivitiService.startProcessInstanceByKey("testKey");
        assertEquals(mockProcessInstance, result);
    }

    @Test
    void testCompleteUserNode() throws Exception {
        String taskId = "testTaskId";
        String input = "testInput";
        org.activiti.api.task.model.Task mockTask = mock( org.activiti.api.task.model.Task.class);
        ProcessInstance mockProcessInstance = mock(ProcessInstance.class);
        UserDetails mockUserDetails = mock(UserDetails.class);
        ProcessInstanceQuery mockProcessInstanceQuery = mock(ProcessInstanceQuery.class);
        when(pemUserDetailsService.loadUserByUsername(anyString())).thenReturn(mockUserDetails);
        when(taskRuntime.task(anyString())).thenReturn(mockTask);
        when(mockTask.getProcessInstanceId()).thenReturn("testProcessInstanceId");
        when(runtimeService.createProcessInstanceQuery()).thenReturn(mockProcessInstanceQuery);
        when(mockProcessInstanceQuery.processInstanceId(anyString())).thenReturn(mockProcessInstanceQuery);
        when(mockProcessInstanceQuery.singleResult()).thenReturn(mockProcessInstance);
        when(runtimeService.getVariables(anyString())).thenReturn(new HashMap<>());
        when(pemActivitiService.getTaskVariables(anyString())).thenReturn(new HashMap<>());
        pemActivitiService.completeUserNode(taskId, input);
        verify(taskRuntime, times(1)).task(taskId);
        verify(taskService, times(1)).complete(taskId);
    }

    @Test
    void testCompleteUserNodeThrowsException() {
        String taskId = "testTaskId";
        String input = "testInput";
        when(taskRuntime.task(anyString())).thenThrow(new RuntimeException("Task not found"));
        Exception exception = assertThrows(Exception.class, () -> {
            pemActivitiService.completeUserNode(taskId, input);
        });
        assertNotNull(exception);
    }

    @Test
    void testGetUserNodeDetails() throws Exception {
        String taskId = "testTaskId";
        String processInstanceId = "testProcessInstanceId";
        String processDefinitionId = "processDefinitionId";
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(taskId);
        taskDTO.setTaskDefinitionKey("userTaskKey");
        taskDTO.setProcessInstanceId("testProcessInstanceId");

        UserDetails mockUserDetails = mock(UserDetails.class);
        org.activiti.api.task.model.Task mockTask = mock( org.activiti.api.task.model.Task.class);
        ProcessInstance mockProcessInstance = mock(ProcessInstance.class);
        ProcessInstanceQuery mockProcessInstanceQuery = mock(ProcessInstanceQuery.class);

        when(pemUserDetailsService.loadUserByUsername(anyString())).thenReturn(mockUserDetails);

        when(taskRuntime.task(anyString())).thenReturn(mockTask);
        when(mockTask.getProcessInstanceId()).thenReturn(processInstanceId);

        when(runtimeService.createProcessInstanceQuery()).thenReturn(mockProcessInstanceQuery);
        when(mockProcessInstanceQuery.processInstanceId(anyString())).thenReturn(mockProcessInstanceQuery);
        when(mockProcessInstanceQuery.singleResult()).thenReturn(mockProcessInstance);
        when(mockProcessInstance.getProcessDefinitionId()).thenReturn(processDefinitionId);

        String mockBpmnContent = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGJwbW4yOmRlZmluaXRpb25zIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhtbG5zOmJwbW4yPSJodHRwOi8vd3d3Lm9tZy5vcmcvc3BlYy9CUE1OLzIwMTAwNTI0L01PREVMIiB4bWxuczpicG1uZGk9Imh0dHA6Ly93d3cub21nLm9yZy9zcGVjL0JQTU4vMjAxMDA1MjQvREkiIHhtbG5zOmRjPSJodHRwOi8vd3d3Lm9tZy5vcmcvc3BlYy9ERC8yMDEwMDUyNC9EQyIgeG1sbnM6ZGk9Imh0dHA6Ly93d3cub21nLm9yZy9zcGVjL0RELzIwMTAwNTI0L0RJIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOmFjdGl2aXRpPSJodHRwOi8vYWN0aXZpdGkub3JnL2JwbW4iIGlkPSJEZWZpbml0aW9uc18xIiBleHBvcnRlcj0ib3JnLmVjbGlwc2UuYnBtbjIubW9kZWxlci5jb3JlIiBleHBvcnRlclZlcnNpb249IjEuNS40LlJDMS12MjAyMjExMTgtMTA0Ny1CMSIgdGFyZ2V0TmFtZXNwYWNlPSJFeGFtcGxlcyI+CiAgPGJwbW4yOnByb2Nlc3MgaWQ9InV0MSIgbmFtZT0idXQxIiBpc0V4ZWN1dGFibGU9InRydWUiPgogICAgPGJwbW4yOnN0YXJ0RXZlbnQgaWQ9IlN0YXJ0RXZlbnRfMSIgbmFtZT0iU3RhcnQgSlMgRXZlbnQiPgogICAgICA8YnBtbjI6b3V0Z29pbmc+U2VxdWVuY2VGbG93XzM8L2JwbW4yOm91dGdvaW5nPgogICAgPC9icG1uMjpzdGFydEV2ZW50PgogICAgPGJwbW4yOmVuZEV2ZW50IGlkPSJFbmRFdmVudF8xIiBuYW1lPSJKUyBFbmQgRXZlbnQiPgogICAgICA8YnBtbjI6aW5jb21pbmc+U2VxdWVuY2VGbG93XzQ8L2JwbW4yOmluY29taW5nPgogICAgPC9icG1uMjplbmRFdmVudD4KICAgIDxicG1uMjp1c2VyVGFzayBpZD0iVXNlclRhc2tfMSIgbmFtZT0iVXNlciBUYXNrIDEiIGFjdGl2aXRpOmFzc2lnbmVlPSJ1c2VyMSI+Cgk8YnBtbjI6ZXh0ZW5zaW9uRWxlbWVudHM+CjxhY3Rpdml0aTpmb3JtUHJvcGVydHkgaWQ9ImZvcm0iIG5hbWU9ImZvcm0iIHR5cGU9InN0cmluZyIgdmFyaWFibGU9InsmcXVvdDtmaWVsZHMmcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDsxZjE2MTM5Ni02ODFhLTRhZTgtYjE2Zi00ZjRlNGVkMjgyYWQmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0aW5wdXQmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O0VtYWlsJnF1b3Q7LCZxdW90O2hlbHBlclRleHQmcXVvdDs6JnF1b3Q7RW50ZXIgZW1haWwmcXVvdDssJnF1b3Q7bWluJnF1b3Q7OnsmcXVvdDt2YWx1ZSZxdW90OzomcXVvdDszJnF1b3Q7LCZxdW90O21lc3NhZ2UmcXVvdDs6JnF1b3Q7dmFsdWUgc2hvdWxkIGJlIG1pbiAzIGNoYXImcXVvdDt9LCZxdW90O21heCZxdW90Ozp7JnF1b3Q7dmFsdWUmcXVvdDs6JnF1b3Q7NSZxdW90OywmcXVvdDttZXNzYWdlJnF1b3Q7OiZxdW90O3ZhbHVlIHNob3VsZCBiZSBtYXggNSBjaGFyJnF1b3Q7fSwmcXVvdDtpc1JlcXVpcmVkJnF1b3Q7OnsmcXVvdDt2YWx1ZSZxdW90Ozp0cnVlLCZxdW90O21lc3NhZ2UmcXVvdDs6JnF1b3Q7aXNSZXF1aXJlZCZxdW90O319LHsmcXVvdDtpZCZxdW90OzomcXVvdDs2ODIxMjdjMS1mODk0LTQ4OGItOTdkYi01ZDA2YmY4ZGZmODkmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0YXJlYSZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7VGV4dEFyZWEmcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDsxNDg4ZTk3YS05NzVkLTQ4MjItYjIyMy1mMGIwZmNjZjY2OTgmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtzZWxlY3QmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O1NlbGVjdCBGaWxlZCZxdW90O30seyZxdW90O2lkJnF1b3Q7OiZxdW90Ozc0NTAwMTdlLWUxNWEtNDI3OC04NmZhLWJiMDBjNDAwNjliNSZxdW90OywmcXVvdDt0eXBlJnF1b3Q7OiZxdW90O2NoZWNrYm94JnF1b3Q7LCZxdW90O2xhYmVsVGV4dCZxdW90OzomcXVvdDtDaGVjayBCb3gmcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDthNmJjZDBmOS04NDJjLTRmNmYtODhmMS1mMjMyYzJlNTlhMzAmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtyYWRpbyZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7UmFkaW8mcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDs5NDMxZjc1Ni0xMGMwLTRjYTUtYmFiMS0zYmEyN2QzM2MwYzMmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0b2dnbGUmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O1RvZ2dsZXImcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDszYjZlZDU0Ny1mNDYwLTRlZDctOWNjOS0xYzQ3ZjY0ZTM5ZTcmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtsaW5rJnF1b3Q7LCZxdW90O2xhYmVsVGV4dCZxdW90OzomcXVvdDtMaW5rJnF1b3Q7fSx7JnF1b3Q7aWQmcXVvdDs6JnF1b3Q7ZWQzZjdiNDktMDI2NS00ZmJlLThkNGEtNmJlMGE5Nzc1OTIyJnF1b3Q7LCZxdW90O3R5cGUmcXVvdDs6JnF1b3Q7ZGF0ZXBpY2tlciZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7RGF0ZSBQaWNrZXImcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDsyOWU2MWE5OC05NjhkLTQzMDMtYjc3Ny0wOTU5OTI3YWVmZTkmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0YWImcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs0Mzk2OWUxYy0xNDkwLTQ3ZDgtYjc2Ny04NmM4OWJjZTkxYjMmcXVvdDssJnF1b3Q7dGFiVGl0bGUmcXVvdDs6JnF1b3Q7VGFiLTEmcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs2YmFmNmRmNy05YTgzLTRlYWQtYmU2NS00NzExZjZhNGY4ODcmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtyYWRpbyZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7UmFkaW8gQnV0dG9uJnF1b3Q7fV19LHsmcXVvdDtpZCZxdW90OzomcXVvdDtmNjhmNjBkOS00NTM4LTQwNDctODM0My01MDRhOTI3YzhhNjYmcXVvdDssJnF1b3Q7dGFiVGl0bGUmcXVvdDs6JnF1b3Q7dGFiLTImcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs0Mzk4OWM2YS0xZThjLTRlNDAtYjAyYi03NDNmNmUwZDM1MzMmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0YXJlYSZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7VGV4dCBBcmVhJnF1b3Q7fV19XX0seyZxdW90O2lkJnF1b3Q7OiZxdW90OzZkMTNkYWE0LWRhNDItNGQxNi04NTFkLTJkZjJiMDBmYzhhZiZxdW90OywmcXVvdDt0eXBlJnF1b3Q7OiZxdW90O2J1dHRvbiZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7U3VibWl0JnF1b3Q7fV19IiByZWFkYWJsZT0iZmFsc2UiIHdyaXRhYmxlPSJmYWxzZSI+PC9hY3Rpdml0aTpmb3JtUHJvcGVydHk+CjwvYnBtbjI6ZXh0ZW5zaW9uRWxlbWVudHM+CiAgICAgIDxicG1uMjppbmNvbWluZz5TZXF1ZW5jZUZsb3dfMzwvYnBtbjI6aW5jb21pbmc+CiAgICAgIDxicG1uMjpvdXRnb2luZz5TZXF1ZW5jZUZsb3dfNDwvYnBtbjI6b3V0Z29pbmc+CiAgICA8L2JwbW4yOnVzZXJUYXNrPgogICAgPGJwbW4yOnNlcXVlbmNlRmxvdyBpZD0iU2VxdWVuY2VGbG93XzMiIHNvdXJjZVJlZj0iU3RhcnRFdmVudF8xIiB0YXJnZXRSZWY9IlVzZXJUYXNrXzEiLz4KICAgIDxicG1uMjpzZXF1ZW5jZUZsb3cgaWQ9IlNlcXVlbmNlRmxvd180IiBzb3VyY2VSZWY9IlVzZXJUYXNrXzEiIHRhcmdldFJlZj0iRW5kRXZlbnRfMSIvPgogIDwvYnBtbjI6cHJvY2Vzcz4KICA8YnBtbmRpOkJQTU5EaWFncmFtIGlkPSJCUE1ORGlhZ3JhbV8xIj4KICAgIDxicG1uZGk6QlBNTlBsYW5lIGlkPSJCUE1OUGxhbmVfMSIgYnBtbkVsZW1lbnQ9InV0MSI+CiAgICAgIDxicG1uZGk6QlBNTlNoYXBlIGlkPSJCUE1OU2hhcGVfU3RhcnRFdmVudF8xIiBicG1uRWxlbWVudD0iU3RhcnRFdmVudF8xIj4KICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iMzYuMCIgd2lkdGg9IjM2LjAiIHg9IjYyLjAiIHk9IjI1Mi4wIi8+CiAgICAgICAgPGJwbW5kaTpCUE1OTGFiZWwgaWQ9IkJQTU5MYWJlbF8xIiBsYWJlbFN0eWxlPSJCUE1OTGFiZWxTdHlsZV8xIj4KICAgICAgICAgIDxkYzpCb3VuZHMgaGVpZ2h0PSI0Mi4wIiB3aWR0aD0iNzkuMCIgeD0iNDEuMCIgeT0iMjg4LjAiLz4KICAgICAgICA8L2JwbW5kaTpCUE1OTGFiZWw+CiAgICAgIDwvYnBtbmRpOkJQTU5TaGFwZT4KICAgICAgPGJwbW5kaTpCUE1OU2hhcGUgaWQ9IkJQTU5TaGFwZV9FbmRFdmVudF8xIiBicG1uRWxlbWVudD0iRW5kRXZlbnRfMSI+CiAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjM2LjAiIHdpZHRoPSIzNi4wIiB4PSIzODEuMCIgeT0iMjUyLjAiLz4KICAgICAgICA8YnBtbmRpOkJQTU5MYWJlbCBpZD0iQlBNTkxhYmVsXzQiIGxhYmVsU3R5bGU9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjQyLjAiIHdpZHRoPSI3OC4wIiB4PSIzNjAuMCIgeT0iMjg4LjAiLz4KICAgICAgICA8L2JwbW5kaTpCUE1OTGFiZWw+CiAgICAgIDwvYnBtbmRpOkJQTU5TaGFwZT4KICAgICAgPGJwbW5kaTpCUE1OU2hhcGUgaWQ9IkJQTU5TaGFwZV9Vc2VyVGFza18xIiBicG1uRWxlbWVudD0iVXNlclRhc2tfMSIgaXNFeHBhbmRlZD0idHJ1ZSI+CiAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjUwLjAiIHdpZHRoPSIxMTAuMCIgeD0iMjAzLjAiIHk9IjI0NS4wIi8+CiAgICAgICAgPGJwbW5kaTpCUE1OTGFiZWwgaWQ9IkJQTU5MYWJlbF82IiBsYWJlbFN0eWxlPSJCUE1OTGFiZWxTdHlsZV8xIj4KICAgICAgICAgIDxkYzpCb3VuZHMgaGVpZ2h0PSIyMS4wIiB3aWR0aD0iOTguMCIgeD0iMjA5LjAiIHk9IjI1OS4wIi8+CiAgICAgICAgPC9icG1uZGk6QlBNTkxhYmVsPgogICAgICA8L2JwbW5kaTpCUE1OU2hhcGU+CiAgICAgIDxicG1uZGk6QlBNTkVkZ2UgaWQ9IkJQTU5FZGdlX1NlcXVlbmNlRmxvd18zIiBicG1uRWxlbWVudD0iU2VxdWVuY2VGbG93XzMiIHNvdXJjZUVsZW1lbnQ9IkJQTU5TaGFwZV9TdGFydEV2ZW50XzEiIHRhcmdldEVsZW1lbnQ9IkJQTU5TaGFwZV9Vc2VyVGFza18xIj4KICAgICAgICA8ZGk6d2F5cG9pbnQgeHNpOnR5cGU9ImRjOlBvaW50IiB4PSI5OC4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjE1MC4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjIwMy4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxicG1uZGk6QlBNTkxhYmVsIGlkPSJCUE1OTGFiZWxfNyIvPgogICAgICA8L2JwbW5kaTpCUE1ORWRnZT4KICAgICAgPGJwbW5kaTpCUE1ORWRnZSBpZD0iQlBNTkVkZ2VfU2VxdWVuY2VGbG93XzQiIGJwbW5FbGVtZW50PSJTZXF1ZW5jZUZsb3dfNCIgc291cmNlRWxlbWVudD0iQlBNTlNoYXBlX1VzZXJUYXNrXzEiIHRhcmdldEVsZW1lbnQ9IkJQTU5TaGFwZV9FbmRFdmVudF8xIj4KICAgICAgICA8ZGk6d2F5cG9pbnQgeHNpOnR5cGU9ImRjOlBvaW50IiB4PSIzMTMuMCIgeT0iMjcwLjAiLz4KICAgICAgICA8ZGk6d2F5cG9pbnQgeHNpOnR5cGU9ImRjOlBvaW50IiB4PSIzNDcuMCIgeT0iMjcwLjAiLz4KICAgICAgICA8ZGk6d2F5cG9pbnQgeHNpOnR5cGU9ImRjOlBvaW50IiB4PSIzODEuMCIgeT0iMjcwLjAiLz4KICAgICAgICA8YnBtbmRpOkJQTU5MYWJlbCBpZD0iQlBNTkxhYmVsXzgiLz4KICAgICAgPC9icG1uZGk6QlBNTkVkZ2U+CiAgICA8L2JwbW5kaTpCUE1OUGxhbmU+CiAgICA8YnBtbmRpOkJQTU5MYWJlbFN0eWxlIGlkPSJCUE1OTGFiZWxTdHlsZV8xIj4KICAgICAgPGRjOkZvbnQgbmFtZT0iYXJpYWwiIHNpemU9IjkuMCIvPgogICAgPC9icG1uZGk6QlBNTkxhYmVsU3R5bGU+CiAgPC9icG1uZGk6QlBNTkRpYWdyYW0+CjwvYnBtbjI6ZGVmaW5pdGlvbnM+";
        InputStream mockProcessStream = new ByteArrayInputStream(mockBpmnContent.getBytes(StandardCharsets.UTF_8));
        when(repositoryService.getProcessModel(anyString())).thenReturn(mockProcessStream);

        BpmnModel bpmnModel = new BpmnModel();
        org.activiti.bpmn.model.Process process = new org.activiti.bpmn.model.Process();
        UserTask userTask = new UserTask();
        userTask.setId("userTaskKey");
        process.addFlowElement(userTask);
        bpmnModel.addProcess(process);
        BpmnXMLConverter bpmnXMLConverter = spy(new BpmnXMLConverter());
        doReturn(bpmnModel).when(bpmnXMLConverter).convertToBpmnModel(any(), eq(false), eq(false));

        when(mapper.map(any(), eq(TaskDTO.class))).thenReturn(taskDTO);

        when(pemActivitiService.getTaskVariables(anyString())).thenReturn(new HashMap<>());

        TaskDTO result = pemActivitiService.getUserNodeDetails(taskId);

        assertNotNull(result);
        verify(taskRuntime, times(1)).task(taskId);
        verify(runtimeService, times(1)).createProcessInstanceQuery();
        verify(mockProcessInstanceQuery, times(1)).processInstanceId(processInstanceId);
        verify(mockProcessInstanceQuery, times(1)).singleResult();
        verify(repositoryService, times(1)).getProcessModel(processDefinitionId);
    }

    @Test
    void StartProcessInstanceByKeyWithVariables_Positive() {
        Map<String, Object> variables = Collections.singletonMap("key", "value");
        when(runtimeService.startProcessInstanceByKey("testKey", variables)).thenReturn(mockProcessInstance);
        String result = pemActivitiService.startProcessInstanceByKey("testKey", variables);
        assertEquals(mockProcessInstance.getProcessInstanceId(), result);
    }

    @Test
    void ClaimTask_Positive() {
        doNothing().when(taskService).claim("testTaskId", "userId");
        pemActivitiService.claimTask("testTaskId", "userId");
        verify(taskService, times(1)).claim("testTaskId", "userId");
    }

    @Test
    void DeleteProcessInstance_Positive() {
        doNothing().when(runtimeService).deleteProcessInstance("instanceId", "Deleted by user");
        pemActivitiService.deleteProcessInstance("instanceId");
        verify(runtimeService, times(1)).deleteProcessInstance("instanceId", "Deleted by user");
    }

    @Test
    void GetTasksForUser_Positive() {
        List<Task> tasks = pemActivitiService.getTasksForUser("user");
        assertFalse(tasks.isEmpty());
        assertEquals(mockTask, tasks.get(0));
    }

    @Test
    void GetTasksForGroup_Positive() {
        List<Task> tasks = pemActivitiService.getTasksForGroup("group");
        assertFalse(tasks.isEmpty());
        assertEquals(mockTask, tasks.get(0));
    }

    @Test
    void GetAllProcessInstances_Positive() {
        List<ProcessInstance> instances = pemActivitiService.getAllProcessInstances();
        assertFalse(instances.isEmpty());
        assertEquals(mockProcessInstance, instances.get(0));
    }

    /*@Test
    void deployProcessDefinition_shouldDeployProcessDefinition() {
        byte[] bpmnData = "<bpmn></bpmn>".getBytes();
        String result = pemActivitiService.deployProcessDefinition("testProcess", bpmnData);
        assertEquals("testProcessKey", result);
        verify(repositoryService, times(1)).createDeployment();
        verify(deploymentBuilder, times(1)).addBytes("testProcess.bpmn", bpmnData);
        verify(deploymentBuilder, times(1)).deploy();
        verify(processDefinitionQuery, times(1)).deploymentId(anyString());
        verify(processDefinitionQuery, times(1)).singleResult();
    }

    @Test
    void deployProcessDefinition_withPath_shouldDeployProcessDefinition() throws IOException {
        String pathToBpmnFile = "D:\\precisely-framework\\pem20\\pem-api\\pem-services\\src\\test\\resources\\Addition.bpmn20.xml";
        InputStream inputStream = new ByteArrayInputStream("<bpmn></bpmn>".getBytes());
        // Mock the file input stream
        when(repositoryService.createDeployment()).thenReturn(deploymentBuilder);
        when(deploymentBuilder.addInputStream(eq(pathToBpmnFile), any(InputStream.class))).thenReturn(deploymentBuilder);
        when(deploymentBuilder.deploy()).thenReturn(deployment);
        when(repositoryService.createProcessDefinitionQuery()).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.deploymentId(anyString())).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.singleResult()).thenReturn(processDefinition);
        String result = pemActivitiService.deployProcessDefinition(pathToBpmnFile);
        assertEquals("Addition", result);
        verify(repositoryService, times(1)).createDeployment();
        verify(deploymentBuilder, times(1)).addInputStream(eq(pathToBpmnFile), any(InputStream.class));
        verify(deploymentBuilder, times(1)).deploy();
        verify(processDefinitionQuery, times(1)).deploymentId(anyString());
        verify(processDefinitionQuery, times(1)).singleResult();
    }*/
}
