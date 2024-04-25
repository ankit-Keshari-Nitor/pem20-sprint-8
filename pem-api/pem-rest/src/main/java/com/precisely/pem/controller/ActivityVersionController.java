package com.precisely.pem.controller;

import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.responses.MarkAsFinalActivityDefinitionVersionResp;
import com.precisely.pem.dtos.shared.ActivityDefnVersionDto;
import com.precisely.pem.dtos.shared.ErrorResponseDto;
import com.precisely.pem.exceptionhandler.OnlyOneDraftVersionException;
import com.precisely.pem.services.ActivityVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Size;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityVersionDefinitionList(@PathVariable(value = "activityDefnKey") String activityDefnKey,
                                                                   @RequestParam(value = "isDefault",required = false, defaultValue = "false") boolean isDefault,
                                                                   @RequestParam(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                                   @RequestParam(value = "status", defaultValue = "DRAFT", required = true) Status status,
                                                                   @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                   @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                   @RequestParam(value = "sortBy", defaultValue = "modify_ts" ,required = false) SortBy sortBy,
                                                                   @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                                   @PathVariable(value = "sponsorContext")String sponsorContext) throws Exception {
        return new ResponseEntity<>(activityVersionService.getAllVersionDefinitionList(sponsorContext,activityDefnKey,description,isDefault,pageNo, pageSize, sortBy ==null? "modify_ts":sortBy.name(), sortDir ==null? "ASC":sortDir.name(),status.getStatus()),HttpStatus.OK);
    }

    @Operation(summary = "Get Version of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnVersionDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnVersionDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "204", description = "There are no Versions for Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @GetMapping(value = "/{versionId}", produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityVersionDefinitionById(@PathVariable(value = "activityDefnKey", required = true) String activityDefnKey,
                                                                   @PathVariable(value = "versionId", required = true) Double versionId,
                                                                   @PathVariable(value = "sponsorContext", required = true)String sponsorContext) throws Exception {
        return new ResponseEntity<>(activityVersionService.getVersionDefinitionById(activityDefnKey,sponsorContext,versionId), HttpStatus.OK);
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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> createActivityDefinition(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                           @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                           @RequestPart(value = "file") @MultipartFileValidator MultipartFile file,
                                                           @RequestParam(value = "isEncrypted") boolean isEncrypted,
                                                           @RequestParam(value = "application") Application app) throws SQLException, IOException, OnlyOneDraftVersionException {
        ActivityDefnVersionResp activityDefnVersionResp = activityVersionService.createActivityDefnVersion(sponsorContext, activityDefnKey, file, isEncrypted, app.getApp());
        Link link = linkTo(methodOn(ActivityVersionController.class).createActivityDefinition(sponsorContext, activityDefnKey, file, isEncrypted, app)).withSelfRel();
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
    @PostMapping(value = "/{activityDefnVersionKey}/actions/markAsFinal", produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> markActivityDefinitionStatusAsFinal(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Retrieve all Activity Definitions: Starts");
        return  new ResponseEntity<>(activityVersionService.markAsFinalActivityDefinitionVersion(activityDefnVersionKey), HttpStatus.OK);
    }
}
