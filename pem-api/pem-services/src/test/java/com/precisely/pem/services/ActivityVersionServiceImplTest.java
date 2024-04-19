package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.models.VCHActivityDefnVersion;
import com.precisely.pem.repositories.VCHActivityDefnVersionRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;

public class ActivityVersionServiceImplTest {

    @InjectMocks
    ActivityDefinitionVersionServiceImpl activityDefinitionVersionService;
    @Mock
    private VCHActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    private ModelMapper mapper;

    @BeforeEach
    public void setup(){
        try(AutoCloseable mockitoAnnotations =  MockitoAnnotations.openMocks(this)){

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void updateMarkAsFinal() throws Exception {
        Optional<VCHActivityDefnVersion> activityDefnVersion = Optional.of(new VCHActivityDefnVersion());
        Mockito.when(activityDefnVersionRepo.findById(Mockito.anyString())).thenReturn(activityDefnVersion);

        Mockito.when(activityDefnVersionRepo.save(activityDefnVersion.get())).thenReturn(activityDefnVersion.get());

        MarkAsFinalActivityDefinitionVersionResp dto = new MarkAsFinalActivityDefinitionVersionResp();
        Mockito.when(mapper.map(Mockito.any(VCHActivityDefnVersion.class),eq(MarkAsFinalActivityDefinitionVersionResp.class)))
                .thenReturn(dto);
        MarkAsFinalActivityDefinitionVersionResp resp = activityDefinitionVersionService.
                markAsFinalActivityDefinitionVersion("9ec7e29e-9cbe-4298-bb67-a53f86868592");

        assertEquals("FINAL",resp.getStatus());
        assertNotNull(resp.getModifyTs());
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersionNotFound(){
        Optional<VCHActivityDefnVersion> activityDefnVersion = Optional.empty();
        Mockito.when(activityDefnVersionRepo.findById(Mockito.anyString())).thenReturn(activityDefnVersion);
        Exception exception = assertThrows(Exception.class, () ->{
            activityDefinitionVersionService.
                    markAsFinalActivityDefinitionVersion("9ec7e29e-9cbe-4298-bb67-a53f86868592");
        });
        assertEquals(exception.getMessage(),"Activity Definition Version not found");
    }


}
