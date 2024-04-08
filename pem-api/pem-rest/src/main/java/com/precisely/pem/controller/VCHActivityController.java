package com.precisely.pem.controller;

import com.precisely.pem.Validator.LowerCaseValidator;
import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import com.precisely.pem.commonUtil.SortBy;
import com.precisely.pem.commonUtil.SortDirection;
import com.precisely.pem.dtos.responses.VCHActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.VCHCreateActivityDefinitionResp;
import com.precisely.pem.dtos.shared.VCHActivityDefnDto;
import com.precisely.pem.services.VCHActivityDefinitionService;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions")
@RestController
public class VCHActivityController {

    @Autowired
    VCHActivityDefinitionService vchActivityDefinitionService;

    Logger logger = LoggerFactory.getLogger(VCHActivityController.class);

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = VCHCreateActivityDefinitionResp.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "422", content = { @Content(schema = @Schema()) }) })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VCHCreateActivityDefinitionResp createActivityDefinition(@RequestPart(value = "name", required = true) @Size(min = 1, max = 80) @SpecialCharValidator String name,
                                                                    @RequestPart(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                                    @RequestPart(value = "file") @MultipartFileValidator MultipartFile file,
                                                                    @RequestPart(value = "application", required = true) @LowerCaseValidator String app,
                                                                    @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        return vchActivityDefinitionService.createActivityDefinition(sponsorContext, name, description, file, app);
    }

    @Operation(summary = "Retrieve all Activity Definitions", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = VCHActivityDefnPaginationRes.class), mediaType = "application/json") }),
            @ApiResponse(responseCode = "204", description = "There are no Definitions", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
    @GetMapping
    public VCHActivityDefnPaginationRes getActivityDefinitionList(@RequestParam(value = "name", required = false) @Size(min = 1, max = 80) @SpecialCharValidator String name,
                                                                  @RequestParam(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                                  @RequestParam(value = "status", defaultValue = "DRAFT", required = true) String status,
                                                                  @RequestParam(value = "application", defaultValue = "PEM", required = true) @LowerCaseValidator String application,
                                                                  @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                  @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                  @RequestParam(value = "sortBy",  required = false) SortBy sortBy,
                                                                  @RequestParam(value = "sortDir", required = false) SortDirection sortDir,
                                                                  @PathVariable(value = "sponsorContext")String sponsorContext){
        return vchActivityDefinitionService.getAllDefinitionList(sponsorContext,name,description,status,application,pageNo, pageSize, sortBy ==null? "modifyTs":sortBy.name(), sortDir ==null? "ASC":sortDir.name());
    }

    @Operation(summary = "Get Activity Definitions by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = VCHActivityDefnDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema()) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema()) }) })
    @GetMapping ("/{activityDefnKey}")
    public VCHActivityDefnDto getActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
       return  vchActivityDefinitionService.getActivityDefinitionByKey(sponsorContext, activityDefnKey);
    }
}
