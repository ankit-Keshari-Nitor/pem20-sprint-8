package com.precisely.pem.services;

import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.InstStatus;
import com.precisely.pem.commonUtil.PcptInstStatus;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.requests.ContextDataNodes;
import com.precisely.pem.dtos.requests.Partners;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.ActivityInstDto;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.models.ActivityInst;
import com.precisely.pem.models.PcptActivityInst;
import com.precisely.pem.repositories.ActivityDefnVersionRepo;
import com.precisely.pem.repositories.ActivityInstRepo;
import com.precisely.pem.repositories.PartnerRepo;
import com.precisely.pem.repositories.PcptInstRepo;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.sql.rowset.serial.SerialBlob;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Service
@Log4j2
public class ActivityInstServiceImpl implements ActivityInstService{

    @Autowired
    ActivityDefnVersionRepo activityDefnVersionRepo;

    @Autowired
    ActivityInstRepo activityInstRepo;

    @Autowired
    PcptInstRepo pcptInstRepo ;

    @Autowired
    PartnerRepo partnerRepo;

    @Override
    @Transactional
    public ActivityInstResp createActivityInstance(String sponsorContext, ActivityInstReq activityInstReq) throws ResourceNotFoundException, SQLException {
        ActivityInstResp activityInstResp = new ActivityInstResp();
        ActivityInst activityInst = null;
        ActivityInstDto activityInstDto = null;
        ModelMapper mapper = new ModelMapper();

        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

        ActivityDefnVersion activityDefnVersion = activityDefnVersionRepo.findByActivityDefnKeyVersion(activityInstReq.getActivityDefnVersionKey());
        if(Objects.isNull(activityDefnVersion) || activityDefnVersion.getActivityDefnKey().isEmpty()){
            throw new ResourceNotFoundException("NoDataFound", "No data was found for activity version key '" + activityInstReq.getActivityDefnVersionKey() + "'.");
        }

        validatePartners(activityInstReq.getPartners());

        byte[] bytes = activityInstReq.getContextData().getBytes();
        Blob blob = new SerialBlob(bytes);

        activityInstDto = ActivityInstDto.builder()
                .activityInstKey(UUID.randomUUID().toString())
                .activityDefnKeyVersion(activityInstReq.getActivityDefnVersionKey())
                .activityDefnKey(activityDefnVersion.getActivityDefnKey())
                .name(activityInstReq.getName())
                .description(activityInstReq.getDescription())
                .status(InstStatus.NEW.getInstStatus())
                .startDate(LocalDate.now().toString())
                .dueDate(activityInstReq.getDueDate().toLocalDate().toString())
                .endDate(null)
                .alertDate(activityInstReq.getAlertStartDate().toLocalDate().toString())
                .alertFrequency(activityInstReq.getAlertInterval())
                .defData(blob)
                .isEncrypted(false)
                .isDeleted(false)
                .isCreatedByPartner(false)
                .application(Application.PEM.getApp())
                .sponsorKey(sponsorInfo.getSponsorKey())
                .emailPref(null)
        .build();

        activityInst = mapper.map(activityInstDto, ActivityInst.class);
        activityInstRepo.save(activityInst);

        for(Partners partner : activityInstReq.getPartners()){
            PcptActivityInst pcptActivityInst = null;
            PcptActivityInstDto pcptActivityInstDto = null;

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = null;
            Document document = null;
            try {
                builder = factory.newDocumentBuilder();
                document = builder.parse(new InputSource(new StringReader(activityInstReq.getContextData())));
                document.getDocumentElement().normalize();
            } catch (ParserConfigurationException | IOException | SAXException e) {
                throw new RuntimeException(e);
            }
            for(ContextDataNodes nodes : partner.getContextDataNodes()) {
                NodeList xmlNodes = document.getElementsByTagName(document.getDocumentElement().getNodeName());
                for (int i = 0; i < xmlNodes.getLength(); i++) {
                    Node employee = xmlNodes.item(i);
                    if (employee.getNodeType() == Node.ELEMENT_NODE) {
                        Element empElement = (Element) employee;
                        empElement.getElementsByTagName(nodes.getNodeRef()).item(0).setTextContent(nodes.getNodeValue());
                    }
                }

                TransformerFactory transformerFactory = TransformerFactory.newInstance();
                Transformer transformer = null;
                try {
                    transformer = transformerFactory.newTransformer();
                } catch (TransformerConfigurationException e) {
                    throw new RuntimeException(e);
                }
                DOMSource source = new DOMSource(document);
                StringWriter writer = new StringWriter();
                StreamResult result = new StreamResult(writer);
                transformer.setOutputProperty(OutputKeys.INDENT, "yes");
                try {
                    transformer.transform(source, result);
                } catch (TransformerException e) {
                    throw new RuntimeException(e);
                }
                log.info("UpdatedXMl : " + writer.toString());

                byte[] pcptBytes = writer.toString().getBytes();
                Blob pcptBlob = new SerialBlob(pcptBytes);

                pcptActivityInstDto = PcptActivityInstDto.builder()
                        .pcptActivityInstKey(UUID.randomUUID().toString())
                        .activityInstKey(activityInstDto.getActivityInstKey())
                        .activityWorkflowInstKey("")
                        .partnerKey(partner.getPartnerKey())
                        .completionDate(null)
                        .dueDate(activityInstDto.getDueDate())
                        .pcptInstStatus(PcptInstStatus.NOT_STARTED.getPcptInstStatus())
                        .sponsorKey(sponsorInfo.getSponsorKey())
                        .isDeleted(false)
                        .taskCompleted(false)
                        .isEncrypted(false)
                        .mailGroupKey("")
                        .isAlreadyRolledOut(false)
                        .pcptContextData(pcptBlob)
                        .build();

                pcptActivityInst = mapper.map(pcptActivityInstDto, PcptActivityInst.class);
                pcptInstRepo.save(pcptActivityInst);
            }
        }

        activityInstResp.setActivityInstKey(activityInst.getActivityInstKey());

        return activityInstResp;
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        log.info("sponsorkey : " + sponsorInfo.getSponsorKey());
        return sponsorInfo;
    }

    private void validatePartners(List<Partners> partners) throws ResourceNotFoundException {
        ArrayList<String> invalidPartnerKey = new ArrayList<>();
        ArrayList<String> noPartnerKey = new ArrayList<>();
        if(!Objects.isNull(partners) && ((long) partners.size() != 0)){
            for(Partners partner : partners){
                Optional<com.precisely.pem.models.Partners> partnerData=partnerRepo.findById(partner.getPartnerKey());
                if(partnerData.isEmpty()){
                    noPartnerKey.add(partner.getPartnerKey());
                } else if(!partnerData.get().getPartnerStatus().equalsIgnoreCase("APPROVED")) {
                    invalidPartnerKey.add(partner.getPartnerKey());
                }
            }
            if(!noPartnerKey.isEmpty()) {
                throw new ResourceNotFoundException("Partner", "The Partner with keys " + noPartnerKey + " not found. Please check partner details.");
            }
            if(!invalidPartnerKey.isEmpty()) {
                throw new ResourceNotFoundException("Partner", "The Partner with keys " + invalidPartnerKey + " are not 'APPROVED'. Please check partner details.");
            }
        }
    }
}
