package com.precisely.pem.controller;

import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.commonUtil.Status;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.shared.ActivityDefnDto;
import com.precisely.pem.dtos.shared.ErrorResponseDto;
import com.precisely.pem.services.ActivityDefnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Size;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions")
@RestController
@Log4j2
public class ActivityController {

    @Autowired
    ActivityDefnService activityDefnService;

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> createActivityDefinition(@RequestPart(value = "name", required = true) @Size(min = 1, max = 80) @SpecialCharValidator String name,
                                                           @RequestPart(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                           @RequestPart(value = "file") @MultipartFileValidator MultipartFile file,
                                                           @RequestParam(value = "application", required = true) Application app,
                                                           @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        return activityDefnService.createActivityDefinition(sponsorContext, name, description, file, app.getApp());
    }

    @Operation(summary = "Retrieve all Activity Definitions", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnPaginationRes.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "404", description = "There are no Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema(implementation = ErrorResponseDto.class),
                    mediaType = "application/json") }) })
    @GetMapping
    public ResponseEntity<Object> getActivityDefinitionList(@RequestParam(value = "name", required = false) @Size(min = 1, max = 80) String name,
                                                            @RequestParam(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                            @RequestParam(value = "status", defaultValue = "DRAFT", required = true) Status status,
                                                            @RequestParam(value = "application", defaultValue = "PEM", required = true) Application application,
                                                            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                            @RequestParam(value = "sortBy", defaultValue = "modify_ts" ,required = false) SortBy sortBy,
                                                            @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                            @PathVariable(value = "sponsorContext")String sponsorContext){
        return activityDefnService.getAllDefinitionList(sponsorContext,name,description,status.getStatus(),application.getApp(),pageNo, pageSize, sortBy ==null? "modify_ts":sortBy.name(), sortDir ==null? "ASC":sortDir.name());
    }

    @Operation(summary = "Get Activity Definition by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "404", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }) })
    @GetMapping ("/{activityDefnKey}")
    public ResponseEntity<Object> getActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
        return  activityDefnService.getActivityDefinitionByKey(sponsorContext, activityDefnKey);
    }


    @Operation(summary = "Delete Activity Definition by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }) })
    @DeleteMapping("/{activityDefnKey}")
    public ResponseEntity<Object> deleteActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
        return  new ResponseEntity<>(activityDefnService.deleteActivityDefinitionById(sponsorContext, activityDefnKey), HttpStatus.OK);
    }
}
