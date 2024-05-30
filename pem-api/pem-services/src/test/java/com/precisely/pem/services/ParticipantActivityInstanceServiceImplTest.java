package com.precisely.pem.services;

import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.models.PcptActivityInst;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;


import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.eq;

public class ParticipantActivityInstanceServiceImplTest extends BaseServiceTest{
    @InjectMocks
    protected ParticipantActivityInstServiceImpl participantActivityInstServiceImpl;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
    }

    @Test
    public void testGetPcptActivityInstanceOnScheduleList() throws Exception {
        Page<PcptActivityInst> page = new PageImpl<>(getListOfPcptActivityInstanceDefnObj());
        String TEST_CURRENT_DATE = LocalDateTime.now().toString();
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        Mockito.when(pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndOnScheduleProgress(
                eq(TEST_SPONSOR), eq(TEST_ACTIVITY_INSTANCE_KEY), eq(TEST_STATUS), eq(TEST_CURRENT_TASK_NAME), eq(TEST_PARTNER_NAME),eq(TEST_CURRENT_DATE),
                Mockito.any(Pageable.class))).thenReturn(page);
        PcptActivityInstDto dtoObj = new PcptActivityInstDto();
        Mockito.when(mapper.map(Mockito.any(PcptActivityInst.class), eq(PcptActivityInstDto.class))).thenReturn(dtoObj);

    }

    @Test
    public void testGetPcptActivityInstanceDelayedList() throws Exception {
        Page<PcptActivityInst> page = new PageImpl<>(getListOfPcptActivityInstanceDefnObj());
        String TEST_CURRENT_DATE = LocalDateTime.of(2024,5,20,0,0).toString();
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        Mockito.when(pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndDelayedProgress(
                eq(TEST_SPONSOR), eq(TEST_ACTIVITY_INSTANCE_KEY), eq(TEST_STATUS), eq(TEST_CURRENT_TASK_NAME), eq(TEST_PARTNER_NAME),eq(TEST_CURRENT_DATE),
                Mockito.any(Pageable.class))).thenReturn(page);
        PcptActivityInstDto dtoObj = new PcptActivityInstDto();
        Mockito.when(mapper.map(Mockito.any(PcptActivityInst.class), eq(PcptActivityInstDto.class))).thenReturn(dtoObj);

    }


    @Test
    void testGetByPcptActivityInstanceKeyAndSponsorKey() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());
        ParticipantActivityInstResp resp;
        resp = participantActivityInstServiceImpl.getParticipantActivityInstanceByKey(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY);
        assertNotNull(resp);
    }
}
