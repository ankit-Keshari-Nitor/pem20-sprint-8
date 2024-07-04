import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.PemBpmnModel;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.service.BpmnConvertServiceImpl;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.Process;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static com.precisely.pem.dtos.Constants.PEM_PROCESS_ID;

public class BpmnConvertServiceTest {

    public static final String PEM_DEFINITIONS_EXAMPLE = "Pem Definitions 1";
    public static final String PEM_TEST_PROCESS = "PEM_TEST_PROCESS";
    BpmnConvertServiceImpl bpmnConvertService = new BpmnConvertServiceImpl();

    public static String INPUT_FILE_NAME = "user_input_sample.json";
    ObjectMapper objectMapper = new ObjectMapper();

    public String inputJson = null;

    @BeforeEach
    void setUp() {
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        inputJson = readAndGetInputFile();
    }

    @Test
    public void testReadSampleUiJsonRequest(){
        Assertions.assertNotNull(inputJson);
    }

    @Test
    public void testConvertUiJsonIntoBpmnDefinition() throws JsonProcessingException, BpmnConverterException {
        PemBpmnModel pemBpmnModel = objectMapper.readValue(inputJson,PemBpmnModel.class);

        BpmnModel bpmnModel = bpmnConvertService.convertIntoBpmnDefinition(pemBpmnModel, BpmnConverterRequest.builder().processId(PEM_TEST_PROCESS).build() );

        Assertions.assertNotNull(bpmnModel);
        Assertions.assertEquals(1,bpmnModel.getProcesses().size());

        Process process = bpmnModel.getProcesses().get(0);
        Assertions.assertEquals(PEM_DEFINITIONS_EXAMPLE,process.getName());
        Assertions.assertEquals(PEM_PROCESS_ID,process.getId());

        Assertions.assertNotEquals(0,process.getFlowElements().size());
    }

    @Test
    public void testConvertBpmnDefinitionIntoUiJson() throws JsonProcessingException, BpmnConverterException {

        BpmnModel bpmnModel = bpmnConvertService
                .convertIntoBpmnDefinition(objectMapper.readValue(inputJson,PemBpmnModel.class),BpmnConverterRequest.builder().processId(PEM_TEST_PROCESS).build() );
        PemBpmnModel pemBpmnModelOutput = bpmnConvertService.convertToPemProcess(bpmnModel, BpmnConverterRequest.builder().build());

        Assertions.assertNotNull(pemBpmnModelOutput);
        Assertions.assertEquals(PEM_DEFINITIONS_EXAMPLE,pemBpmnModelOutput.getName());
        Assertions.assertNotNull(pemBpmnModelOutput.getProcess());
        Assertions.assertNotEquals(0,pemBpmnModelOutput.getProcess().getNodes().size());
        Assertions.assertNotEquals(0,pemBpmnModelOutput.getProcess().getConnectors().size());
    }

    private static String readAndGetInputFile() {
        try {
            ClassPathResource classPathResource = new ClassPathResource(INPUT_FILE_NAME);
            Path filePath = Paths.get(classPathResource.getURI());
            return  new String(Files.readAllBytes(filePath));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
