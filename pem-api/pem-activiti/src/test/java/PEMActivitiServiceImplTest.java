import com.precisely.pem.service.PEMActivitiServiceImpl;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.HistoryService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
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
    void StartProcessInstanceByKeyWithVariables_Positive() {
        Map<String, Object> variables = Collections.singletonMap("key", "value");
        when(runtimeService.startProcessInstanceByKey("testKey", variables)).thenReturn(mockProcessInstance);
        String result = pemActivitiService.startProcessInstanceByKey("testKey", variables);
        assertEquals(mockProcessInstance.getProcessInstanceId(), result);
    }
    @Test
    void CompleteTask_Positive() {
        doNothing().when(taskService).complete("testTaskId");
        pemActivitiService.completeTask("testTaskId");
        verify(taskService, times(1)).complete("testTaskId");
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
