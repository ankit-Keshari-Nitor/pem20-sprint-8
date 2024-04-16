package com.precisely.pem.controller;

import com.precisely.pem.Validator.LowerCaseValidator;
import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import com.precisely.pem.commonUtil.Application;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.GetActivityDefnByIdResp;
import com.precisely.pem.services.ActivityDefnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions")
@RestController
public class VCHActivityController {

    @Autowired
    ActivityDefnService activityDefnService;

    Logger logger = LoggerFactory.getLogger(VCHActivityController.class);

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnResp.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ActivityDefnResp createActivityDefinition(@RequestPart(value = "name", required = true) @Size(min = 1, max = 80) @SpecialCharValidator String name,
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
            @ApiResponse(responseCode = "204", description = "There are no Definitions", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
    @GetMapping
    public ActivityDefnPaginationRes getActivityDefinitionList(@RequestParam(value = "name", required = false) @Size(min = 1, max = 80) @SpecialCharValidator String name,
                                                               @RequestParam(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                               @RequestParam(value = "status", defaultValue = "DRAFT", required = true) String status,
                                                               @RequestParam(value = "application", defaultValue = "PEM", required = true) @LowerCaseValidator String application,
                                                               @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                               @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                               @RequestParam(value = "sortBy",  required = false) SortBy sortBy,
                                                               @RequestParam(value = "sortDir", required = false) SortDirection sortDir,
                                                               @PathVariable(value = "sponsorContext")String sponsorContext){
        return activityDefnService.getAllDefinitionList(sponsorContext,name,description,status,application,pageNo, pageSize, sortBy ==null? "modifyTs":sortBy.name(), sortDir ==null? "ASC":sortDir.name());
    }

    @Operation(summary = "Get Activity Definitions by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = GetActivityDefnByIdResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
    @GetMapping ("/{activityDefnKey}")
    public GetActivityDefnByIdResp getActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
       return  activityDefnService.getActivityDefinitionByKey(sponsorContext, activityDefnKey);
    }

    @Operation(summary = "Create an Activity Definition Version")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Exception in creating a version for given Activity Definition", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping("/{activityDefnKey}/versions")
    public ResponseEntity<ActivityDefnVersionResp> createActivityDefinition(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                            @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                                            @RequestPart(value = "file") @MultipartFileValidator MultipartFile file) throws SQLException, IOException {
        //return new ResponseEntity<>(new ErrorResponse(HttpStatus.NOT_FOUND, "Product not found with id :" + id), HttpStatus.NOT_FOUND);
        return activityDefnService.createActivityDefnVersion(sponsorContext, activityDefnKey, file);
    }
}
