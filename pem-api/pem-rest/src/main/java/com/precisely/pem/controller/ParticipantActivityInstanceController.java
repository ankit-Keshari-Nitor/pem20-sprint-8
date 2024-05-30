package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.*;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.ParticipantActivityInstPaginationResp;
import com.precisely.pem.dtos.responses.ParticipantActivityInstResp;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.services.ActivityInstService;
import com.precisely.pem.services.ParticipantActivityInstService;
import io.swagger.v3.oas.annotations.OpenAPI31;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Participant Activity Instances", description = "Participant Activity Instance management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/pcptActivities")
@RestController
@Log4j2
public class ParticipantActivityInstanceController {

    @Autowired
    ParticipantActivityInstService participantActivityInstService;


    @Operation(summary = "Get List of Participant Activity Instances")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstPaginationResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstPaginationResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the list of Participant Activity Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There are no Participant Activity Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getParticipantActivityInstance(@RequestParam(value = "status", defaultValue = "", required = false) PcptInstStatus status,
                                                                 @RequestParam(value = "activityInstKey",defaultValue = "", required = true) String activityInstKey,
                                                                 @RequestParam(value = "activityDefnVersionKey",defaultValue = "", required = true) String activityDefnVersionKey,
                                                                 @RequestParam(value = "activityStats", defaultValue = "false", required = false) Boolean activityStats,
                                                                 @RequestParam(value = "currentTask", defaultValue = "", required = false) String currentTask,
                                                                 @RequestParam(value = "partnerName", defaultValue = "", required = false) String partnerName,
                                                                 @RequestParam(value = "progress", defaultValue = "", required = false) PcptInstProgress progress,
                                                                 @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                 @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                 @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                                 @PathVariable("sponsorContext") String sponsorContext) throws Exception{
        ParticipantActivityInstPaginationResp participantActivityInstPaginationResp = participantActivityInstService.getAllParticipantActivityInstances(sponsorContext, status ==null? "":status.toString(),activityInstKey,activityDefnVersionKey,activityStats, currentTask,partnerName, progress == null? "":progress.toString(), pageNo, pageSize,sortDir ==null? "ASC":sortDir.name());
        /*participantActivityInstPaginationResp.getContent().stream()
                .map(p ->
                {
                    Link link = null;
                    try {
                        link = linkTo(methodOn(ParticipantActivityInstanceController.class).getListOfTasks(sponsorContext, p.getPcptActivityInstKey())).withSelfRel();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    p.setTasks(link.getHref());
                    return p;
                }).collect(Collectors.toList());*/ //Enable this once the Get list of tasks Api is implemented
        return new ResponseEntity<>(participantActivityInstPaginationResp, HttpStatus.OK);
    }

    @Operation(summary = "Get Participant Activity Instance by key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping("/{pcptActivityInstKey}")
    public ResponseEntity<Object> getParticipantActivityInstanceByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey) throws Exception{
        ParticipantActivityInstResp participantActivityInstResp = participantActivityInstService.getParticipantActivityInstanceByKey(sponsorContext,pcptActivityInstKey);
        /*Link link = linkTo(methodOn(ParticipantActivityInstanceController.class).getListOfTasks(sponsorContext, pcptActivityInstKey)).withSelfRel();
        participantActivityInstResp.setTasks(link.getHref());*/ //Enable this once the Get list of tasks Api is implemented
        return new ResponseEntity<>(participantActivityInstResp,HttpStatus.OK);

    }

}
