package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.requests.UpdateActivityVersionReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.exceptionhandler.AlreadyDeletedException;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.services.ActivityVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Activity Definition Version", description = "Activity Definition Version Management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions/{activityDefnKey}/versions")
@RestController
@Log4j2
public class ActivityVersionController {

    @Autowired
    ActivityVersionService activityVersionService;

    @Operation(summary = "Retrieve all Versions of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityVersionDefnPaginationResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityVersionDefnPaginationResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "204", description = "There are no Versions for Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @GetMapping()
    public ResponseEntity<Object> getActivityVersionDefinitionList(@PathVariable(value = "activityDefnKey") String activityDefnKey,
                                                                   @RequestParam(value = "isDefault",required = false, defaultValue = "false") Boolean isDefault,
                                                                   @RequestParam(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                                   @RequestParam(value = "status", defaultValue = "DRAFT", required = true) Status status,
                                                                   @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                   @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                   @RequestParam(value = "sortBy", defaultValue = "modifyTs" ,required = false) SortBy sortBy,
                                                                   @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                                   @PathVariable(value = "sponsorContext")String sponsorContext) throws Exception {
        return new ResponseEntity<>(activityVersionService.getAllVersionDefinitionList(sponsorContext,activityDefnKey,description,isDefault,pageNo, pageSize, sortBy ==null? "modifyTs":sortBy.name(), sortDir ==null? "ASC":sortDir.name(),status.getStatus()),HttpStatus.OK);
    }

    @Operation(summary = "Get Version of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "204", description = "There are no Versions for Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @GetMapping("/{activityDefnVersionKey}")
    public ResponseEntity<Object> getActivityVersionDefinitionById(@PathVariable(value = "activityDefnKey", required = true) String activityDefnKey,
                                                                   @PathVariable(value = "activityDefnVersionKey", required = true) String activityDefnVersionKey,
                                                                   @PathVariable(value = "sponsorContext", required = true)String sponsorContext) throws Exception {
        return new ResponseEntity<>(activityVersionService.getVersionDefinitionById(activityDefnKey,sponsorContext,activityDefnVersionKey), HttpStatus.OK);
    }

    @Operation(summary = "Create an Activity Definition Version")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Exception in creating a version for given Activity Definition", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> createActivityDefinitionVersion(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                  @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                                  @Valid ActivityVersionReq activityVersionReq
    ) throws SQLException, IOException, OnlyOneDraftVersionException, ResourceNotFoundException, AlreadyDeletedException {
        ActivityDefnVersionResp activityDefnVersionResp = activityVersionService.createActivityDefnVersion(sponsorContext, activityDefnKey, activityVersionReq);
        Link link = linkTo(methodOn(ActivityVersionController.class).createActivityDefinitionVersion(sponsorContext, activityDefnKey, activityVersionReq)).withSelfRel();
        activityDefnVersionResp.setLocation(link.getHref());
        HttpHeaders headers = new HttpHeaders();
        headers.set("location", activityDefnVersionResp.getLocation());
        return new ResponseEntity<>(activityDefnVersionResp, headers, HttpStatus.CREATED);
    }

    @Operation(summary = "Mark Activity Definition Version Status as Final", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = MarkAsFinalActivityDefinitionVersionResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = MarkAsFinalActivityDefinitionVersionResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping("/{activityDefnVersionKey}/actions/markAsFinal")
    public ResponseEntity<Object> markActivityDefinitionStatusAsFinal(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Mark Activity Definition Version Status: Starts");
        return  new ResponseEntity<>(activityVersionService.markAsFinalActivityDefinitionVersion(activityDefnVersionKey), HttpStatus.OK);
    }


    @Operation(summary = "Update Activity Definition Version", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = MessageResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = MessageResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping( value = "/{activityDefnVersionKey}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<Object> updateActivityDefinitionVersion(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                      @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                                      @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey,
                                                                      @ModelAttribute @Valid UpdateActivityVersionReq updateActivityVersionReq) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Update Activity Definition Version: Starts");
        return  new ResponseEntity<>(activityVersionService.updateActivityDefnVersion(sponsorContext,activityDefnKey,activityDefnVersionKey,updateActivityVersionReq), HttpStatus.OK);
    }

    @Operation(summary = "Mark Activity Definition Version Status as Default", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = MarkAsFinalActivityDefinitionVersionResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = MarkAsFinalActivityDefinitionVersionResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping("/{activityDefnVersionKey}/actions/markAsDefault")
    public ResponseEntity<Object> markActivityDefinitionStatusAsDefault(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Retrieve all Activity Definitions: Starts");
        return  new ResponseEntity<>(activityVersionService.markAsDefaultActivityDefinitionVersion(sponsorContext,activityDefnKey,activityDefnVersionKey), HttpStatus.OK);
    }
}
